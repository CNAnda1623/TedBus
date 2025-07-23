// routes/communityRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createPost,
  getAllPosts
} = require('../controller/communityController');

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/community/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.post('/create', upload.array('images'), createPost);
router.get('/all', getAllPosts);

module.exports = router;
