// routes/communityRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const communityController = require('../controller/communityController');

const {
  createPost,
  getAllPosts
} = require('../controller/communityController');

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/community/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const filenames = req.files.map(file => file.filename);
  res.status(200).json(filenames);
});
router.get('/all', getAllPosts);

module.exports = router;
