const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadOmr } = require('../controllers/omrController');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadOmr);

module.exports = router;
