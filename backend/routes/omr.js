const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadOmr } = require('../controllers/omrController');
const path = require('path');
const AnswerKey = require('../models/OmrResult');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadOmr);

// Save a new answer key
router.post("/answers", async (req, res) => {
    try {
      const { name, numQuestions, numOptions, answers } = req.body;
      const newKey = new AnswerKey({ name, numQuestions, numOptions, answers });
      await newKey.save();
      res.json({ success: true, message: "Answer key saved!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to save." });
    }
  });
  
  // Get all saved answer keys
  router.get("/answers", async (req, res) => {
    try {
      const keys = await AnswerKey.find().sort({ name: 1 });
      res.json(keys);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to fetch keys." });
    }
  });

module.exports = router;
