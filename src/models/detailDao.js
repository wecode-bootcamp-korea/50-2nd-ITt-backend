const {appDataSoure} = require('../utils/database')
const utilError = require('../utils/error')

// 공연별 상세 정보
const getItemsByItemId = async (itemId) => {
    try{
        const itemInfo = await appDataSoure.query(`
        SELECT 
            items.id AS itemId,
            items.title,
            items.image,
            items.item_notice AS itemNotice,
            items.running_time AS runningTime,
            items.viewer_age AS viewerAge,
            items.price,
            locations.name AS locationName,
            locations.id AS locationId
        FROM 
            items
        JOIN 
            locations_items ON items.id = locations_items.item_id
        JOIN 
            locations ON locations_items.location_id = locations.id
        WHERE
            items.id = ?
        `,[itemId]);
        const actorsInfoByitemId = await appDataSoure.query(`
            SELECT
                name
            FROM
                actors
            WHERE 
                actors.item_id= ?
        `, [itemId])
     const startDateInfo = await appDataSoure.query(`
        SELECT 
            event_date AS eventDate
        FROM 
            item_options
        WHERE 
            item_id = ?
        ORDER BY event_date
        LIMIT 1
     `,[itemId])
     const itemStartDateInfo = startDateInfo[0].eventDate.toISOString().split('T')[0]
     
     const finishDateInfo = await appDataSoure.query(`
        SELECT 
            event_date AS eventDate
        FROM 
            item_options
        WHERE 
            item_id = ?
        ORDER BY event_date DESC
        LIMIT 1
     `,[itemId])
     const itemFinishDateInfo = finishDateInfo[0].eventDate.toISOString().split('T')[0]
     
     const calenderTime = await appDataSoure.query(`
        SELECT
            item_options.id,
            DATE_FORMAT(event_time, '%H:%i') AS eventTime,
            DATE_FORMAT(event_date, '%Y-%m-%d') AS eventDate
        FROM 
            item_options
        WHERE
            item_id = ?
     `,[itemId])
     return {itemInfo,
             itemStartDateInfo,
             itemFinishDateInfo,
             calenderTime,
             actorsInfoByitemId}
    }catch(err){
        console.log(err)
        utilError.error(500, 'INVALID_DATA_INPUT')
    }
}
// 전체 좌석 정보 
const bookedType = {
    'NOT_RESERVED_SEAT' : 0,
    'RESERVED_SEAT' : 1
}
const getSeatInfoBylocationId = async(locationId,itemId) => {
    try{
        if(!locationId || !itemId){ 
            utilError.error(400, "KEY_ERROR")
        }
        const seatInfo = await appDataSoure.query(`
        SELECT
            seats.id,
            seats.is_booked AS isBooked,
            seats.seat_row AS seatRow,
            seats.seat_col AS seatCol
        FROM
            seats
        JOIN
            locations_items ON seats.location_id = locations_items.location_id
        JOIN
            items ON locations_items.item_id = items.id
        WHERE
            seats.location_id = ?
        AND 
            items.id = ?;
        `, [locationId, itemId])

        const remainSeatsByitemId = await appDataSoure.query(`
        SELECT COUNT(*) AS remainSeats
        FROM
            seats
        JOIN
            locations_items ON seats.location_id = locations_items.location_id
        JOIN
            items ON locations_items.item_id = items.id
        WHERE
            seats.location_id = ?
        AND
            items.id = ?
        AND
            seats.is_booked = ?;
        `, [locationId, itemId, bookedType.NOT_RESERVED_SEAT])
        const remainSeats = remainSeatsByitemId[0]
        
        return { seatInfo, remainSeats}
    }catch(err){
        console.log(err)
        return utilError.error(500, 'INVALID_DATA_INPUT')
    }
}
module.exports = {
    getItemsByItemId,
    getSeatInfoBylocationId
}

