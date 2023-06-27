const express = require('express');
// const upload = require("../s3/s3.js");
const router = express.Router();

router.post('/', upload.single('photo'), async (req, res) => {
  const photo = req.files;
  console.log(photo);
});

module.exports = router;
