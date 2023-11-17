const express = require('express');
const app = express()
const detailController = require('../controllers/detailController');
const auth = require("../middlewares/auth")

const router = express.Router();


router.post('/',auth.verifyToken,detailController.getSeatInfoBylocationId)
router.get('/:itemId',detailController.getItemsByItemId)




module.exports = router