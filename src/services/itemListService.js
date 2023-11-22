const itemListDao = require("../models/itemListDao");

const categoryItemList = async (category, search) => {
  const categoryQuery = category ? `i.category_id = ${category}` : "";
  const searchQuery = search ? `AND i.title like '%${search}%'` : "";

  const result = await itemListDao.getItems(categoryQuery, searchQuery);

  return result;
};

const mainSlide = async () => {
  const result = await itemListDao.getMainItem();

  return result;
};

const newItems = async () => {
  const result = await itemListDao.getNewItems();

  return result;
};

const bestItems = async () => {
  const result = await itemListDao.getBestItems();

  return result;
};

const mdItemsList = async () => {
  const result = await itemListDao.getMDRecommendations();

  return result;
};

module.exports = {
  categoryItemList,
  mainSlide,
  newItems,
  bestItems,
  mdItemsList,
};
