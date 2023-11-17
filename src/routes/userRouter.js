const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

router.post('/adminsignup',userController.adminsignup)
router.post('/kakaologin',userController.kakaologin)
router.post('/adminlogin',userController.adminlogin)

module.exports = {
    router
}
