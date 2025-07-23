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

const upload = multer({ storage });
router.post('/posts', createPost);

// Routes
router.post('/upload', upload.array('images'), (req, res) => {
  console.log('Received upload request');
  console.log('Files', req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const filUrls = req.files.map(file =>{
    const path = '/uploads/community/${file.filename}';
    console.log('File URL:', path);
    return path;
  } );
  res.status(200).json({ imageUrls: filUrls });
});
router.get('/posts', getAllPosts);

module.exports = router;
