const { appDataSource } = require('../utils/database')


const getUserByEmail = async (email) => {
    const result = await appDataSource.query(
    `SELECT * FROM users 
    WHERE 
    email = ?`,
    [email]);
    console.log(result)
    return result;
  };

const createAdmin = async (email, password, kakao_id, name, is_admin) => {
    const result = await appDataSource.query(
      `INSERT INTO users
    (
        email, 
        password,
        kakao_id,
        name,
        is_admin
    )
    VALUES 
    (?,?,?,?,?)`,
    [email, password, kakao_id, name, is_admin]);
    return result;
};

const createUser = async (kakaoId, name, email, birthday, phone_number) => {
    try {
      await appDataSource.query(
        `INSERT INTO users(
          kakao_id,
          name,
          email,
          birthday,
          phone_number
        ) VALUES (?,?,?,?,?)`,
        [kakaoId, name, email, birthday, phone_number]
      );
    } catch {
      const error = new Error('dataSource Error');
      error.statusCode = 400;
  
      throw error;
    }
  };

module.exports = {
    createAdmin,
    getUserByEmail,
    createUser
}