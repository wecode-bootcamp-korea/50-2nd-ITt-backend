const userDao = require('../models/userDao')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios")
const dotenv = require('dotenv');
const error = require('../utils/error');
const kakao = require('../middlewares/kakao')
const jwtToken = require('../middlewares/jwtToken')
const { throwError } = require('../utils/error');
dotenv.config()

const adminsignup = async (data) => {
    const { email, password, kakao_id, name, is_admin } = data
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userDao.createAdmin(email, hashedPassword, kakao_id, name, is_admin);
    return { message: "SIGN_UP_SUCCESS" };
}

const kakaologin = async (code) => {

  const authToken = await kakao.accessToken(code)
  const response = authToken;
    if (!response || response.status !== 200) {
      error.throwError(400,'KAKAO CONNECTION ERROR');
    }

    const userInfo = {
      kakaoId: response.data.id,
      name: response.data.kakao_account.name,
      email: response.data.kakao_account.email,
      birthday: response.data.kakao_account.birthday,
      phone_number: response.data.kakao_account.phone_number
    };
   
    const { kakaoId, name, email, birthday, phone_number } = userInfo;

    const userData = await userDao.getUserByEmail(email);

    if (userData.length === 0) {
      await userDao.createUser(
        kakaoId,
        name,
        email,
        birthday,
        phone_number
      );
      
    const [userSearch] = await userDao.getUserByEmail(email);

    const dbUserId = userSearch.id
    const dbUserEmail = userSearch.email
    const dbUserName = userSearch.name
    const isAdmin = userSearch.is_admin
    const profileImage = userSearch.profile_image 

    const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName, isAdmin, profileImage );

    return {
        message:"SIGN_UP_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        name : dbUserName,
        is_admin : isAdmin,
        profile_image : profileImage
    };
  } else {
    const [userSearch] = await userDao.getUserByEmail(email);
    
    const dbUserId = userSearch.id;
    const dbUserEmail = userSearch.email;
    const dbUserName = userSearch.name;
    const isAdmin = userSearch.is_admin
    const profileImage = userSearch.profile_image 

      const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName, isAdmin, profileImage);
      return {
        message:"SIGN_IN_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        name : dbUserName,
        is_admin : isAdmin,
        profile_image : profileImage
    };
  }
}

const adminlogin = async (data) => {
  const email = data.email;
  const password = data.password;

  const userSearch = await userDao.getUserByEmail(email);
  
  if (userSearch.length===0) {
    throwError(400,"NON_EXISTENT_USER");
  }
  const isPasswordValid = await bcrypt.compare(password, userSearch[0].password);
  if (!isPasswordValid) {
    throwError(400,"INVALID_PASSWORD");
  }
  
  const token = jwt.sign(
    { id: userSearch[0].id, 
      email: userSearch[0].email, 
      name: userSearch[0].name, 
      isAdmin:userSearch[0].is_admin 
    }, process.env.SECRET_KEY);
  return {
    message: "ADMIN_SIGN_IN_SUCCESS",
    token : token,
    id : userSearch[0].id,
    email : userSearch[0].email,
    name : userSearch[0].name,
    is_admin : userSearch[0].is_admin
  };
}

// 유저 정보 불러오기
const userInfo = async(userTokenDecode) => {
    try{
        //토큰의 유저 ID, Email 가져오기
        const userId = userTokenDecode.id;
        const userEmail = userTokenDecode.email;

        const result = await userDao.userInfo(userId);

        return result;

    }catch(error){
        console.log(error);
        throw error
    }
}

