const express = require('express');
// const upload = require("../s3/s3.js");
const router = express.Router();

// router.post("/", upload.single("photo"), async (req, res) => {
//   const imageUrl = req.file.location;
//   console.log(imageUrl);
//   res.status(200).json({ data: imageUrl });
// });

module.exports = router;
