const { json } = require("express");
const adminService = require("../services/adminService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");
const { join } = require("path");
const { ifError } = require("assert");
const { error } = require("console");
const { SimpleConsoleLogger } = require("typeorm");
const { rmSync } = require("fs");
const { errorMonitor } = require("events");

// 관라지 페이지 공연 리스트 불러오기
const selectList = async(req, res) => { 
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;

        if(!adminUserInfo){
            throw new Error("key_error");
        }

        const result = await adminService.selectList(adminUserInfo);
        return res.json({data : result});

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }

        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"})
        }

        if(error.message === "item_infomation_not_found"){
            return res.json({message : "item_infomation_not_found"})
        }
    }
}


// 공연 상세정보 불러오기
const selectItemList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;

        // 공연에 대한 id 값 받아오기
        const itemId = req.params.itemId 

        if(!adminUserInfo || !itemId){
            throw new Error("key_error");
        }

        const result = await adminService.selectItemList(adminUserInfo, itemId)
        return res.json({data : result});

    }catch(error){ 
        console.log(error);
        if(error.message === "key_error"){
            return res.json({message : "key_error"})
        }

        if(error.message === "item_infomation_not_found"){
            return res.json({message : "item_infomation_not_found"})
        }
    
        if(error.message === "item_infomation_not_found"){
            return res.json({message : "item_infomation_not_found"})
        }

        if(error.message === "actor_information_not_found"){
            return res.json({message : "actor_information_not_found"})
        }

        if(error.message === "category_information_not_found"){
            return res.json({message : "category_information_not_found"})
        }

    }
}

// 공연 내용 수정 및 이미지 업로드
const updateItemList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;
        const { itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName } = req.body;
        const itemImage = req.file;

        
        if(!adminUserInfo || !itemId || !title || !runningTime || !viewerAge || !price || !itemNotice || !categoryName || !locationName || !actorName || !itemImage ){
            throw new Error("key_error");
        } 

        // AWS S3 이미지 업로드 
        let uploadResult = ""
        let imageUrl = ""

        if(itemImage){
            uploadResult = await imageUpload.itemImageUpload(itemImage); //이미지 업로드
            imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴
        }

        const result = await adminService.updateItemList(adminUserInfo, itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, imageUrl)

        return res.json({message : "update_success" , data : result});

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }

        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"});
        }

        if(error.message === "item_update_fail"){
            return res.json({message : "item_update_fail"});
        }

        if(error.message === "categoryInfo_select_fail"){
            return res.json({message : "categoryInfo_select_fail"})
        }

        if(error.message === "categoryName_update_fail"){
            return res.json({message : "categoryName_update_fail"})
        }

        if(error.message === "LocationInfo_select_fail"){
            return res.json({message : "LocationInfo_select_fail"})
        }

        if(error.message === "LocationName_update_fail"){
            return res.json({message : "LocationName_update_fail"})
        }

        if(error.message === "actor_delete_fail"){
            return res.json({message : "actor_delete_fail"})
        }

        if(error.message === "actorName_update_fail"){
            return res.jsonm({message : "actorName_update_fail"})
        }
    }
}

// 공연 삭제
const deleteItemList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;
        
        // 공연 아이디 받기
        const itemId = req.params.itemId

        if(!adminUserInfo || !itemId){
            throw new Error("key_error");
        }

        const result = await adminService.deleteItemList(adminUserInfo, itemId)

        if(result !== true){
            throw new Error("delete_fail");
        }

        return res.json({date : "delete_success"})

    }catch(error){
        console.log(error);
        if(error.message === "key_error"){
            return res.json({message : "key_error"})
        }

        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"})
        }

        if(error.message === "actor_delete_fail"){
            return res.json({message : "actor_delete_fail"})
        }

        if(error.message === "item_option_delete_fail"){
            return res.json({message : "item_option_delete_fail"})
        }

        if(error.message === "location_option_delete_fail"){
            return res.json({message : "location_option_delete_fail"})
        }

        if(error.message === "item_delete_fail"){
            return res.json({message : "item_delete_fail"})
        }

    }
}

