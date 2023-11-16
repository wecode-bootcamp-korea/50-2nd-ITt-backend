const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "profileImage/"}).single("profileImage");
const userController = require("../controllers/userController");
const verfiyToken = require("../middlewares/verifyToken");


// 유저 정보 불러오기
router.get("/mypage", verfiyToken.verfiyToken, userController.userInfo)

//mypage 주문 취소
router.post("/mypage/cancel", verfiyToken.verfiyToken, userController.orderCancel);

//mypage 프로필 수정
router.put("/mypage/update", upload, verfiyToken.verfiyToken, userController.profileUpdate);


module.exports = {
    router
}