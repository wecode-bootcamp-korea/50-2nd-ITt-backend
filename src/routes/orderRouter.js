const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.use(verifyToken);

router.post("/:itemId", verifyToken, orderController.addReservation);
router.get("/", verifyToken, orderController.getReservation);
router.put("/pointCharge", verifyToken, orderController.pointCharging);
router.put("/pointDeduction", verifyToken, orderController.pointDeduction);

module.exports.router = router;
