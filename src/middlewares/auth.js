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
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const email = decoded.email;
    const checkEmail = await userDao.getUserByEmail(email)
    if (!checkEmail) {
        return res.status(400).json({message:'USER_NOT_FOUND'})}
    req.user = decoded;      
    next();
    } catch (error) {
        return res.status(error.statusCode).json({message : error.message})
    }
}

module.exports = {
    verifyToken
}
