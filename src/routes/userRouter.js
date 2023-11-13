const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({dest : "profileImages/"}).single("profileImages");


module.exports = {
    router
}