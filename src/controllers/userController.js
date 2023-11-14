const userService = require('../services/userService')


const adminsignup = async (req, res) => {
    try {
        const data = await userService.adminsignup(req.body)
        return res.status(200).json(data)
    } catch (error) {
        return res.status(error.statusCode).json({message : error.message})
    }
}

const kakaologin = async (req, res) => {
    try {
        const code = req.headers.code
      if (!code)
        {return res.status(400).json({message:'INVALID_ACCESTOKEN'})}
        const result = await userService.kakaologin(code)
        return res.status(200).json({result});
    } catch (error) {
        return res.status(error.statusCode).json({message : error.message})
    }
}

module.exports  = { 
    adminsignup, 
    kakaologin
}