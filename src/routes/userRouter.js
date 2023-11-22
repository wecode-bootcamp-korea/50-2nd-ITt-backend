const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "profileImage/"}).single("profileImage");
const userController = require("../controllers/userController");
const verfiyToken = require("../middlewares/verifyToken");

//로그인, admin 회원가입
router.post('/adminsignup',userController.adminsignup)
router.post('/kakaologin',userController.kakaologin)
router.post('/adminlogin',userController.adminlogin)

//마이페이지
router.get("/mypage", verfiyToken.verfiyToken, userController.userInfo)
router.post("/mypage/cancel", verfiyToken.verfiyToken, userController.orderCancel);
router.post("/mypage/update", upload, verfiyToken.verfiyToken, userController.profileUpdate);

module.exports = {
  router
}
