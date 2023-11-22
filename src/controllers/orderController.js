const orderService = require("../services/orderService");

const addReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seatIds, itemOptionsId } = req.body;
    const price = parseInt(req.body.price);
    const itemId = req.params.itemId;

    const result = await orderService.addReservation(
      userId,
      itemId,
      seatIds,
      itemOptionsId,
      price
    );

    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getReservation = async (req, res) => {
  try {
    const userId = req.user.id;
    const status = req.query.status;

    const readReservation = await orderService.getReservation(userId, status);

    return res.status(200).json({ data: readReservation });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const pointCharging = async (req, res) => {
  try {
    const userId = req.user.id;
    const point = parseInt(req.body.point);
    const remainingPoint = parseInt(req.body.remainingPoint);

    const chargingPoint = await orderService.pointCharge(
      userId,
      point,
      remainingPoint
    );

    return res.status(200).json({
      message: "pointChange",
      data: chargingPoint,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const pointDeduction = async (req, res) => {
  try {
    const userId = req.user.id;
    const s3BucketName = process.env.AWS_S3_BUCKET;

    const remainingPoint = parseInt(req.body.remainingPoint);
    const totalAmount = parseInt(req.body.totalAmount);
    const { reservationIds, seatIds, seatNames, title, date, time, itemId } =
      req.body;

    const paymentComplete = await orderService.paymentComplete(
      userId,
      reservationIds,
      seatIds,
      itemId,
      remainingPoint,
      totalAmount
    );

    const qrcode = await orderService.generateQRCodeAndUpload(
      reservationIds,
      userId,
      title,
      date,
      time,
      seatNames,
      s3BucketName
    );

    return res
      .status(200)
      .json({ message: "pointChange", data: paymentComplete, qrcode: qrcode });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  addReservation,
  getReservation,
  pointCharging,
  pointDeduction,
};
