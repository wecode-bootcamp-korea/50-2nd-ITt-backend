const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getUserByEmail } = require('../models/userDao');
const userDao = require('../models/userDao');
dotenv.config()

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    try{
    if (!token) {
        return res.status(401).json({message:'TOKEN_REQUIRED'})}
    const decoded = jwt.verify(token, process.env.SECRET_KEY) //토큰 깐 정보
    const email = decoded.email;
    const checkEmail = await userDao.getUserByEmail(email) //DB에서 이메일 검색
    if (!checkEmail) {
        return res.status(400).json({message:'USER_NOT_FOUND'})}
    req.user = decoded;                                   //req.user에 토큰정보 담기
    console.log('베리파이 토큰 decoded',decoded)      
    next();
    } catch (error) {
        return res.status(error.statusCode).json({message : error.message})
    }
}

module.exports = {
    verifyToken
}
