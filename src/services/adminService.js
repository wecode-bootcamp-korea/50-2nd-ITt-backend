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

        console.log(result);
        return result;
        
    }catch(error){
        throw error;
    }
}

// 공연 이미지 업로드
const updateReserveList = async(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl) => {

    try{

        console.log(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl)
        
        
        // 공연 ID를 통해 해당 공연의 이미지 업로드

        const updateItems = await adminDao.updateReserveList(title, runningTime, viewerAge, price, itemNotice, imageUrl, itemId);

        if(uploadImage.affectedRows === 0){
            throw new Error("update_reserveInfo_fail");
        }

        // 카테고리 변경
        // const categoryId = adminDao.

        const updateCategoryName = adminDao.updateCategoryName() //카테고리 이름 업데이트
        
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
const addList = async(title, description, viewerAge, runningTime, actorName, eventDate, categoryId, imageUrl, eventTime) => {

    try{
        // 공연 정보 불러오기
        const selectItemList = await adminDao.selectList()
        
        // for(let i = 0; i < selectItemList.length; i++){
        //     if(selectItemList[i].title === title){
        //         throw new Error("title_is_duplicate")
        //     }
        // }

        // 추가된 공연정보 추가하기(공연이름, 상세정보, 관람등급, 상영시간, 카테고리, 공연 이미지)
        const itemInfo = await adminDao.addList(title, description, viewerAge, runningTime, categoryId, imageUrl);

        // 공연 정보가 테이블에 저장되지 않았을 경우
        if(itemInfo.affectedRows !== 1){
            throw new Error("no_update_data")
        }

        // 공연 정보 불러오기(추가한 공연정보의 ID를 가져와 actor 및 item option 테이블에 넣기 위함)
        const selectItem = await adminDao.selectItem(title); // 등록한 타이블 명으로 불러온다(타이틀은 중복이 불가함)

        // 데이터가 존재 하지 않을 경우 에러
        if(selectItem.length === 0){
            throw new Error("data_does_Not_exist")
        }

        console.log(selectItem[0].id);

        // 데이터가 존재할 경우 해당 title에 대한 id를 가져온다.
        const selectItemId = selectItem[0].id;

        // 출연자 조회
        const actorSelect = await adminDao.selecActor(actorName, selectItemId); // 업데이트 요청시 받아온 출연자 이름과 item_id를 조회한다.

        //수정해야되...
        const actorSelectItemId = actorSelect[0].item_id;
        const actorSelectName = actorSelect[0].name;


        // 출연자가 존재 할 경우 에러
        if(actorSelect.length !== 0){ 
            throw new Error("actor_is_exist")
        }

        // // 출연자의 ID와 출연자 name이 존재할 경우 에러 발생
        if(actorSelectItemId === selectItemId && actorSelectName === actorName) {
            throw new Error("actor_is_duplicate")
        }

        // 출연자 추가
        const actorInfo = await adminDao.addActor(actorName, selectItemId);

        // 공연 시간 추가
        const addEventDate = await adminDao.addEventDate(eventDate, eventTime, selectItemId);
        console.log(addEventDate);
       
        const test = await adminDao.updateList(selectItemId);


    }catch(error){
        console.log(error)
        throw error
    }
}

// 대시보드 리스트 불러오기
const dashboardList = async () => {
    try{
        const dashboardList = await adminDao.dashboardList();


        // 좌석 금액의 소수점 제거
        const modifiedSeatInfo = dashboardList.map(seat => ({
            ...seat,
            price: parseInt(seat.price).toString() // 문자열에서 소수점 제거
          }));

        const result = {
            dashboardList : modifiedSeatInfo
        }

        return result;

    }catch(error){
        throw error;
    }
}

// 대시보드 공연 예약 취소
const dashboardCancel = async(userId, reservationId, price) => {

    try{
        
        //예약 취소
        const result = await adminDao.dashboardCancel(reservationId, userId);
        console.log(result);
    }catch(error){
        console.log(error);
    }
}



module.exports = {
    selectList,
    updateList,
    updateReserveList,
    deleteList,
    addList,
    dashboardList,
    dashboardCancel
}