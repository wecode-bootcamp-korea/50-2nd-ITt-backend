const itemListService = require("../services/itemListService");

const getItemList = async (req, res) => {
  try {
    const { category, search } = req.query;

    const categoryItemList = await itemListService.categoryItemList(
      category,
      search
    );

    const mainSlide = await itemListService.mainSlide();

    const newItems = await itemListService.newItems();

    const bestItems = await itemListService.bestItems();

    const mdItemsList = await itemListService.mdItemsList();

    const data = {
      categoryItemList,
      mainSlide,
      newItems,
      bestItems,
      mdItemsList,
    };

    return res.status(200).json({ data: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getItemList,
};
