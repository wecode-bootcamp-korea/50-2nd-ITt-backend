const jwtToken = require("jsonwebtoken");

const createToken = async(dbUserId, dbUserEmail, dbUserName, isAdmin, profile_image) => {
    const secretKey = process.env.SECRET_KEY;
    const token =  jwtToken.sign(
        {id:dbUserId, 
        email:dbUserEmail, 
        name:dbUserName, 
        is_admin:isAdmin,
        profile_image:profile_image}, secretKey)
    return token;
}
module.exports = {
    createToken
}