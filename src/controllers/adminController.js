const { json } = require("express");
const adminService = require("../services/adminService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");

// 관라지 페이지의 리스트
const selectList = async(req, res) => { 

    try{
        const result = await adminService.selectList();
        return res.json({message : result});

    }catch(error){
        console.log(error);
        throw error;
    }
} 

// 공연 정보 불러오기
const updateList = async(req, res) => {

    try{
        const itemId = req.query.id

        if(!itemId){
            throw new Error("key_error");
        }
        const result = await adminService.updateList(itemId)
        return res.json({message : result});

    }catch(error){
        console.log(error)
        throw error
    }
}

// 공연 이미지 업로드
const uploadImage = async(req, res) => {

    try{
        const itemId = req.body.itemId;
        const itemImages = req.file;

        if(!itemId || !itemImages){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 
        const uploadResult = await imageUpload(itemImages); //이미지 업로드
        const imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴

        // itemId와 이미지 URL 넘기기
        const result = await adminService.uploadImage(itemId, imageUrl)

        return res.json({message : "update_success", message : result});

    }catch(error){

        if(error.message === "key_error"){
            return req.json({message : "key_error"});
        }
        
        if(error.messasge === "update_image_fail"){
            return req.json({message : "update_image_fail"});
        }

        return req.json({message : "발생할 에러가 더 있을수 있다 리펙토링하면서 추가할게요"});


        throw error
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
        return res.json({message : "delete_success"});

    }catch(error){

        if(error.message === "key_error"){
            return req.json({message : "key_error"});
        }

        if(error.message === "delete_fail"){
            return req.json({message : "delete_fail"})
        }

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