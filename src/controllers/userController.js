const userService = require('../services/userService')


const adminsignup = async (req, res) => {
    const data = await userService.adminsignup(req.body)
    res.status(200).json(data)
}

const kakaologin = async (req, res) => {
    const code = req.headers.code
    if (!code)
        {return res.status(400).json({message:'INVALID_ACCESTOKEN'})}
    const result = await userService.kakaologin(code)
    res.status(200).json({result});
}

module.exports  = { 
    adminsignup, 
    kakaologin
}