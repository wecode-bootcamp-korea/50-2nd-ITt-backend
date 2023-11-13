const { QueryResult } = require("typeorm");
const adminDao = require("../models/adminDao");
const { Route53RecoveryCluster } = require("aws-sdk");

// 관라지 페이지의 리스트
const selectList = async() => {

    try{
        const result = await adminDao.selectList();
        return result

    }catch(error){
        throw error;
    }
}

// 관리자 상품 리스트 상세 정보 불러오기
const updateList = async(itemId) => {

    try{
        // 공연 정보 불러오기
        const itemInfo = await adminDao.updateList(itemId);

        // 좌석 정보 불러오기
        const seatInfo = await adminDao.seatList();

        // 공연 정보와 좌석 정보 가공
        const modifiedItemInfo = itemInfo.map(item => {
            // eventDate가 Date 객체인지 확인하고 ISO 문자열로 변환 후 날짜 부분만 추출
            const eventDate = item.eventDate instanceof Date ? item.eventDate.toISOString().split('T')[0] : item.eventDate;

            return {
                ...item,
                eventDate 
            };
        });

        // 좌석 금액의 소수점 제거
        const modifiedSeatInfo = seatInfo.map(seat => ({
            ...seat,
            price: parseInt(seat.price).toString() // 문자열에서 소수점 제거
          }));


        const result = {    
            itemInfo: modifiedItemInfo,
            seatInfo: modifiedSeatInfo
        }

        return result;
    }catch(error){
        throw error;
    }
}


// 공연 이미지 업로드
const uploadImage = async(itemId, imageUrl) => {

    try{
        //공연 ID를 통해 해당 공연의 이미지 업로드
        const uploadImage = await adminDao.uploadImage(imageUrl, itemId);

        if(uploadImage.affectedRows === 0){
            throw new Error("update_image_fail");
        }
        
        //업로드된 이미지 반환
        const selectImage =  await adminDao.selectImage(itemId);
        return selectImage;
        
    }catch(error){
        console.log(error)
        throw error
    }
}

// 공연 삭제
const deleteList = async(reservationId) => {

    try{ 
        const result = await adminDao.deleteList(reservationId);

        if(result.affectedRows === 0){
            throw new Error("delete_fail")
        }
        
        return result;
    }catch(error){
        throw error  
    }
}

// 공연 추가

module.exports = {
    selectList,
    updateList,
    uploadImage,
    deleteList
}