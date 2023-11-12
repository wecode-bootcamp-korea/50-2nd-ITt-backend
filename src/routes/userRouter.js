const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({dest : "profileImages/"}).single("profileImages");

//mypage 주문 취소
// 가정 1. mypage에 있는 user의 주문 정보 (유저 테이블의 userid와 reservation 테이블의 id,  결제 금액을)를 받아 취소한다
//        이때, reservation테이블의 유저 id와 유저 테이블의 id가 일치 할 경우 삭제를 진행한 다음 크레딧을 취소한 금액 만큼 추가한다.
router.post("/mypage/cancel", userController.orderDelete);

//mypage 프로필 수정
//가정 1. mypage에 있는 user의 정보(userId)를 받거나, 던진 토큰을 verify하여 유저의 정보를 토대로 프로필을 수정한다.
router.put("/mypage/update", upload, userController.profileUpdate);


module.exports = {
    router
}