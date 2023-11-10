const s3 = require("../utils/aws-config");
const fs = require("fs");
const path = require("path")
const envPath = path.join(__dirname, "../../",".env")
const dotenv = require("dotenv");
dotenv.config({path: envPath});

const imageUpload = async (profileImage) => { 
    const fileStram = fs.createReadStream(profileImage.path);

    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `images/${Date.now()}_${profileImage.originalname}`, 
        Body: fileStram,
        ContentType: profileImage.mimetype,
        // ACL: "public-read"
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult;
    } catch (error) {
        console.log(error)
    }
}

module.exports = imageUpload;
