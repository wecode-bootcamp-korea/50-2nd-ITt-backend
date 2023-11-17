const detailDao = require('../models/detailDao');

const getItemsByItemId = async (itemId) => {
    const { itemInfo,
            itemStartDateInfo,
            itemFinishDateInfo,
            calenderTime,
            actorsInfoByitemId
          } = await detailDao.getItemsByItemId(itemId)
    return {itemInfo,
            itemStartDateInfo,
            itemFinishDateInfo,
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