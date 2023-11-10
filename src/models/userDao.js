const database = require("../utils/database");


//mypage 주문 취소(유저 아이디 비교해서 삭제해야함)
const orderDelete = async(reservationId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                delete 
                    from reservations
                where status = "confirmed" and id = ? 
            `,[reservationId]
        )
        return result
    }catch(error){
        throw error
    }
}

//mypage 프로필 수정 (유저 아이디 검증 필요)
const profileUpdate = async(imageUrl) => {
    try{
        const result = await database.appDataSoure.query(
            `
            update users
            set profile_image = ?
            where id = 2
            `,[imageUrl]
        )

        return result;
        
    }catch(error){
        throw error
    }
}


module.exports = {
    orderDelete,
    profileUpdate
}