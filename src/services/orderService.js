const orderDao = require("../models/orderDao");
const QRCode = require("qrcode");
const AWS = require("aws-sdk");
const appDataSource = require("../utils/database");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const addReservation = async (userId, itemId, seatIds, itemOptionId, price) => {
  // seatId가 배열일 경우에 대한 처리
  if (Array.isArray(seatIds)) {
    return Promise.all(
      seatIds.map((seatId) =>
        orderDao.createReservation(userId, itemId, seatId, itemOptionId, price)
      )
    );
  }

  // 배열이 아니면 그대로 createReservation 호출
  return orderDao.createReservation(
    userId,
    itemId,
    seatIds,
    itemOptionId,
    price
  );
};

const getReservation = async (userId, status) => {
  const statusQuery = async () => {
    const statusOption = {
      complete: "complete",
      cancel: "cancel",
      default: "pending",
    };
    return statusOption[status] || statusOption.default;
  };
  const statusMatch = await statusQuery(status);

  const result = await orderDao.selectReservation(userId, statusMatch);

  return result;
};

const pointCharge = async (userId, point, remainingPoint) => {
  const resultPoint = point + remainingPoint;
  const result = await orderDao.updateUserCredit(userId, resultPoint);

  return result;
};

const paymentComplete = async (
  userId,
  reservationIds,
  seatIds,
  itemId,
  remainingPoint,
  totalAmount
) => {
  const resultPoint = remainingPoint - totalAmount;
  const sale = reservationIds.length;

  try {
    await appDataSource.transaction(async (transaction) => {
      await orderDao.updateUserCredit(userId, resultPoint);
      await orderDao.updateReservationStatusComplete(
        userId,
        reservationIds,
        transaction
      );
      await orderDao.updateSeatBookingStatus(seatIds, transaction);
      await orderDao.increaseItemSale(sale, itemId, transaction);
    });
  } catch (error) {
    console.error("Error in paymentComplete transaction:", error);
    throw error;
  }

  return;
};

const generateQRCodeAndUpload = async (
  reservationIds,
  userId,
  title,
  date,
  time,
  seatNames,
  s3BucketName
) => {
  try {
    const data = {
      유저아이디: userId,
      공연이름: title,
      공연날짜: date,
      공연시간: time,
      좌석번호: seatNames.map((seat) => seat.trim()).join(", "),
    };

    const dataText = JSON.stringify(data);

    const qrCodeImageBuffer = await QRCode.toBuffer(dataText);

    const combinedReservationIds = reservationIds.join("-");

    const s3UploadParams = {
      Bucket: s3BucketName,
      Key: `qrcodes/${combinedReservationIds}.png`,
      Body: qrCodeImageBuffer,
      ContentType: "image/png",
    };

    const s3UploadResult = await s3.upload(s3UploadParams).promise();

    const imageUrl = s3UploadResult.Location;

    const qrcode = await orderDao.updateReservationQRcodeUrl(
      imageUrl,
      reservationIds
    );

    return qrcode;
  } catch (error) {
    console.error("Error in generateQRCodeAndUpload:", error);
    throw error;
  }
};

module.exports = {
  addReservation,
  getReservation,
  pointCharge,
  paymentComplete,
  generateQRCodeAndUpload,
};
