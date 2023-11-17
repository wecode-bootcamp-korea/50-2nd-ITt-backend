const { json } = require("express");
const adminService = require("../services/adminService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");
const { join } = require("path");

// 관라지 페이지 공연 리스트 불러오기
const selectList = async(req, res) => { 
    try{
        const result = await adminService.selectList();
        return res.json({data : result});

    }catch(error){
        throw error;
    }
} 

// 공연 상세정보 불러오기
const updateList = async(req, res) => {
    try{
        const itemId = req.params.itemId // 공연에 대한 id 값 받아오기

        if(!itemId){
            throw new Error("key_error");
        }

        const result = await adminService.updateList(itemId)
        return res.json({data : result});

    }catch(error){
        console.log(error)
        throw error
    }
}

// 공연 내용 수정 및 이미지 업로드
const updateReserveList = async(req, res) => {

    try{
        const { itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime  } = req.body;
        const itemImage = req.file;

        if(!itemId || !title || !runningTime || !viewerAge || !price || !itemNotice || !categoryName || !locationName || !actorName || !eventDate || !eventTime || !itemImage){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        let uploadResult = ""
        let imageUrl = ""

        if(itemImage){
            uploadResult = await imageUpload.itemImageUpload(itemImage); //이미지 업로드
            imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴
        }

        // itemId와 이미지 URL 넘기기
        const result = await adminService.updateReserveList(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl)

        return res.json({data : "update_success", message : result});

    }catch(error){
        console.log(error);

        if(error.message === "key_error"){
            return res.json({data : "key_error"});
        }
        
        if(error.messasge === "update_reserveInfo_fail"){
            return res.json({data : "update_reserveInfo_fail"});
        }

        return res.json({data : "발생할 에러가 더 있을수 있다 리펙토링하면서 추가할게요"});
    }
}

// 공연 삭제 (외래키 참조에 영향으로 테스트 불가 -> 차후 테스트 진행 예정)
const deleteList = async(req, res) => {

    try{
        const reservationId = req.query.id;

        if(!reservationId){
            throw new Error("key_error");
        }

        const result = adminService.deleteList(reservationId);
        return res.json({data : "delete_success"});

    }catch(error){

        if(error.message === "key_error"){
            return req.json({data : "key_error"});
        }

        if(error.message === "delete_fail"){
            return req.json({data : "delete_fail"})
        }

        throw error
    }
}

// 공연 추가
const addList = async(req, res) => {
    try{
        const { title, description, viewerAge, runningTime, actorName, eventDate, categoryId, eventTime } = req.body;
        const itemImages = req.file;

        if(!title || !description || !viewerAge || !runningTime || !actorName || !eventDate || !itemImages |!categoryId |!eventTime){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        const uploadResult = await imageUpload(itemImages); //이미지 업로드
        const imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴

        const result = await adminService.addList(title, description, viewerAge, runningTime, actorName, eventDate, categoryId, imageUrl, eventTime);
        

        // return req.json({message : "add_success"})

    }catch(error){
        if(error.message === "key_error"){
            return res.json({error : "key_error"});
        }
        
        if(error.message === "title_is_duplicate"){
            return res.json({error : "title_is_duplicate"})
        }

        if(error.message === "no_update_data"){
            return res.json({error : "no_update_data"})
        }

        if(error.message === "data_does_Not_exist"){
            return res.json({error : "data_does_Not_exist"})
        }

        if(error.message === "actor_is_exist"){
            return res.json({error : "actor_is_exist"})
        }
        
        return res.json({error : "다른 에러 잡을꺼임"})
    }
}

// 대시보드 공연 예약 리스트 불러오기
const dashboardList = async (req, res) => {
    try{
        const result = await adminService.dashboardList();
        return res.json({data : result});
        
    }catch(error){
        return res.json({message : error});
    }
}

// 대시보드 공연 예약 취소
const dashboardCancel = async(req, res) => {

    try{
        const {userId, reservationId, price} = req.body;
        
        if(!userId || !reservationId || !price){
            throw new Error("key_error");
        }

        const result = await adminService.dashboardCancel(userId, reservationId, price);
        

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }
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