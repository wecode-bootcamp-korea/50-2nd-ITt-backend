const userDao = require('../models/userDao')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios")
const dotenv = require('dotenv');
const error = require('../utils/error');
dotenv.config()


const adminsignup = async (data) => {
    const { email, password, kakao_id, name, is_admin } = data
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userDao.createAdmin(email, hashedPassword, kakao_id, name, is_admin);
    return { message: "SIGN_UP_SUCCESS" };
}

const kakaologin = async (code) => {
  const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    params:{
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_KEY_REST_API,
        code,
        redirect_uri: process.env.KAKAO_USER_URL
    }
});
  const accessToken = authToken.data.access_token;
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `bearer ${accessToken}`,
      },
    });
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
    if (userData.length===0) {
      await userDao.createUser(
        kakaoId,
        name,
        email,
        birthday,
        phone_number,
      );
    const userSearch = await userDao.getUserByEmail(email);
    const token = jwt.sign({ id: userSearch[0].id, email: userSearch[0].email, userName: userSearch[0].name },
        process.env.SECRET_KEY);
        console.log('token',token)
    return {
        message:"SIGN_UP_SUCCESS",
        token : token,
        id : userSearch[0].id,
        email : userSearch[0].email,
        userName : userSearch[0].name
    }
    } else { 
    const token = jwt.sign({ id: userData[0].id, email: userData[0].email, userName: userData[0].name },
        process.env.SECRET_KEY);
        console.log('token',token)
    return {
      message:"SIGN_IN_SUCCESS",
      token : token,
      id : userData[0].id,
      email : userData[0].email,
      userName : userData[0].name
    }
  };
}

module.exports = {
    adminsignup,
    kakaologin
}
