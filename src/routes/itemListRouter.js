const express = require("express");
const router = express.Router();
const itemListController = require("../controllers/itemListController");

router.get("/", itemListController.getItemList);

module.exports.router = router;
