const express = require('express');
const detailController = require('../controllers/detailController');
const auth = require("../middlewares/auth")
const router = express.Router();

// 공연 상세 정보
router.get('/:itemId',detailController.getItemsByItemId)
// 공연 좌석 상세 정보
router.post('/',auth.verifyToken,detailController.getSeatInfoBylocationId)


module.exports = router