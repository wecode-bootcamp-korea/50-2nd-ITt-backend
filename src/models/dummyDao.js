const appDataSource = require("../utils/database");

const addDummy = async () => {
  const numRows = 5;
  const numCols = 20;

  for (let row = 1; row <= numRows; row++) {
    for (let col = 1; col <= numCols; col++) {
      const seatRow = String.fromCharCode(64 + row);
      const seatCol = col;

      // SQL 쿼리 실행
      const result = await appDataSource.query(
        `INSERT INTO seats (seat_row, seat_col, location_id)
        VALUES (?, ?, ?)`,
        [seatRow, seatCol, 2]
      );
    }
  }
  await appDataSource.close()
  return "ok";
};

const addItemsOption = async () => {
  const numItems = 44;
  const numDates = 3;
  const numTimes = 3;

  for (let itemId = 1; itemId <= numItems; itemId++) {
    for (let date = 1; date <= numDates; date++) {
      for (let time = 1; time <= numTimes; time++) {
        const eventDate = "2023-12-0" + date;
        const eventTime = (time - 1) * 2 + 18 + ":00:00";

        const result = await appDataSource.query(
          `
        INSERT INTO item_options (event_date , event_time , item_id)
        VALUES (?,?,?)`,
          [eventDate, eventTime, itemId]
        );
      }
    }
  }
  return addItemsOption;
};

module.exports = {
  addDummy,
  addItemsOption,
};
