<<<<<<< HEAD
const appDataSource = require('../utils/database')
=======
>>>>>>> a117495242c4ad9433925a5b1c8c3ce5bf3d519a

const appDataSource = require("../utils/database");

const getUserByEmail = async (email) => {
  const result = await appDataSource.query(
    `SELECT * FROM users 
    WHERE 
    email = ?`,
    [email]
  );
  return result;
};

const createAdmin = async (email, password, kakao_id, name, is_admin) => {
  const result = await appDataSource.query(
    `INSERT INTO users
    (
        email, 
        password,
        kakao_id,
        name,
        is_admin
    )
    VALUES 
    (?,?,?,?,?)`,
    [email, password, kakao_id, name, is_admin]
  );
  return result;
};

const createUser = async (kakaoId, name, email, birthday, phone_number) => {
  try {
    await appDataSource.query(
      `INSERT INTO users(
          kakao_id,
          name,
          email,
          birthday,
          phone_number
        ) VALUES (?,?,?,?,?)`,
      [kakaoId, name, email, birthday, phone_number]
    );
  } catch {
    const error = new Error("dataSource Error");
    error.statusCode = 400;

    throw error;
  }
}

// 유저 정보 불러오기
const userInfo = async(userId) => {
    try{
        const result = await appDataSource.query(
            `
                SELECT
                    name,
                    profile_image as profileImage
                FROM users
                WHERE id = ?
            `,[userId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 유저 정보 조회
const selectUserInfo = async(userId) =>{
    try{
        const result = await appDataSource.query(
            `
                SELECT 
                    id,
                    name,
                    email,
                    credit,
                    profile_image as profileImage
                FROM users
                WHERE id = ?
            `,[userId]
        )
        return result;
    }catch(error){
        throw error
    }
}

// 주문 내역 조회
const selectReserveInfo = async(reservationId, userId) => {
    try{
        const result = await appDataSource.query(
            `
                SELECT 
                    id,
                    amount,
                    seat_id as seatId
                FROM reservations
                WHERE id = ? and user_id =?
            `,[reservationId, userId]
        )
        return result;
    }catch(error){
        throw error;
    }
}


// 유저 크레딧 업데이트
const updateUserCredit = async(userTotalCredit, userId) => {
    try{
        const result = await appDataSource.query(
            `
                UPDATE users
                    SET credit = ?
                WHERE id = ?
            `,[userTotalCredit, userId]
        )
        return result;
    }catch(error){
        throw error;
    }
}

// 예약상태 업데이트
const updateSeatBooked = async(seatId) => {
    try{
        const result = await appDataSource.query(
            `
                UPDATE seats
                    SET is_booked = 1
                WHERE id = ?
            `,[seatId]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}


//mypage 주문 취소(유저 아이디 비교해서 삭제해야함)
const updateOrderStatus = async(reservationId, userId) => {

    try{
        const result = await appDataSource.query(
            `
                UPDATE reservations
                  SET status = "cancel"
                WHERE id = ? and user_id = ?
            `,[reservationId, userId]
        )
        return result
    }catch(error){
        throw error
    }
}

//mypage 프로필 수정
const profileUpdate = async(imageUrl, userId) => {
    try{
        const result = await appDataSource.query(
            `
            update users
            set profile_image = ?
            where id = ?
            `,[imageUrl, userId]
        )
        return result;
    }catch(error){
        throw error
    }
}


// 업로드된 프로필 이미지 반환하기
const newUserProfileImage = async(userId) =>{
    try{
        const result = await appDataSource.query(
            `
                SELECT 
                    id,
                    name,
                    email,
                    profile_image as profileImage
                FROM users
                WHERE id = ?
            `,[userId]
        )
        return result;
    }catch(error){
        throw error
    }
}

// 유저 이름 변경하기
const updateUserName = async(userName, userId) =>{
    try{
        const result = await appDataSource.query(
            `
                UPDATE users
                    SET name = ?
                WHERE id = ?
            `,[userName, userId]
        )
        console.log(result);
        return result;
    }catch(error){
        throw error
    }
}

// 유저 이름과 프로필 변경하기
const updateUserInfo = async(userName, imageUrl, userId) =>{
    try{
        const result = await appDataSource.query(
            `
                UPDATE users
                SET name = ?, profile_image = ?
                WHERE id = ?
            `,[userName, imageUrl, userId]
        )
        console.log(result);
        return result;
    }catch(error){
        console.log(error)
        throw error
    }
}

module.exports = {
  createAdmin,
  getUserByEmail,
  createUser,

  userInfo,
  selectUserInfo,
  selectReserveInfo,
  updateUserCredit,
  updateOrderStatus,
  updateSeatBooked,
  profileUpdate,
  newUserProfileImage,
  updateUserName,
  updateUserInfo
};
