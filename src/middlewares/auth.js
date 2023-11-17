const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const verifyToken = async(req,res, next) => {
    const jwtToken = req.headers.authorization
        if(!jwtToken){
          res.status(403).json({message : 'UNAUTHORIZED_USERS!'})
        }else{
            try{
            const decodedToken = jwt.verify(jwtToken, process.env.TYPEORM_SECRETKEY)
            req.userData = decodedToken
            next()
        }catch(err){
            console.log(err)
            return res.status(403).json({message : 'UNAUTHORIZED_USERS!'})
        }}
}
module.exports = {
    verifyToken
}