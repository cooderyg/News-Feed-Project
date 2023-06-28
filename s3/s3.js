// const multer = require("multer");
// const multer_s3 = require("multer-s3");
// const aws = require("aws-sdk");
// require("dotenv").config();

// const s3 = new aws.S3({
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_KEY,
//   region: process.env.S3_BUCKET_REGION,
// });

const storage = multer_s3({
  s3: s3,
  bucket: process.env.BUCKET_NAME, // 자신의 s3 버킷 이름
  contentType: multer_s3.AUTO_CONTENT_TYPE,
  acl: "public-read", // 버킷에서 acl 관련 설정을 풀어줘야 사용할 수 있다.
  key: function (req, file, cb) {
    cb(null, `image/review/${Date.now().toString()}-${file.originalname}`);
  },
});

// const upload = multer({
//   storage: storage, // storage를 multer_s3 객체로 지정
// });

// module.exports = upload;
