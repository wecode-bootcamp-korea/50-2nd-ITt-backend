const { QueryResult, SimpleConsoleLogger } = require("typeorm");
const adminDao = require("../models/adminDao");
const { Route53RecoveryCluster, ImportExport, Firehose } = require("aws-sdk");


// 관라지 페이지의 리스트
const selectList = async(adminUserInfo) => {
    try{

        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }
        
        // 공연 리스트 불러오기
        const result = await adminDao.selectList();
            if(result.length === 0){
                throw new Error("item_infomation_not_found")
            }

        return result

    }catch(error){
        throw error;
    }
}

// 관리자 상품 리스트 상세 정보 불러오기
const selectItemList = async(adminUserInfo, itemId) => {

    try{
        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }

        console.log(itemId,11111111111);
        // 공연 정보 불러오기
        const itemInfo = await adminDao.selectItemList(itemId);
            if(itemInfo.length === 0){
                throw new Error("item_infomation_not_found")
            }

        // 출연자 정보 불러오기
        const actorInfo = await adminDao.actorInfo(itemId);
            if(actorInfo.length === 0){
                throw new Error("actor_information_not_found")
            }

        // 공연 시간 불러오기
        const itemOption = await adminDao.itemOption(itemId);
            if(itemOption.length === 0){
                throw new Error("item_infomation_not_found")
            }
        
        // 카테고리 정보 불러오기
        const categoryInfo = await adminDao.categoryInfo();
            if(categoryInfo.length === 0){
                throw new Error("category_information_not_found");
            }


        // 공연 정보 + 출연자 정보
        const result = {
            itemInfo,
            actorInfo,
            itemOption,
            categoryInfo
        }
        return result;
        
    }catch(error){
        throw error;
    }
}

// 공연 정보 수정
const updateItemList = async(adminUserInfo, itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, imageUrl) => {

    try{
        console.log(adminUserInfo, itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, imageUrl)

        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }
        
        // 공연 ID를 통해 해당 공연의 이미지 업로드
        if(title || runningTime || viewerAge || price || itemNotice || imageUrl || itemId){
            const updateItems = await adminDao.updateItemList(title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId);
                if(updateItems.affectedRows === 0){
                    throw new Error("item_update_fail");
                }
        }

        //카테고리 이름 업데이트
        const selectCategoryIdInfo = await adminDao.selectCategoryIdInfo(itemId) //카테고리 아이디를 items에서 가져오기
            if(selectCategoryIdInfo.length === 0){
                throw new Error("categoryInfo_select_fail");
            }

        const categoryId = selectCategoryIdInfo[0].categoryId 
            const updateCategoryName = await adminDao.updateCategoryName(categoryName, categoryId); // 카테고리 아이디를 통해서 카테고리 정보 업데이트
            if(updateCategoryName.affectedRows === 0){
                throw new Error("categoryName_update_fail");
            }

        // 공연 지역 이름 업데이트
         const selectLocationInfo = await adminDao.selectLocationId(itemId);// locations_items에서 items id와 일치한 location_id를 가져와 해당 id를 통해 location 정보를 업데이트
            if(selectLocationInfo.legnth === 0){
                throw new Error("LocationInfo_select_fail");
            }

         const locationId = selectLocationInfo[0].locationId;

         const updatelocationName = await adminDao.updatelocationName(locationName, locationId)
            if(updatelocationName.affectedRows === 0){
                throw new Error("LocationName_update_fail");
            }
    
        // // 공연 시간 업데이트
        // let updateEventTime = ""
        // for(let i = 0; i < eventTime.length; i++){
        //     updateEventTime = await adminDao.updateEventTime(eventTime[i], eventId[i], itemId);
        //         if(updateEventTime.affectedRows === 0){
        //             throw new Error("update_fail");
        //         }
        // }
        
        // // 공연 날짜 업데이트
        // let updateEventDate = ""
        // for(let i = 0; i < eventDate.length; i++){
        //     updateEventDate = await adminDao.updateEventDate(eventDate[i], eventId[i], itemId)
        //         if(updateEventDate.affectedRows === 0){
        //             throw new Error("update_fail");
        //         }
        // }

        // 출연자 업데이트
        const deleteActorName = adminDao.deleteActorName(itemId); // 아이템아이디 해당하는 전체 유저를 삭제 후 새로 추가
            if(deleteActorName.affectedRows === 0){
                throw new Error("actor_delete_fail");
            }

            console.log(actorName)
        let updateActorName = ""
            for(let i = 0; i < actorName.length; i++){  // 복수의 출연자 업데이트 
                updateActorName = await adminDao.updateActorName(actorName[i], itemId);
            }
            if(updateActorName.affectedRows === 0){
                throw new Error("actorName_update_fail");
            }

            
        // 등록된 아이템 정보 보내주기
        const selectItemImage = await adminDao.selectItemImage(itemId);

        return selectItemImage;
    }catch(error){
        console.log(error);
        throw error
    }
}

