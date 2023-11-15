const axios = require("axios")
const jwt = require("jsonwebtoken");
const path = require("path");
const envPath = path.join(__dirname, "../", ".env");
const dotenv = require("dotenv");
dotenv.config({path: envPath});

const accessToken = async(code) => {

    const authToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    params:{
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_KEY_REST_API,
        code,
        redirect_uri: process.env.KAKAO_USER_URL
    }
});
    const Token = authToken.data.access_token;
    const response = axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `bearer ${Token}`,
        },
    });


    return response;
}
module.exports = {
    accessToken
}