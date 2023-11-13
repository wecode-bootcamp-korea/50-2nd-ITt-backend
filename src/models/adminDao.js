const database = require("../utils/database");


// 관라지 페이지의 리스트 추가
const selectList = async() => {

    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    title,
                    description
                FROM items
            `
        )
        return result;
    }catch(error){
        throw error;
    }
}


// 공연 정보 불러오기
const updateList = async(itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
            select 
                i.id,
                i.title,
                i.image,
                i.description,
                i.running_time as runningTime,
                i.viewer_age as viewerAge,
                ip.event_date as eventDate,
                ac.name
            from items i
                join item_options ip on i.id = ip.item_id
                join actors ac on i.id = ac.item_id
            where i.id = ? 
                group by ip.event_date;

            `,[itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 좌석 정보 불러오기
const seatList = async(itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
            select 
                name,
                price
            from seat_class 
            `
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}


// 공연 정보 이미지 업로드
const uploadImage = async(imageUrl, itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
                UPDATE items
                SET image = ?
                WHERE id = ? 
            `,[imageUrl, itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}


// 공연 정보 이미지 가져오기
const selectImage = async(itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
                SELECT 
                    image
                FROM items
                    WHERE id = ?
            `,[itemId]
        )

        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}


// 공연 삭제
const deleteList = async(reservationId) => {
    try{

        const result = await database.appDataSoure.query(
            `
                DELETE 
                    FROM items
                WHERE ID = ?
            `,[reservationId]
            )
        return result;
    }catch(error){
        throw error
    }
}

// 공연 추가


module.exports = {
    selectList,
    updateList,
    seatList,
    uploadImage,
    selectImage,
    deleteList
}