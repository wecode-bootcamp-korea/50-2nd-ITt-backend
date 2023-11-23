const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = multer({dest : "itemImage/"}).single("itemImage");

// 공연 정보 리스트
router.get("/selectList", adminAuth.verfiyToken , adminController.selectList);

// 공연 정보 상세
router.get("/selectItemList/:itemId", adminAuth.verfiyToken, adminController.selectItemList);

// 공연 정보 수정
router.put("/updateItemList", uploadImage, adminAuth.verfiyToken, adminController.updateItemList);

// 공연 정보 삭제
router.delete("/deleteItemList/:itemId", adminAuth.verfiyToken, adminController.deleteItemList)

// 공연 정보 추가(카테고리 불러오기)
router.get("/selectCategoryList", adminAuth.verfiyToken, adminController.selectCategoryList)

// 공연 정보 추가
router.post("/insertItemList", uploadImage, adminAuth.verfiyToken, adminController.insertItemList);

// 구매 내역 조회
router.get("/selectOrderList", adminAuth.verfiyToken, adminController.selectOrderList);

// 구매 내역 취소
router.delete("/deleteOrderList/:reservationId", adminAuth.verfiyToken, adminController.deleteOrderList);


module.exports = {
    router
}