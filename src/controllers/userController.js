const { json } = require("express");
const userService = require("../services/userService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");


// //mypage 주문 취소
const orderDelete = async(req, res) => {
    const reservationId = req.body;

    try{
        if(!reservationId){
            throw new Error("key_error");
        }

        const result = await userService.orderDelete(reservationId);
       
        return res.json({message : "cancel_success"});

    }catch(error){
        if(error.message = "key_error"){
            return res.json({message : "cancel_fail"});
        }
        return res.json({message : "추가 가능성이 있어 그대로 납둠 => 서비스에서 발생하는 에러도 여기서 잡을꺼다."})
    }
}

// //mypage 프로필 수정
const profileUpdate = async(req, res) =>{

    const profileImage = req.file

    try{
        if(!profileImage){
            throw new Error("key_error");
        }

        // AWS S3 이미지 업로드 테스트

        const uploadResult = await imageUpload(profileImage);
        const imageUrl = uploadResult.Location;

        const result = await userService.profileUpdate(imageUrl);
        return res.json({message : "update_success"});
    

    }catch(error){
        if(error.message === "key_error"){
           return res.json({message : "key_error"});
        }

       return res.json({message : "추가 가능성이 있어 그대로 납둠 => 서비스에서 발생하는 에러도 여기서 잡을꺼다."})
    }
}


module.exports = {
    orderDelete,
    profileUpdate
}