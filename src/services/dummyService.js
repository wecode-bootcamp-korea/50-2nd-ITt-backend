const dummyDao = require("../models/dummyDao");

const addDummy = async () => {
  const result = await dummyDao.addDummy();

  return result;
};

module.exports = { addDummy };
