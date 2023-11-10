const userDao = require("../models/userDao")

//mypage 주문 취소
const orderDelete = async (reservationId) => {

    try{
        const result = await userDao.orderDelete(reservationId);
        return result;
    }catch(error){
        throw error
    }
}

//mypage 프로필 수정
const profileUpdate = async (imageUrl) => {

    try{
        const result = await userDao.profileUpdate(imageUrl);

        if(result.affectedRows !== 1){
            throw new Error("update_error")
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