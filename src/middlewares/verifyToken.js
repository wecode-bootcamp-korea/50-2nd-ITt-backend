const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// 토큰 검증
const verfiyToken  = async (req, res, next) => {
    const jwtToken = req.headers.authorization;
    const secetkey = process.env.SECRET_KEY;
    

    if(!jwtToken){
        res.status(403).json({message : "권한이 없습니다"})

    }else{
        try{
            const decoded = await tokenDecode(jwtToken, secetkey);
            req.user = decoded;
            next();
        }catch(err){
            console.log(err);
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