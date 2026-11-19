// routes/communityRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { createPost, getAllPosts } = require('../controller/communityController');
require('dotenv').config();
// ✅ Supabase Setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Multer Setup for memory storage (we'll upload to Supabase directly)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create post route
router.post('/posts', createPost);

// ✅ Upload to Supabase
router.post('/upload', upload.array('photos'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const fileExt = path.extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
      const filePath = `community-uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('community-uploads')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to upload image' });
      }

      // ✅ Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('community-uploads')
        .getPublicUrl(fileName);

      imageUrls.push(publicUrlData.publicUrl);
    }

    res.status(200).json({ imageUrls });

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

// Get all posts
router.get('/posts', getAllPosts);

module.exports = router;
