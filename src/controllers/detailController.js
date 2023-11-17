const detailServices = require('../services/detailServices');
const utilError = require('../utils/error')

const getItemsByItemId = async(req,res)=>{
    try{
        const {itemId} = req.params;
        if(!itemId){
            utilError.error(400, 'KEY_ERROR')
        }
       const {itemInfo,
              itemStartDateInfo,
              itemFinishDateInfo,
              calenderTime,
              
              actorsInfoByitemId
             } = await detailServices.getItemsByItemId(itemId)
             res.status(200).json({data: {itemInfo,
                                          itemStartDateInfo,
                                          itemFinishDateInfo,
                                          calenderTime,
                                          
                                          actorsInfoByitemId}})
    }catch(err){
        console.log(err)
        return res.status(err.statusCode || 500).json({message : err.message})
    }
}

const getSeatInfoBylocationId = async(req,res)=>{
    try{
        const {locationId, itemId} = req.body
    if(!locationId){
        utilError.error(400, "KEY_ERROR")
    }
    const {seatInfo, remainSeats} = await detailServices.getSeatInfoBylocationId(locationId, itemId)
    return res.status(200).json({data: {seatInfo, remainSeats}})
    
    }catch(err){
        console.log(err)
        return res.status(err.statusCode || 500 ).json({message: err.message})
    }
}
module.exports = {
    getItemsByItemId,
    getSeatInfoBylocationId
}