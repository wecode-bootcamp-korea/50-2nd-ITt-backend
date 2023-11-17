const express = require("express");
const router = express.Router();
const detailRouter = require("./detailRouter");


router.use("/detail", detailRouter)

module.exports = router;