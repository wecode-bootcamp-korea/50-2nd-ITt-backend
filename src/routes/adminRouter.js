const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const uploadImage = multer({dest : "itemImage/"}).single("itemImage");

// 공연 정보 전부 끌고오기
router.get("/selectList", adminController.selectList);

// 공연 정보 우측에 수정 버튼 클릭 했을시
router.get("/updateList/:itemId", adminController.updateList);

// 공연 이미지 업로드 버튼 클릭 했을 시[[]]
router.put("/uploadImage", uploadImage, adminController.uploadImage);

// 공연 삭제 버튼 클릭 했을 시
router.delete("/deleteList", adminController.deleteList);

// 공연 추가 버튼 클릭 했을 시
router.post("/addList", uploadImage, adminController.addList);

// 대시보드 탭을 눌렀을 시
router.get("/dashboardList", adminController.dashboardList);

// 대시보드 공연 예약 취소
router.post("/dashboardCancel", adminController.dashboardCancel);

module.exports = {
    router
}