// 공연 삭제
const deleteItemList = async(adminUserInfo, itemId) => {
    try{

        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }
        
        // 출연자 삭제
            const deleteActor = await adminDao.deleteActor(itemId);
                if(deleteActor.affectedRows === 0){
                    throw new Error("actor_delete_fail")
                }

        // 공연 옵션 삭제
            const deleteItemOption = await adminDao.deleteItemOption(itemId)
                if(deleteItemOption.affectedRows === 0){
                    throw new Error("item_option_delete_fail")
                }

        // 공연 지역 연결 삭제
            const deleteLocationOption = await adminDao.deleteLocationOption(itemId);
                if(deleteLocationOption.affectedRows === 0){
                    throw new Error("location_option_delete_fail")
                }

        // 공연 삭제하기
            const deleteItemList = await adminDao.deleteItemList(itemId);
                if(deleteItemList.affectedRows === 0){
                    throw new Error("item_delete_fail")
                }
            
            return true;
    }catch(error){
        console.log(error)
        throw error;
    } 
}

//공연 추가 전 카테고리 정보 불러오기
const selectCategoryList = async(adminUserInfo) => {
    try{

        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }

        const result = await adminDao.selectCategoryList();
            if(result.length === 0){
                throw new Error("select_category_Infomation_fail")
            }

        return result;
    }catch(error){
        throw error;
    }
}

// 공연 추가
const insertItemList = async(adminUserInfo, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl) => {
    try{
        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기


        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }

        // 카테고리 정보 불러오기
        const selectCategoryInfo = await adminDao.selectCategoryInfo(categoryName); // 카테고리 정보 가져오기
            if(selectAdminInfo.length === 0){
                throw new Error("category_infomation_not_found")
            }
        const categoryId = selectCategoryInfo[0].id; // 카테고리 아이디 담기

        // // 공연 정보 추가
        // const selectItemInfo = await adminDao.selectItemInfo(title); // 공연 정보 불러오기
        //     if(selectItemInfo.length !== 0){
        //         throw new Error("insert_fail")
        //     }

        const insertItemList = await adminDao.insertItemList(title, runningTime, viewerAge, price, itemNotice, imageUrl, categoryId); // 공연 아이템 추가
            if(insertItemList.affectedRows === 0){
              throw new Error("insert_item_fail")  
            }

        // 출연자 추가
        const selectItemId = await adminDao.selectItemInfo(title); // 추가된 공연의 ID 받아오기
            if(selectItemId.length === 0){
                throw new Error("select_actor_fail")
            }
        const itemId = selectItemId[0].id; // 추가된 공연정보의 title을 토대로 id를 받아 변수에 넣기
        
        let insertActor = ""
        for(let i = 0; i < actorName.length; i++){ // 배열로 받아온 출연자 업로드
            insertActor = await adminDao.insertActor(actorName[i] ,itemId);
                if(insertActor.affectedRows === 0){
                    throw new Error("insert_actor_fail")
                }
        }

        // 공연 날짜 추가
        let insertEventDate = "";
        const eventDateLength = eventDate.length;
        for(let i = 0; i < eventDate.length * eventTime.length; i++){
            insertEventDate = await adminDao.insertEventDate(eventDate[i % eventDateLength], itemId)
                if(insertEventDate.affectedRows === 0){
                    throw new Error("insert_event_date_fail")
                }
        }

        // 추가된 공연에 대한 날짜 정보 가져오기
        const selectItemOptionInfo = await adminDao.selectItemOptionInfo(itemId);
            if(selectItemOptionInfo.length === 0){
                throw new Error("select_item_option_information_fail")
            }

        // 공연 시간 추가
        let insertEventTime = "";
        const eventTimeLength = eventTime.length;
        for(let i = 0; i < selectItemOptionInfo.length; i++){
            insertEventTime = await adminDao.insertEventTime(eventTime[i % eventTimeLength], selectItemOptionInfo[i].id, itemId);
            if(insertEventTime.affectedRows === 0){
                throw new Error("insert_event_time_fail")
            }
        }

        // 공연장 아이템 추가
        const selectLocationInfo = await adminDao.selectLocationInfo(locationName); // 공연장명을 통해 공연장 정보 불러오기
            if(selectLocationInfo.length === 0){
                throw new Error("select_location_info_fail")
            }

        const locationId = selectLocationInfo[0].id; // 불러온 정보를 토대로 ID 변수에 넣기
    
        const insertLocationItem = await adminDao.insertLocationItem(locationId, itemId); // 공연장 아이템 아이디와 등록한 공연장의 id 정보를 삽입
            if(insertLocationItem.affectedRows === 0){
                throw new Error("insert_location_item_fail")
            }

        return true;

    }catch(error){
        throw error
    }
}

