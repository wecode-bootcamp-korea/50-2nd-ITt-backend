const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest : "profileImage/"}).single("profileImage");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

//로그인, admin 회원가입
router.post('/adminsignup',userController.adminsignup)
router.post('/kakaologin',userController.kakaologin)
router.post('/adminlogin',userController.adminlogin)

//마이페이지
router.get("/mypage", auth.verifyToken, userController.userInfo)
router.post("/mypage/cancel", auth.verifyToken, userController.orderCancel);
router.post("/mypage/update", upload, auth.verifyToken, userController.profileUpdate);

module.exports = {
  router
}
