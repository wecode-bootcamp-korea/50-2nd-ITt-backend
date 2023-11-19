const database = require("../utils/database");

// 유저 검증
const selectAdminInfo = async(userId, userEmail) => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    email
                FROM users
                WHERE id = ? AND email = ?
            `,[userId, userEmail]
        )
        return result
    }catch(error){
        console.log(error);
        return error;
    }
}



// 관리자 페이지의 공연 리스트 불러오기
const selectList = async() => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT 
                    id as itemId,
                    title
                FROM items;
            `
        )
        return result;
    }catch(error){
        throw error;
    }
}


// 공연 정보 불러오기(item)
const selectItemList = async(itemId) => {
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
            FROM items iv
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


// 공연 정보 및 이미지 업로드
const updateItemList = async(title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId) => {

// console.log(title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId)
    try{
        const result = await database.appDataSoure.query(
            `
                UPDATE items
                    SET title =?, running_time = ?, viewer_age = ?, price = ?,  item_notice = ?, image = ?
                WHERE id = ? 
            `,[title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}


// 공연 정보의 카테고리 ID 불러오기
const selectCategoryIdInfo = async(itemId) =>{
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    title,
                    category_id as categoryId
                FROM items 
                    WHERE id = ?
            `,[itemId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 공연 정보의 카테고리 업데이트
const updateCategoryName = async(categoryName, categoryId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
            UPDATE categories
                SET name = ?
            WHERE id = ? 
            `,[categoryName, categoryId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 공연 지역의 ID 가져오기
const selectLocationId = async(itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
                SELECT
                    location_id as locationId
                FROM locations_items
                    WHERE item_id = ?
            `,[itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

//공연 지역 이름 업데이트
const updatelocationName = async(locationName, locationId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
                UPDATE locations
                    SET name = ?
                WHERE id = ?
            `,[locationName, locationId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 공연 시간 및 날짜 업데이트
const updateEventDate = async(eventDate, eventTime ,eventId, itemId) => {
    try{
      
        const result = await database.appDataSoure.query(
            `
                UPDATE item_options
                    SET event_date = ? , event_time = ?
                WHERE id = ? and item_id = ?

            `,[eventDate, eventTime ,eventId, itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

//출연자 이름 삭제 하기 -? item_id를 기준으로 삭제 후 새 출연자 추가
const deleteActorName = async(itemID) =>{
    try{
        const result = await database.appDataSoure.query(
            `
                DELETE FROM actors
                    WHERE item_id = ?
            `,[itemID]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

//출연자 이름 업데이트
const updateActorName = async(actorName, itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
            INSERT INTO actors 
            (
                name,
                item_id
            )VALUES(
                ?, ?
            )
            `,[actorName, itemId]
        )
        return result;
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 출연자 삭제
const deleteActor = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                DELETE FROM actors
                WHERE item_id = ?
            `,[itemId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 공연 옵션 삭제
const deleteItemOption = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                DELETE FROM item_options
                WHERE item_id = ?
            `,[itemId]
        )

        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}


// 공연 옵션 삭제
const deleteLocationOption = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                DELETE FROM locations_items
                WHERE item_id = ?
            `,[itemId]
        )

        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}
// 공연 삭제
const deleteItemList = async(itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                DELETE FROM items
                WHERE id = ?
            `,[itemId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 카테고리 정보 불러오기
const selectCategoryInfo = async (categoryName) =>{
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    name
                FROM categories
                WHERE name = ?
            `,[categoryName]
        )
        return result;const selectOrderList = async () => {
            try{
                const result = await adminDao.selectOrderList();
        
                console.log(result);
                // return result;
            }catch(error){
                throw error;
            }
        }
        
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 공연 정보 불러오기
const selectItemInfo = async (title) =>{
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
        console.log(error);
        throw error;
    }
}


//공연 정보 추가
const insertItemList = async(title, runningTime, viewerAge, price, itemNotice, imageUrl, categoryId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO items(
                    title, 
                    running_time, 
                    viewer_age, 
                    price, 
                    item_notice, 
                    image,
                    category_id
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?
                )
            `,[title, runningTime, viewerAge, price, itemNotice, imageUrl, categoryId]
        )
        return result
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 출연자 추가
const insertActor = async(actorName ,ItemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO actors(
                    name, 
                    item_id
                ) VALUES (
                    ?, ?
                )
            `,[actorName ,ItemId]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

 // 공연일 및 시간 추가
const insertEventDateTime = async(event_date ,event_time ,ItemId) => {
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
            `,[event_date ,event_time ,ItemId]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

// 공연장 정보 불러오기
const selectLocationInfo = async(locationName) => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id,
                    name
                FROM locations
                WHERE name = ?
            `,[locationName]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error
    }
}

 // 공연 지역 아이템 추가
 const insertLocationItem = async(locationId, itemId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                INSERT INTO locations_items(
                    location_id,
                    item_id
                ) VALUES (
                    ?, ?
                )
            
            `,[locationId, itemId]
        )
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}


////////////////////////////////////대시보드////////////////////////////////////////

// 대시보드 리스트 불러오기
const selectOrderList = async () => {
    try{
        const result = await database.appDataSoure.query(
            `
            SELECT 
                u.id AS userId,
                r.id AS reservationId,
                u.name as userName,
                i.title as title,
                DATE_FORMAT(event_date, '%Y-%m-%d') AS eventDate,
                DATE_FORMAT(event_time, '%H:%i') AS eventTime,
                r.status as status,
                r.amount as amount
            FROM reservations r 
                JOIN users u ON r.user_id = u.id 
                JOIN items i ON r.item_id = i.id 
                JOIN item_options io ON r.item_options_id = io.id 
            WHERE status ="complete"
            `
        )
        return result
    }catch(error){
        throw error;
    }
}

// 주문 정보 조회하기
const selectReservationInfo = async (reservationId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                SELECT
                    id as reservationId,
                    user_id as userId,
                    seat_id as seatId,
                    amount,
                    status
                FROM reservations
                WHERE id = ?
            `, [reservationId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 좌석 예약 상태 변경
const cancelSeat = async (seatId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                UPDATE seats
                    SET is_booked = 1
                WHERE id = ?
            `,[seatId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 주문 상태 변경하기
const updateStatus = async (reservationId, userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
                UPDATE reservations
                    SET status = "cancel"
                WHERE id = ? AND user_id = ?
            `,[reservationId, userId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 유저 크레딧 가져오기
const selectUserCredit = async(userId) => {
    try{
        const result = database.appDataSoure.query(
            `
            SELECT
                name,
                credit
            FROM users
                WHERE id = ?
            `,[userId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}

// 대시보드 공연 예약 취소
const updateUsersCredit = async(totalCredit, userId) => {
    try{
        const result = await database.appDataSoure.query(
            `
            UPDATE users 
                SET credit = ? 
            WHERE id = ?
            `,[totalCredit, userId]
        )
        return result
    }catch(error){
        console.log(error)
        throw error;
    }
}




module.exports = {
    // 공통
    selectAdminInfo, // admin 유저 조회

    // 리스트
    selectList, // 공연 전체 리스트 조회
    selectItemList,
    actorInfo,
    itemOption,
    deleteItemList,


    updateItemList,
    selectCategoryIdInfo,
    updateCategoryName,
    selectLocationId,
    updatelocationName,
    deleteActorName,
    updateActorName,
    updateEventDate,
    
    // 공연 삭제
    deleteActor, // 출연자 삭제
    deleteItemOption, // 공연 옵션 삭제
    deleteLocationOption, // 지역 연결 삭제
    selectCategoryInfo, //카테고리 정보 불러오기
    insertItemList, // 공연 정보 추가
    selectItemInfo, // 공연 정보 불러오기
    insertActor, // 출연자 추가
    insertEventDateTime, // 공연일 및 시간 추가
    selectLocationInfo, // 공연장 정보 불러오기
    insertLocationItem, // 공연장 아이템 추가

    // 대시보드
    selectOrderList, // 사용자 구매 내역 불러오기
    selectReservationInfo, // 사용자 구매 내역 불러오기
    cancelSeat, // 좌석 예약 상태 변경
    updateStatus, // 주문 상태 변경
    selectUserCredit, // 유저 크레딧 가져오기
    updateUsersCredit // 유저 크레딧 업데이트
}