//////////////////////////////////////////////대시보드///////////////////////////////////////////

// 대시보드 리스트 불러오기
const selectOrderList = async (adminUserInfo) => {
    try{
        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }

        const result = await adminDao.selectOrderList();
            if(result.length === 0){
                throw new Error("select_order_information_fail")
            }

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
const deleteOrderList = async(adminUserInfo, reservationId) => {
    try{
        //admin 유저 조회 및 검증
        const adminUserId = adminUserInfo.id; //디코드된 토큰의 유저 id 담기
        const adminUserEmail = adminUserInfo.email; //디코드된 토큰의 유저 email 담기

        // 유저 정보를 토대로 DB에 저장되어있는지 확인
        const selectAdminInfo = await adminDao.selectAdminInfo(adminUserId, adminUserEmail)
            if(selectAdminInfo.length === 0){
                throw new Error("admin_user_not_found")
            }

        // 공연 예약 정보 불러오기
        const selectReservationInfo = await adminDao.selectReservationInfo(reservationId); 
            if(selectReservationInfo.length === 0){
                throw new Error("select_reservation_information_fail")
            }

        const seatId = selectReservationInfo[0].seatId;
        
        // // 좌석 예약 상태 변경
        const cancelSeat = await adminDao.cancelSeat(seatId)
            if(cancelSeat.affectedRows === 0){
                throw new Error("cancel_seat_fail")
            }

        // 주문한 유저 정보 가져오기
        const selectUserInfo = await adminDao.selectReservationInfo(reservationId);
            if(selectUserInfo.length === 0){
                throw new Error("select_user_informaiton_fail")
            }
        const userId = selectUserInfo[0].userId; // 받아온 유저 정보에서 주문에 대한 유저ID 가져와 변수에 담기

        // 주문 상태 변경
        const updateStatus = await adminDao.updateStatus(reservationId, userId)
            if(updateStatus.affectedRows === 0){
                throw new Error("update_reservation_status_fail")
            }

        // 상태 변경된 주문 정보 가져오기
        const selectUserAmount = await adminDao.selectReservationInfo(reservationId);
            if(selectUserAmount.length === 0){
                throw new Error("select_amount_fail")
            }
        const cancelAmount = selectUserAmount[0].amount; // 주문 금액 져와 변수에 담기
        
        // 유저 크레딧 가져오기
        const selectUserCredit = await adminDao.selectUserCredit(userId);
            if(selectUserCredit.length === 0){
                throw new Error("select_user_credit_fail")
            }
        const userCredit = selectUserCredit[0].credit // 유저 크레딧 변수에 담기

        // 유저 크레딧 업데이트
        const totalCredit =  cancelAmount + userCredit;

        const updateUsersCredit = await adminDao.updateUsersCredit(totalCredit, userId)
           if(updateUsersCredit.affectedRows === 0){
                throw new Error("update_user_credit_fail");
           }
        return true;

    }catch(error){
        throw error
    }
}



module.exports = {
// 리스트
    selectList,
    selectItemList,
    updateItemList,
    deleteItemList,
    insertItemList,
    selectCategoryList,

// 대시보드
    selectOrderList,
    deleteOrderList
}