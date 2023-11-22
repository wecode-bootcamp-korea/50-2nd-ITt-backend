const appDataSource = require("../utils/database");

const getMainItem = async () => {
  const result = await appDataSource.query(`
  SELECT
    i.id , i.image
  FROM items i
  WHERE i.id in (1,2,3,4)
  GROUP BY i.id , i.image
  `);
  return result;
};

const getItems = async (categoryQuery, searchQuery) => {
  const result = await appDataSource.query(`
  SELECT
    i.id , i.image , i.title , i.price
  FROM items i
  WHERE
  ${categoryQuery}
  ${searchQuery}
  GROUP BY i.id , i.image , i.title
  `);
  return result;
};

const commonQuery = `
    SELECT 
      i.id, i.title, i.price, i.image
    FROM items i
`;

const getNewItems = async () => {
  const query = `
    ${commonQuery}
    GROUP BY i.id
    ORDER BY i.created_at DESC 
    LIMIT 6
  `;
  return await appDataSource.query(query);
};

const getBestItems = async () => {
  const query = `
    ${commonQuery}
    GROUP BY i.id
    ORDER BY i.sale DESC 
    LIMIT 6
  `;
  return await appDataSource.query(query);
};

const getMDRecommendations = async () => {
  const query = `
    ${commonQuery}
    WHERE i.id IN (9, 10, 14, 15, 17, 18, 19)
    GROUP BY i.id
  `;
  return await appDataSource.query(query);
};

module.exports = {
  getMainItem,
  getItems,
  getBestItems,
  getMDRecommendations,
  getNewItems,
};
