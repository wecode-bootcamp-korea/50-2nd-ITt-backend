const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const adminDao = require("../models/adminDao")

// 토큰 검증
const verfiyToken  = async (req, res, next) => {
    const jwtToken = req.headers.authorization;
    const secetkey = process.env.SECRET_KEY;

    if(!jwtToken){
        return res.status(403).json({message : "토큰이 존재하지 않습니다."})

    }else{
        try{
            const decoded = await tokenDecode(jwtToken, secetkey);

            req.user = decoded;

            const userInfo = req.user;
            const isAdmin = userInfo.isAdmin;

            if(isAdmin !== 1){
               throw new Error("admin_login_fail")
            }
            next();
        }catch(error){

            if(error.message === "admin_login_fail"){
                return res.json({message : "admin_login_fail"})
            }
            return res.status(403).json({message : "권한이 없습니다."})
        }
    }
}

// 디코딩
const tokenDecode = async(jwtToken, secetkey) =>{
    return jwt.verify(jwtToken, secetkey);
}

module.exports = {
    verfiyToken
}