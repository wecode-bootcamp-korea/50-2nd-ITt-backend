const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const uploadImage = multer({dest : "itemImage/"}).single("itemImage");

// 공연 정보 리스트
router.get("/selectList", adminController.selectList);

// 공연 정보 상세
router.get("/selectItemList/:itemId", adminController.selectItemList);

// 공연 정보 수정
router.put("/updateItemList", uploadImage, adminController.updateItemList);

// 공연 정보 삭제
router.delete("/deleteItemList", adminController.deleteItemList)

// 공연 정보 추가
router.post("/insertItemList", uploadImage, adminController.insertItemList);

// 구매 내역 조회
router.get("/selectOrderList", adminController.selectOrderList);

// 구매 내역 취소
router.post("/deleteOrderList", adminController.deleteOrderList);

module.exports = {
    router
}