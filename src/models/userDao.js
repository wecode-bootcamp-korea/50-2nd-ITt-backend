const database = require("../utils/database");

//mypage 유저 크레딧 조회
const selectUserCredit = async(userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    name,
                    credit
                FROM users
                where id = ?
            `,[userId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error
    }
}

//mypage 크레딧 업데이트
const updateUserCredit = async(userTotalCredit, userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                update users
                set credit = ?
                where id = ?;

            `,[userTotalCredit, userId]
        )
        return result;
    }catch(error){
        throw error
    }

}

//mypage 주문 취소(유저 아이디 비교해서 삭제해야함)
const orderDelete = async(reservationId, userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                delete 
                    from reservations
                where id = ? 
                and user_id = ? 
                and status = "confirmed"
            `,[reservationId, userId]
        )
        console.log(result);
        return result
    }catch(error){
        throw error
    }
}


//mypage 프로필 수정 (유저 아이디 검증 필요)
const profileUpdate = async(imageUrl, userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
            update users
            set profile_image = ?
            where id = 2
            `,[imageUrl, userId]
        )
        return result;
        
    }catch(error){
        throw error
    }
}


module.exports = {
    selectUserCredit,
    updateUserCredit,
    orderDelete,
    profileUpdate
}