//공연 추가 전 카테고리 정보 불러오기
const selectCategoryList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;

        if(!adminUserInfo){
            throw new Error("key_error");
        }

        const result = await adminService.selectCategoryList(adminUserInfo);
        return res.json({data : result});

    }catch(error){

        if(error.message === "key_error"){
            return res.json({message : "key_error"})
        }
        if(error.message === "select_category_Infomation_fail"){
            return res.json({message : "select_category_Infomation_fail"})
        }
    }
}

//공연 추가
const insertItemList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;
        const { title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime  } = req.body;
        const itemImage = req.file;

        if(!adminUserInfo || !title || !runningTime || !viewerAge || !price || !itemNotice || !categoryName || !locationName || !actorName || !eventDate || !eventTime && !itemImage){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        let uploadResult = "";
        let imageUrl = "";
        
            if(itemImage){
                uploadResult = await imageUpload.itemImageUpload(itemImage); 
                imageUrl = uploadResult.Location; 
            }

        const result = await adminService.insertItemList(adminUserInfo, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl);
        
        if(result !== true){
            throw new Error("insert_fail")
        }

        return res.json({data : "insert_success"});

    }catch(error){
        console.log(error)

        if(error.message === "key_error"){
            return res.json({error : "key_error"});
        }     

        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"})
        }

        if(error.message === "category_infomation_not_found"){
            return res.json({message : "category_infomation_not_found"})
        }

        if(error.message === "insert_item_fail"){
            return res.json({message : "insert_item_fail"})
        }

        if(error.message === "select_actor_fail"){
            return res.json({message : "select_actor_fail"})
        }

        if(error.message === "insert_actor_fail"){
            return res.json({message : "insert_actor_fail"})
        }

        if(error.message === "insert_event_date_fail"){
            return res.json({message : "insert_event_date_fail"})
        }

        if(error.message === "select_item_option_information_fail"){
            return res.json({message : "select_item_option_information_fail"})
        }

        if(error.message === "insert_event_time_fail"){
            return res.json({message : "insert_event_time_fail"})
        }

        if(error.message === "select_location_info_fail"){
            return res.json({message : "select_location_info_fail"})
        }

        if(error.message === "insert_location_item_fail"){
            return res.json({message : "insert_location_item_fail"})
        }
    }

}

//////////////////////////////////////////////대시보드////////////////////////////////////////////

// 대시보드 공연 예약 리스트 불러오기
const selectOrderList = async (req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기
        const adminUserInfo = req.user;
        
        if(!adminUserInfo){
            throw new Error("key_error");
        }
        const result = await adminService.selectOrderList(adminUserInfo);
        return res.json({data : result});
        
    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }
        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"})
        }

        if(error.message === "select_order_information_fail"){
            return res.json({message : "select_order_information_fail"})
        }

    }
}

// 대시보드 공연 예약 취소
const deleteOrderList = async(req, res) => {
    try{
        //디코된 유저의 토큰 정보 불러오기s
        const adminUserInfo = req.user;

        // 예약 정보의 ID 불러오기
        const reservationId = req.params.reservationId;

        if(!adminUserInfo || !reservationId){
            throw new Error("key_error");
        }
        const result = await adminService.deleteOrderList(adminUserInfo, reservationId);

        if(result !== true){
            throw new Error("cancel_fail");
        }
        return res.json({date : "cancel_success"});

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }

        if(error.message === "admin_user_not_found"){
            return res.json({message : "admin_user_not_found"})
        }

        if(error.message === "cancel_fail"){
            return res.json({message : "cancel_fail"})
        }

        if(error.message === "select_reservation_information_fail"){
            return res.json({message : "select_reservation_information_fail"})
        }

        if(error.message === "cancel_seat_fail"){
            return res.json({message : "cancel_seat_fail"})
        }

        if(error.message === "select_user_informaiton_fail"){
            return res.json({message : "select_user_informaiton_fail"})
        }

        if(error.message === "update_reservation_status_fail"){
            return res.json({message : "update_reservation_status_fail"})
        }

        if(error.message === "select_amount_fail"){
            return res.json({message : "select_amount_fail"})
        }

        if(error.message === "select_user_credit_fail"){
            return res.json({message : "select_user_credit_fail"})
        }

        if(error.message === "update_user_credit_fail"){
            return res.json({message : "update_user_credit_fail"})
        }

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