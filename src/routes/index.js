const express = require("express");
const router = express.Router();

const userRouter = require('./userRouter');
const orderRouter = require("./orderRouter");
const dummyRouter = require("./dummyRouter");
const itemListRouter = require("./itemListRouter");
const detailRouter = require('./detailRouter');

router.use('/users',userRouter.router)
router.use("/order", orderRouter.router);
router.use("/dummy", dummyRouter.router);
router.use("/itemList", itemListRouter.router);
router.use('/detail', detailRouter);

module.exports = router;
