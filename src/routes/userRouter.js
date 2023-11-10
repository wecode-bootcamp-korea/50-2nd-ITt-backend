const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({dest : "profileImages/"});

//mypage 주문 취소
router.post("/mypage", userController.orderDelete);

//mypage 프로필 수정
router.put("/mypage", upload.single("profileImage"), userController.profileUpdate);


module.exports = {
    router
}