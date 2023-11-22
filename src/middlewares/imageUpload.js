const s3 = require("../utils/aws-config");
const fs = require("fs");
const path = require("path")
const envPath = path.join(__dirname, "../../",".env")
const dotenv = require("dotenv");
dotenv.config({path: envPath});

// 이미지 업로드 함수
const itemImageUpload = async (itemImage) => { 
    const fileStram = fs.createReadStream(itemImage.path); // fs모듈을 사용하여 받아온 이미지를 읽기 위한 스트림 생성

    const params = {
        Bucket: process.env.AWS_S3_BUCKET, //aws-config 파일에 정의된 S3 버킷이름
        Key: `itemImages/${Date.now()}_${itemImage.originalname}`, // S3에 images라는 폴더가 생성돠고 업로드시간+파일명과 같이 저장됨
        Body: fileStram, // 받아온 파일 데이터
        ContentType: itemImages.mimetype, // HTTP 헤더에 사용되는 브라우저가 인지하는 파일타입
        // ACL: "public-read"
    };

    try {
        const uploadResult = await s3.upload(params).promise(); // AWS-SDK의 s3.upload 메소드를 사용하여 parms 담긴 데이터를 s3에 넘김
        return uploadResult; 
    } catch (error) {
        throw error;
    }
}

const profileImageUpload = async (profileImage) => { 
    const fileStram = fs.createReadStream(profileImage.path); // fs모듈을 사용하여 받아온 이미지를 읽기 위한 스트림 생성

    const params = {
        Bucket: process.env.AWS_S3_BUCKET, //aws-config 파일에 정의된 S3 버킷이름
        Key: `images/${Date.now()}_${profileImage.originalname}`, // S3에 images라는 폴더가 생성돠고 업로드시간+파일명과 같이 저장됨
        Body: fileStram, // 받아온 파일 데이터
        ContentType: profileImage.mimetype, // HTTP 헤더에 사용되는 브라우저가 인지하는 파일타입
        // ACL: "public-read"
    };


    try {

        const uploadResult = await s3.upload(params).promise(); // AWS-SDK의 s3.upload 메소드를 사용하여 parms 담긴 데이터를 s3에 넘김
        return uploadResult; 
    } catch (error) {
        throw error;
    }
}
module.exports = {
    itemImageUpload,
    profileImageUpload
}

