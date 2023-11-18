const { QueryResult, SimpleConsoleLogger } = require("typeorm");
const adminDao = require("../models/adminDao");
const { Route53RecoveryCluster, ImportExport } = require("aws-sdk");

// 관라지 페이지의 리스트
const selectList = async() => {
    try{
        const select = await adminDao.selectList();
        if(r)
        return result

    }catch(error){
        throw error;
    }
}

// 관리자 상품 리스트 상세 정보 불러오기
const selectItemList = async(itemId) => {

    try{
        // 공연 정보 불러오기
        const itemInfo = await adminDao.selectItemList(itemId);

        // 출연자 정보 불러오기
        const actorInfo = await adminDao.actorInfo(itemId);

        // 공연 시간 불러오기
        const itemOption = await adminDao.itemOption(itemId);


        // 공연 정보 + 출연자 정보
        const result = {
            itemInfo,
            actorInfo,
            itemOption
        }
        return result;
        
    }catch(error){
        throw error;
    }
}

// 공연 이미지 업로드
const updateItemList = async(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, eventId, imageUrl) => {

    try{
        console.log(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, eventId, imageUrl)
        // 공연 ID를 통해 해당 공연의 이미지 업로드

        const updateItems = await adminDao.updateItemList(title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId);

        if(updateItems.affectedRows === 0){
            throw new Error("update_fail");
        }

        //카테고리 이름 업데이트
        const selectCategoryIdInfo = await adminDao.selectCategoryIdInfo(itemId) //카테고리 아이디를 items에서 가져오기
        
        if(selectCategoryIdInfo.length === 0){
            throw new Error("update_fail");
        }
        const categoryId = selectCategoryIdInfo[0].categoryId 
        const updateCategoryName = await adminDao.updateCategoryName(categoryName, categoryId); // 카테고리 아이디를 통해서 카테고리 정보 업데이트

        if(updateCategoryName.affectedRows === 0){
            throw new Error("update_fail");
        }

        // 공연 지역 이름 업데이트
         const selectLocationInfo = await adminDao.selectLocationId(itemId);// locations_items에서 items id와 일치한 location_id를 가져와 해당 id를 통해 location 정보를 업데이트
            if(selectLocationInfo.legnth === 0){
                throw new Error("update_fail");
            }

         const locationId = selectLocationInfo[0].locationId;

         const updatelocationName = await adminDao.updatelocationName(locationName, locationId)
            if(updatelocationName.affectedRows === 0){
                throw new Error("update_fail");
            }

        // 공연 시간 및 날자 업데이트
        const updateEventDate = await adminDao.updateEventDate(eventDate, eventTime ,eventId, itemId);
            if(updateEventDate.affectedRows === 0){
                throw new Error("update_fail");
            }

        // 출연자 업데이트
        const deleteActorName = adminDao.deleteActorName(itemId); // 아이템아이디 해당하는 전체 유저를 삭제 후 새로 추가
            if(deleteActorName.affectedRows === 0){
                throw new Error("update_fail");
            }

        const updateActorName = await adminDao.updateActorName(actorName, itemId);
            if(updateActorName.affectedRows === 0){
                throw new Error("update_fail");
            }
        // // 업데이트 된 공연 정보 반환
        // const result = await adminDao.updateItemList(itemId);
        
        return true;
        
    }catch(error){
        console.log(error)
        throw error
    }
}

// 공연 삭제
const deleteItemList = async(itemId) => {
    try{

    // 출연자 삭제
        const deleteActor = await adminDao.deleteActor(itemId);
        if(deleteActor.affectedRows === 0){
            throw new Error("delete_fail")
        }

    // 공연 옵션 삭제
        const deleteItemOption = await adminDao.deleteItemOption(itemId)
        if(deleteItemOption.affectedRows === 0){
            throw new Error("delete_fail")
        }

    // 공연 지역 연결 삭제
        const deleteLocationOption = await adminDao.deleteLocationOption(itemId);
        if(deleteLocationOption.affectedRows === 0){
            throw new Error("delete_fail")
        }

    // 공연 삭제하기
        const deleteItemList = await adminDao.deleteItemList(itemId);
        if(deleteItemList.affectedRows === 0){
            throw new Error("delete_fail")
        }
        
        return true;
    }catch(error){
        console.log(error);
        throw error;
    } 
}

