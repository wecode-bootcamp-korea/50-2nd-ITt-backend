const aws = require("aws-sdk");
const path = require("path");
const envPath = path.join(__dirname, "../env", ".env");
const dotenv = require("dotenv");
dotenv.config({path: envPath});

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION
})

module.exports = s3