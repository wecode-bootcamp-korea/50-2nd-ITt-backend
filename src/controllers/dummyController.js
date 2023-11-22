const dummyService = require("../services/dummyService");

const addDummy = async (req, res) => {
  try {
    await dummyService.addDummy();
    res.json({ message: "더미데이터가 성공적으로 삽입되었습니다." });
  } catch (error) {
    console.error("Error inserting dummy data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports={
  addDummy
}