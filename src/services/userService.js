const userDao = require("../models/userDao")

//mypage 주문 취소
const orderDelete = async (reservationId, totalAmount) => {

    try{
        //유저정보 토큰에서 빼오기(작성해야함) -> 미들웨어 이용하여 컨트롤에서 req.user로 받아올거임
        const userId = 1;

        // 유저 데이터 크레딧 조회
        const selectUserCredit = await userDao.selectUserCredit(userId) // 토큰의 userId로 유저의 크레딧 조회

        if(selectUserCredit.length === 0){
            console.log("유저 크레딧 조회 에러");
            throw new Error("order_delete_error");
        }
        const userCredit = selectUserCredit[0].credit; // 유저 크레딧 정보 담기
        const userTotalCredit = totalAmount + userCredit; // 결제한 크레딧 + 유저의 기존 크레딧

    
        // 결제 취소 분 크레딧 업데이트
        const updateUserCredit = await userDao.updateUserCredit(userTotalCredit, userId);

        if(updateUserCredit.affectedRows === 0){
            console.log("유저 크레딧 업데이트 에러");
            throw new Error("order_delete_error")
        }
        

        // 주문 데이터 삭제
        const deleteResult = await userDao.orderDelete(reservationId, userId);

        if(deleteResult.affectedRows === 0){
            console.log("유저 주문정보 삭제 에러");
            throw new Error("order_delete_error")
        }


        // return deleteResult;
    }catch(error){
        console.log(error);
        throw error
    }
}

//mypage 프로필 수정
const profileUpdate = async (imageUrl) => {
    try{
        //유저정보 토큰에서 빼오기(작성해야함) -> 미들웨어 이용하여 컨트롤에서 req.user로 받아올거임
        const userId = 1;

        const result = await userDao.profileUpdate(imageUrl, userId);

        if(result.affectedRows === 0){
            console.log("프로필 수정이 되지 않아 발생한 에러임")
            throw new Error("profile_update_error")
        }
        return result;
    }catch(error){
        throw error
    }
}

module.exports = {
    orderDelete,
    profileUpdate
}