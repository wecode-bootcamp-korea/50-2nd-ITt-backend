const { json } = require("express");
const userService = require("../services/userService");
const s3 = require("../utils/aws-config");
const imageUpload = require("../middlewares/imageUpload");


// //mypage 주문 취소
const orderDelete = async(req, res) => {

    const {reservationId, totalAmount} = req.body;

    try{
        if(!reservationId || !totalAmount){ // key 검증
            throw new Error("key_error");
        }
        const result = await userService.orderDelete(reservationId, totalAmount);

        return res.json({message : "cancel_success"});

    }catch(error){

        if(error.message === "key_error"){ // request 값이 없을 경우
            return res.json({message : "key_error"});
        }
        
        if(error.message === "order_delete_error"){ //삭제할 결제 데이터가 없을 경우
            return res.json({message : "order_delete_error"})
        }

        return res.json({message : "추가 가능성이 있어 그대로 납둠 => 서비스에서 발생하는 에러도 여기서 잡을꺼다."})
    }
}

// //mypage 프로필 수정
const profileUpdate = async(req, res) =>{

    //여기서 토큰의 정보를 같이 받을거임
    const profileImage = req.file

    try{
        if(!profileImage){
            throw new Error("key_error");
        }
        // AWS S3 이미지 업로드 
        const uploadResult = await imageUpload(profileImage); //이미지 업로드
        const imageUrl = uploadResult.Location; // 업로드된 이미지의 URL 받아옴


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