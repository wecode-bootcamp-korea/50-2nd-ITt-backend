const { json } = require("express");
const adminService = require("../services/adminService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");
const { join } = require("path");
const { ConnectContactLens, Redshift } = require("aws-sdk");
const { ifError } = require("assert");

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
const selectItemList = async(req, res) => {
    try{
        const itemId = req.params.itemId // 공연에 대한 id 값 받아오기

        if(!itemId){
            throw new Error("key_error");
        }

        const result = await adminService.selectItemList(itemId)
        return res.json({data : result});

    }catch(error){
        console.log(error)
        throw error
    }
}

// 공연 내용 수정 및 이미지 업로드
const updateItemList = async(req, res) => {

    try{
        const { itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime , eventId  } = req.body;
        const itemImage = req.file;


        console.log(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime , eventId )

        if(!itemId || !title || !runningTime || !viewerAge || !price || !itemNotice || !categoryName || !locationName || !actorName || !eventDate || !eventTime || !eventId || !itemImage ){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        let uploadResult = ""
        let imageUrl = ""

        if(itemImage){
            uploadResult = await imageUpload.itemImageUpload(itemImage); //이미지 업로드
            imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴
        }

        const result = await adminService.updateItemList(itemId, title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, eventId, imageUrl)
        
        if(result !== true){
            throw new Error("update_fail");
        }
        return res.json({message : "update_success"});

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }
        
        if(error.message === "update_fail")
            return res.json({message : "update_fail"});
    }
}

// 공연 삭제
const deleteItemList = async(req, res) => {
    try{
        const itemId = req.query.id;
        
        if(!itemId){
            throw new Error("key_error");
        }

        const result = await adminService.deleteItemList(itemId)

        if(result !== true){
            throw new Error("delete_fail");
        }

        return res.json({date : "delete_success"})

    }catch(error){

        if(error.message === "key_error"){
            return res.json({message : "key_error"})
        }

        if(error.message === "delete_fail"){
            return res.json({message : "delete_fail"})
        }

    }
}
//공연 추가
const insertItemList = async(req, res) => {
    try{
        const { title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime  } = req.body;
        const itemImage = req.file;

        if(!title || !runningTime || !viewerAge || !price || !itemNotice || !categoryName || !locationName || !actorName || !eventDate || !eventTime || !itemImage){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        let uploadResult = "";
        let imageUrl = "";
        
            if(itemImage){
                uploadResult = await imageUpload.itemImageUpload(itemImage); 
                imageUrl = uploadResult.Location; 
            }

        const result = await adminService.insertItemList(title, runningTime, viewerAge, price, itemNotice, categoryName, locationName, actorName, eventDate, eventTime, imageUrl);
        
        if(result !== true){
            throw new Error("insert_fail")
        }

        return res.json({data : "insert_success"});

    }catch(error){
        console.log(error);

        if(error.message === "key_error"){
            return res.json({error : "key_error"});
        }     
        
        if(error.message === "insert_fail"){
            return res.json({message : "insert_fail"})
        }
    }
}

//////////////////////////////////////////////대시보드////////////////////////////////////////////

// 대시보드 공연 예약 리스트 불러오기
const selectOrderList = async (req, res) => {
    try{
        const result = await adminService.selectOrderList();
        return res.json({data : result});
        
    }catch(error){
        return res.json({message : error});
    }
}

// 대시보드 공연 예약 취소
const deleteOrderList = async(req, res) => {

    try{
        const {reservationId} = req.body;
        
        if(!reservationId){
            throw new Error("key_error");
        }

        const result = await adminService.deleteOrderList(reservationId);
        
        if(result !== true){
            throw new Error("cancel_fail");
        }
        return res.json({date : "cancel_success"});

    }catch(error){
        if(error.message === "key_error"){
            return res.json({message : "key_error"});
        }

        if(error.message === "cancel_fail"){
            return res.json({message : "cancel_fail"})
        }
    }
}

module.exports = {
    selectList,
    selectItemList,
    updateItemList,
    deleteItemList,
    insertItemList,

//////////////////////대시보드///////////////////

    selectOrderList,
    deleteOrderList
}