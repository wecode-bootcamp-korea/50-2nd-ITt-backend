const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const multer = require("multer");
const verfiyToken = require("../middlewares/verifyToken");
const uploadImage = multer({dest : "itemImage/"}).single("itemImage");

// 공연 정보 리스트
router.get("/selectList", verfiyToken.verfiyToken, adminController.selectList);

// 공연 정보 상세
router.get("/selectItemList/:itemId", verfiyToken.verfiyToken, adminController.selectItemList);

// 공연 정보 수정
router.put("/updateItemList", uploadImage, verfiyToken.verfiyToken, adminController.updateItemList);

// 공연 정보 삭제
router.delete("/deleteItemList/:itemId", verfiyToken.verfiyToken, adminController.deleteItemList)

// 공연 정보 추가
router.post("/insertItemList", uploadImage, verfiyToken.verfiyToken, adminController.insertItemList);

// 구매 내역 조회
router.get("/selectOrderList", verfiyToken.verfiyToken, adminController.selectOrderList);

// 구매 내역 취소
router.delete("/deleteOrderList/:reservationId", verfiyToken.verfiyToken, adminController.deleteOrderList);

module.exports = {
    router
}