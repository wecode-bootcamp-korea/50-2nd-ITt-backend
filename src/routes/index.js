const express = require("express");
const router = express.Router();


// admin 라우터
const adminRouter = require("../routes/adminRouter");
router.use("/admin", adminRouter.router);


module.exports = router;