// 공연 추가
const insertItemList = async(title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl) => {
    try{

        // 카테고리 정보 불러오기
        const selectCategoryInfo = await adminDao.selectCategoryInfo(categoryName); // 카테고리 정보 가져오기
        const categoryId = selectCategoryInfo[0].id; // 카테고리 아이디 담기

        // 공연 정보 추가
        const selectItemInfo = await adminDao.selectItemInfo(title); // 공연 정보 불러
            if(selectItemInfo.length !== 0){
                throw new Error("insert_fail")
            }

        const insertItemList = await adminDao.insertItemList(title, runningTime, viewerAge, price, itemNotice, imageUrl, categoryId); // 공연 아이템 추가
        
        // 출연자 추가
        const selectItemId = await adminDao.selectItemInfo(title); // 추가된 공연의 ID 받아오기
            if(selectItemId.length === 0){
                throw new Error("insert_fail")
            }
        const itemId = selectItemId[0].id; // 추가된 공연정보의 title을 토대로 id를 받아 변수에 넣기
        const insertActor = await adminDao.insertActor(actorName ,itemId);
            if(insertActor.affectedRows === 0){
                throw new Error("insert_fail")
            }

        // 시간 추가
        const insertEventDateTime = await adminDao.insertEventDateTime(eventDate, eventTime, itemId);
            if(insertEventDateTime.affectedRows === 0){
                throw new Error("insert_fail")
            }

        // 공연장 아이템 추가
        const selectLocationInfo = await adminDao.selectLocationInfo(locationName); // 공연장명을 통해 공연장 정보 불러오기
            if(selectCategoryInfo.length === 0){
                throw new Error("insert_fail")
            }

        const locationId = selectLocationInfo[0].id; // 불러온 정보를 토대로 ID 변수에 넣기
    
        const insertLocationItem = await adminDao.insertLocationItem(locationId, itemId); // 공연장 아이템 아이디와 등록한 공연장의 id 정보를 삽입
        if(insertLocationItem.affectedRows === 0){
            throw new Error("insert_fail")
        }
    
        return true;

    }catch(error){
        console.log(error)
        throw error
    }
}

//////////////////////////////////////////////대시보드///////////////////////////////////////////

// 대시보드 리스트 불러오기
const selectOrderList = async () => {
    try{
        const result = await adminDao.selectOrderList();

        // price의 부동소수점 제거하기
        result.forEach(item => {
            item.amount = parseFloat(item.amount)
        });

        return result;
    }catch(error){
        throw error;
    }
}


// 대시보드 공연 예약 취소
const deleteOrderList = async(reservationId) => {
    try{

        const userId = 1;

        // 공연 예약 정보 불러오기
        const selectReservationInfo = await adminDao.selectReservationInfo(reservationId); 
        const seatId = selectReservationInfo[0].seatId;
        
        // 좌석 예약 상태 변경
        const cancelSeat = await adminDao.cancelSeat(seatId)
            if(cancelSeat.affectedRows === 0){
                throw new Error("cancel_fail")
            }

        // 주문 상태 변경
        const updateStatus = await adminDao.updateStatus(reservationId, userId)

        // 상태 변경된 주문 정보 가져오기
        const selectUserAmount = await adminDao.selectReservationInfo(reservationId);
        const cancelAmount = selectUserAmount[0].amount; // 주문 금액 져와 변수에 담기
        
        // 유저 크레딧 가져오기
        const selectUserCredit = await adminDao.selectUserCredit(userId);
            if(selectUserCredit.length === 0){
                throw new Error("cancel_fail")
            }
        const userCredit = selectUserCredit[0].credit // 유저 크레딧 변수에 담기

        // 유저 크레딧 업데이트
        const totalCredit =  cancelAmount + userCredit;

        const updateUsersCredit = await adminDao.updateUsersCredit(totalCredit, userId)
           if(updateUsersCredit.affectedRows === 0){
                throw new Error("cancel_fail");
           }
           return true;

    }catch(error){
        console.log(error);
    }
}



module.exports = {
    selectList,
    selectItemList,
    updateItemList,
    deleteItemList,
    insertItemList,

///대시보드///
    selectOrderList,
    deleteOrderList
}