//mypage 주문 취소
const orderCancel = async (reservationInfo, userTokenDecode) => {
    try{

        //토큰의 유저 ID, Email 가져오기
        const userId = userTokenDecode.id;
        const userEmail = userTokenDecode.email;

        console.log(reservationInfo)

        // 유저 데이터 크레딧 및 유저 정보 조회
        const selectUserInfo = await userDao.selectUserInfo(userId) // 토큰의 userId로 유저의 크레딧 조회
        const dbUserId = selectUserInfo[0].id; // db에 저장된 유저 id 정보
        const dbuserEmail = selectUserInfo[0].email; // db에 저장된 유저 email 정보

        if(userId !== dbUserId || userEmail !== dbuserEmail ){ // 토큰의 유저 id, email과 db에 유저 id와 email 비교 검증
            throw new Error("user_does_not_exist")
        }
  
        if(selectUserInfo.length === 0){ // db에서 유저가 조회되지 않았을 경우
            throw new Error("order_delete_error");
        }

        // 주문 정보 조회 하기
        const reservationId = reservationInfo.reservationIds; // 주문 내역 정보 id 담기

        let selectReserveInfo = ""; 
        let reservationAmount = 0; 

        // 결제 금액 담기
        for(let i = 0; i < reservationId.length; i++){
            selectReserveInfo = await userDao.selectReserveInfo(reservationId[i], userId);
            reservationAmount += parseInt(selectReserveInfo[0].amount, 10);
                if(selectReserveInfo.length === 0){
                    throw new Error("reservationInfo_not_found")
                }
        }
        const userCredit = selectUserInfo[0].credit; // 유저 크레딧 정보 담기

        const userTotalCredit = reservationAmount + userCredit; // 결제 가격 + 유저 크레딧

        // 결제 취소 분 크레딧 업데이트
        const updateUserCredit = await userDao.updateUserCredit(userTotalCredit, userId);
            if(updateUserCredit.affectedRows === 0){
                console.log("유저 크레딧 업데이트 에러");
                throw new Error("order_delete_error")
            }
        
        // 주문 데이터 업데이트 -> 데이터 삭제가 아닌 status 값을 cancel로 변경
        let updateOrderStatus = ""
        for(let i = 0; i < reservationId.length; i++){ // 주문 상태 값 변경 정보 조회
            updateOrderStatus =  await userDao.updateOrderStatus(reservationId[i], userId);
                if(updateOrderStatus.affectedRows === 0){
                    throw new Error("user_credit_update_fail")
                }
        }

        // 좌석 예약 상태 업데이트
            let updateSeatBooked = ""
            for(let i = 0; i < reservationId.length; i++){
                selectReserveInfo = await userDao.selectReserveInfo(reservationId[i], userId);
                updateSeatBooked = await userDao.updateSeatBooked(selectReserveInfo[0].seatId);

                if(updateSeatBooked.affectedRows === 0){
                    throw new Error("seat_status_update_fail")
                }
            }
        return true; // cancel 처리가 완료되면 true 리턴

    }catch(error){
        console.log(error)
        throw error
    }
}

//mypage 프로필 수정
const profileUpdate = async (imageUrl, userTokenDecode, userName) => {
    try{
        //유저정보
        const userId = userTokenDecode.id;
        const userEmail = userTokenDecode.email;

        // 유저 데이터 크레딧 및 유저 정보 조회
        const selectUserInfo = await userDao.selectUserInfo(userId) // 토큰의 userId로 유저의 크레딧 조회
        const dbUserId = selectUserInfo[0].id; // db에 저장된 유저 id 정보
        const dbuserEmail = selectUserInfo[0].email; // db에 저장된 유저 email 정보

        if(userId !== dbUserId || userEmail !== dbuserEmail ){ // 토큰의 유저 id, email과 db에 유저 id와 email 비교 검증
            throw new Error("user_not_found")
        }

        // 이미지만 변경 할 경우
        let result = ""
        if(imageUrl && !userName){
            result = await userDao.profileUpdate(imageUrl, userId); // 유저 id를 통해 user의 이미지 업로드
            if(result.affectedRows === 0){ // 업로드 실패시
                throw new Error("profile_update_error")
            }
        }
        
        // 유저 이름만 변경 할 경우
        if(!imageUrl && userName){
            result = await userDao.updateUserName(userName, userId);
            if(result.affectedRows === 0){
                throw new Error("userName_update_error")
            }
        }

        // 유저 이름과 프로필 변경하기
        if(imageUrl && userName){
            result = await userDao.updateUserInfo(userName, imageUrl, userId)
            if(result.affectedRows === 0){
                throw new Error("userProfile_userName_update_error")
            }
        }

        // 업데이트 된 유저 정보 반환하기
        const newUserProfileImage = await userDao.newUserProfileImage(userId);
        // console.log(newUserProfileImage);

        if(newUserProfileImage.length === 0){
            throw new Error("user_not_found");
        }
        console.log(newUserProfileImage)
        return newUserProfileImage; // 업데이트 된 유저의 새로운 프로필 이미지 반환하기

    }catch(error){
        throw error
    }
}

module.exports = {
    adminsignup,
    kakaologin,
    adminlogin,

    userInfo,
    orderCancel,
    profileUpdate
}
