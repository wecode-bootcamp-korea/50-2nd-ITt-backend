const jwtToken = require("jsonwebtoken");

const createToken = async(dbUserId, dbUserEmail, dbUserName) => {
    const secretKey = process.env.SECRET_KEY;
    const token =  jwtToken.sign({dbUserId, dbUserEmail, dbUserName}, secretKey)
    return token;
}
module.exports = {
    createToken
}