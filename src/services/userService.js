const userDao = require('../models/userDao')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios")
const dotenv = require('dotenv');
const error = require('../utils/error');
const kakao = require('../middlewares/kakao')
const jwtToken = require('../middlewares/jwtToken')
dotenv.config()


const adminsignup = async (data) => {
    const { email, password, kakao_id, name, is_admin } = data
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userDao.createAdmin(email, hashedPassword, kakao_id, name, is_admin);
    return { message: "SIGN_UP_SUCCESS" };
}

const kakaologin = async (code) => {

  const authToken = await kakao.accessToken(code)
  const response = authToken;

    if (!response || response.status !== 200) {
      error.throwError(400,'KAKAO CONNECTION ERROR');
    }

    const userInfo = {
      kakaoId: response.data.id,
      name: response.data.kakao_account.name,
      email: response.data.kakao_account.email,
      birthday: response.data.kakao_account.birthday,
      phone_number: response.data.kakao_account.phone_number
    };
   
    const { kakaoId, name, email, birthday, phone_number } = userInfo;

    const userData = await userDao.getUserByEmail(email);

    if (userData.length === 0) {
      await userDao.createUser(
        kakaoId,
        name,
        email,
        birthday,
        phone_number
      );
      
    const userSearch = await userDao.getUserByEmail(email);

    const dbUserId = userSearch[0].id
    const dbUserEmail = userSearch[0].email
    const dbUserName = userSearch[0].name

    const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName);

    return {
        message:"SIGN_UP_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        userName : dbUserName
    };
  } else {
    const userSearch = await userDao.getUserByEmail(email);

    const dbUserId = userSearch[0].id;
    const dbUserEmail = userSearch[0].email;
    const dbUserName = userSearch[0].name;
    
      const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName);
      return {
        message:"SIGN_IN_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        userName : dbUserName
    };
  }
}

module.exports = {
    adminsignup,
    kakaologin
}
