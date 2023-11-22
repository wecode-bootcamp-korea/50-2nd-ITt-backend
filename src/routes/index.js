const express = require("express");
const router = express.Router();
const orderRouter = require("./orderRouter");
const dummyRouter = require("./dummyRouter");
const itemListRouter = require("./itemListRouter");

router.use("/order", orderRouter.router);
router.use("/dummy", dummyRouter.router);
router.use("/itemList", itemListRouter.router);

module.exports = router;
