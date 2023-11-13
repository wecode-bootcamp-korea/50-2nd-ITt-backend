const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const uploadItemImage = multer({dest : "itemImages/"}).single("itemImages");

// 공연 정보 전부 끌고오기
router.get("/selectList", adminController.selectList);

// 공연 정보 우측에 수정 버튼 클릭 했을시
router.get("/updateList", adminController.updateList);

// 공연 이미지 업로드 버튼 클릭 했을 시
router.put("/uploadImage", uploadItemImage, adminController.uploadImage);

// 공연 삭제 버튼 클릭 했을 시
router.delete("/deleteList", adminController.deleteList);

module.exports = {
    router
}