const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


//mypage 정보 불러오기
router.get("/mypage", userController.mypage);

//mypage 주문 취소
router.post("/mypage", userController.orderDelete);

//mypage 프로필 수정
router.put("/mypage", userController.profileUpdate);


module.exports = {
    router
}