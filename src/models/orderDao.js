const appDataSource = require("../utils/database");

const createReservation = async (
  userId,
  itemId,
  seatIds,
  itemOptionId,
  price
) => {
  const result = await appDataSource.query(
    `
  INSERT 
  INTO reservations (user_id , item_id , seat_id,item_options_id , amount)
  VALUES
  (?,?,?,?,?)
  `,
    [userId, itemId, seatIds, itemOptionId, price]
  );

  return result;
};

const selectReservation = async (userId, statusMatch) => {
  const result = await appDataSource.query(
    `
    SELECT r.id AS reservationId ,
		r.user_id AS userId ,
		u.credit AS remainingPoint,
		i.title AS title,
		i.image AS image,
    i.id AS itemId,
    io.id AS itemOptionId,
		DATE_FORMAT(io.event_date , '%Y-%m-%d')AS date,
		io.event_time AS time,
		l.name AS locationName,
    r.qrcode_url AS qrcodeUrl,
    s.id AS seatId,
		CONCAT(s.seat_row , s.seat_col) AS seatName,
		CAST(r.amount AS UNSIGNED) AS amount
		FROM reservations r
		JOIN users u ON r.user_id = u.id
		JOIN items i ON r.item_id = i.id 
		JOIN item_options io ON r.item_options_id = io.id 
		JOIN seats s ON r.seat_id = s.id 
		JOIN locations l ON s.location_id  = l.id 
		WHERE r.status  = '${statusMatch}' AND r.user_id = ?;
            `,
    [userId]
  );

  return result;
};

const updateUserCredit = async (userId, resultPoint) => {
  const result = await appDataSource.query(
    `
  UPDATE users 
  SET credit = ?
  WHERE id = ?
  `,
    [resultPoint, userId]
  );
  return result;
};

const updateReservationStatusComplete = async (
  userId,
  reservationIds,
  transaction
) => {
  const result = await transaction.query(
    `
  UPDATE reservations
  SET status = 'complete'
  WHERE id IN (?) AND user_id = ?
  `,
    [reservationIds, userId]
  );
  return result;
};

const increaseItemSale = async (sale, itemId, transaction) => {
  const result = await transaction.query(
    `
  UPDATE items
  SET sale = sale + ?
  WHERE id = ?
  `,
    [sale, itemId]
  );
  return result;
};

const updateSeatBookingStatus = async (seatIds, transaction) => {
  const result = await transaction.query(
    `
  UPDATE seats
  SET is_booked = 1
  WHERE id IN (?)
  `,
    [seatIds]
  );
  return result;
};

const updateReservationQRcodeUrl = async (url, reservationIds) => {
  const result = await appDataSource.query(
    `
  UPDATE reservations
  SET qrcode_url = ?
  WHERE id IN (?)
  `,
    [url, reservationIds]
  );
  return result;
};

module.exports = {
  createReservation,
  selectReservation,
  updateUserCredit,
  updateReservationStatusComplete,
  updateSeatBookingStatus,
  increaseItemSale,
  updateReservationQRcodeUrl,
};
