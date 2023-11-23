const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyToken = async (req, res, next) => {

  const token = req.headers.authorization;
  console.log(token)

  try {

    if (!token) return res.status(401).json({ message: "TOKEN_REQUIRED" });
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();

  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  verifyToken
};
