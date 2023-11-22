const detailDao = require('../models/detailDao');

const getItemsByItemId = async (itemId) => {
    const { itemInfo,
            calenderTime,
            actorsInfoByitemId
          } = await detailDao.getItemsByItemId(itemId)
    return {itemInfo,
            calenderTime,
            actorsInfoByitemId}
};

const getSeatInfoBylocationId = async (locationId, itemId) => {
    const {seatInfo,remainSeats} = await detailDao.getSeatInfoBylocationId(locationId, itemId)
    
    return {seatInfo, remainSeats}
};
module.exports = {
    getItemsByItemId,
    getSeatInfoBylocationId
}