const database = require("../utils/database");


// 관리자 페이지의 리스트 추가
const selectList = async() => {

    try{
        const result = await database.appDataSoure.query(
            `
            SELECT 
                i.id as userId,
                i.title as title,
                c.name as categoryName,
                i.item_notice 
            from categories c 
                join items i on c.id = i.category_id 
            order by c.id desc;
            `
        )
        return result;
    }catch(error){
        throw error;
    }
}


// 공연 정보 불러오기(item)
const updateList = async(itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
            SELECT 
                i.title as title,
                i.image as image,
                i.running_time as runningTime,
                i.viewer_age as viewerAge,
                i.price as price,
                i.item_notice as itemNotice,
                c.name as categoryName,
                l.name as locationName
            FROM items i
            JOIN categories c ON i.category_id = c.id
            JOIN locations_items li ON i.id = li.item_id 
           	JOIN locations l ON li.location_id = l.id 
            where i.id = ?;
            `,[itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 출연자 정보 불러오기
const actorInfo = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
            SELECT
                name as actorName
            FROM actors
            WHERE item_id = ?  
            `,[itemId]
        )
        return result
    }catch(error){
        throw error;
    }
}

// 공연 옵션 불러오기
const itemOption = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
            SELECT 
                DATE_FORMAT(event_date, '%Y-%m-%d') AS eventDate,
                DATE_FORMAT(event_time, '%H:%i') AS eventTime
            FROM item_options
            WHERE item_id = ? 
            `,[itemId]
        )
        return result
    }catch(error){
        throw error;
    }
}

// // 좌석 정보 불러오기
// const seatList = async(itemId) => {
//     try{
      
//         const result = await database.appDataSoure.query(
//             `
//             select 
//                 name,
//                 price
//             from seat_class 
//             `
//         )
//         return result;
//     }catch(error){
//         console.log(error)
//         throw error;
//     }
// }


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
// 공연 정보의 출연진만 빼고 추가
const addList = async(title, description, viewerAge, runningTime, categoryId, imageUrl) => {
    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO items(
                    title, 
                    description, 
                    viewer_age, 
                    running_time, 
                    category_id,
                    image
                ) VALUES (
                    ?, ?, ?, ?, ?, ?
                )
            `,[title, description, viewerAge, runningTime, categoryId, imageUrl]
            )
            return result;
    }catch(error){
        console.log(error)
        throw error
    }
}


// 추가된 공연 정보 불러오기(title 기반)
const selectItem = async(title) => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    title
                FROM items
                    WHERE title = ?
            `,[title]
            )
            return result;
    }catch(error){
        throw error
    }
}

// 공연자 정보 조회
const selecActor = async(actorName, selectItemId) => {

    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    name,
                    item_id
                FROM actors
                WHERE name = ? and item_id = ?
            `,[actorName, selectItemId]
            )
        return result;
    }catch(error){
        console.log(error);
        throw error
    }
}

// 공연자 추가
const addActor = async(actorName, selectItemId) => {

    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO actors(
                    name,
                    item_id
                ) VALUES (
                    ?, ?
                )
            `,[actorName, selectItemId]
            )
        return result;
    }catch(error){
        console.log(error);
        throw error
    }
}

// 이벤트 시간 추가
const addEventDate = async(eventDate, eventTime, selectItemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO item_options(
                    event_date, 
                    event_time, 
                    item_id
                ) VALUES (
                    ?, ?, ?
                )
            `,[eventDate, eventTime, selectItemId]
        )
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 대시보드 리스트 불러오기
const dashboardList = async () => {
    try{
        const result = await database.appDataSoure.query(
            `
            select 
                u.name as userName,
                i.title as title,
                io.event_date as eventDate,
                io.event_time as eventTime,
                l.name AS locationName,
                s.seat_row as seatRow,
                s.seat_col as seatcol,
                sc.name as seatName,
                sc.price 
            from reservations r
                JOIN users u ON u.id = r.user_id 
                JOIN items i ON i.id = r.item_id 
                JOIN item_options io ON io.id = r.item_options_id 
                JOIN payment_method pm ON pm.id = r.payment_method_id
                JOIN seats s ON s.id = r.seat_id
                JOIN locations l ON l.id = s.location_id 
                JOIN seat_class sc ON sc.id  = s.seat_class_id 
            WHERE status = "confirmed"
            `
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 대시보드 공연 예약 취소
const dashboardCancel = async(reservationId, userId) => {
    try{
        const result = database.appDataSoure.query(
            `
            update reservations 
                set status = 'cancel' 
            where id = ?  and user_id = ?;
            `,[reservationId, userId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}




module.exports = {
    selectList,
    updateList,
    actorInfo,
    itemOption,
    // seatList,
    uploadImage,
    selectImage,
    deleteList,
    addList,
    addActor,
    selectItem,
    selecActor,
    addEventDate,
    dashboardList,
    dashboardCancel
}