const express = require("express");
const router = express.Router();


// 유저 라우터
const userRouter = require("./userRouter");
router.use("/users", userRouter.router);





module.exports = router;