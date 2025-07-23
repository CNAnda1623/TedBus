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

const upload = multer({ dest: 'uploads/' });
router.post('/posts', createPost);

// Routes
router.post('/upload', upload.array('images'), (req, res) => {
  const filenames = req.files.map(file => file.filename);
  res.json(filenames);
});
router.get('/all', getAllPosts);

module.exports = router;
