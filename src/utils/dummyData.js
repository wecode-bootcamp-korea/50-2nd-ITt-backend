const appDataSoure = require("./database");

const generateAndInsertDummyData = async (req,res) => {
  const numRows = 10;
  const numCols = 10;

  try {
    // 더미 데이터 삽입
    for (let row = 1; row <= numRows; row++) {
      for (let col = 1; col <= numCols; col++) {
        const seatRow = String.fromCharCode(64 + row);
        const seatCol = col;

        // SQL 쿼리 실행
        await appDataSoure.query(
          `INSERT INTO seats (seatRow, seatCol, seatClassId)
        VALUES (?, ?, ?)`,
          [seatRow, seatCol, 1]
        );
      }
    }

    // 데이터베이스 연결 해제
    await appDataSoure.close();

    console.log("더미데이터 삽입이 완료되었습니다.");
  } catch (error) {
    console.error("오류 발생:", error.message);
    throw error;
  }
};

module.exports = { generateAndInsertDummyData };
