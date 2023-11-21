const userDao = require('../models/userDao')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios")
const dotenv = require('dotenv');
const error = require('../utils/error');
const kakao = require('../middlewares/kakao')
const jwtToken = require('../middlewares/jwtToken')
const { throwError } = require('../utils/error');
const e = require('express');
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
      
    const [userSearch] = await userDao.getUserByEmail(email);

    const dbUserId = userSearch.id
    const dbUserEmail = userSearch.email
    const dbUserName = userSearch.name
    const isAdmin = userSearch.is_admin
    const profileImage = userSearch.profile_image 

    const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName, isAdmin, profileImage );

    return {
        message:"SIGN_UP_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        name : dbUserName,
        is_admin : isAdmin,
        profile_image : profileImage
    };
  } else {
    const [userSearch] = await userDao.getUserByEmail(email);
    
    const dbUserId = userSearch.id;
    const dbUserEmail = userSearch.email;
    const dbUserName = userSearch.name;
    const isAdmin = userSearch.is_admin
    const profileImage = userSearch.profile_image 

      const token = await jwtToken.createToken(dbUserId, dbUserEmail, dbUserName, isAdmin, profileImage);
      return {
        message:"SIGN_IN_SUCCESS",
        token : token,
        id : dbUserId,
        email : dbUserEmail,
        name : dbUserName,
        is_admin : isAdmin,
        profile_image : profileImage
    };
  }
}

const adminlogin = async (data) => {
  const email = data.email;
  const password = data.password;

  const userSearch = await userDao.getUserByEmail(email);
  
  if (userSearch.length===0) {
    throwError(400,"NON_EXISTENT_USER");
  }
  const isPasswordValid = await bcrypt.compare(password, userSearch[0].password);
  if (!isPasswordValid) {
    throwError(400,"INVALID_PASSWORD");
  }
  
  const token = jwt.sign(
    { id: userSearch[0].id, 
      email: userSearch[0].email, 
      name: userSearch[0].name, 
      isAdmin:userSearch[0].is_admin 
    }, process.env.SECRET_KEY);
  return {
    message: "ADMIN_SIGN_IN_SUCCESS",
    token : token,
    id : userSearch[0].id,
    email : userSearch[0].email,
    name : userSearch[0].name,
    is_admin : userSearch[0].is_admin
  };
}

module.exports = {
    adminsignup,
    kakaologin,
    adminlogin
}
