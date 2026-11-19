// controller/communityController.js

const CommunityPost = require('../models/CommunityPost');
const path = require('path');
const fs = require('fs');

// Create a new travel post
exports.createPost = async (req, res) => {
  try {
    console.log('📤 Creating post with data:', req.body);

    // Optional validation
    if (!req.body.title || !req.body.story) {
      return res.status(400).json({ message: 'Title and Story are required' });
    }

    // Debug image URLs
    console.log('🖼️ Received photos:', req.body.photos);

    const newPost = new CommunityPost({
      title: req.body.title,
      route: req.body.route,
      city: req.body.city,
      story: req.body.story,
      tips: req.body.tips,
      photos: req.body.photos, // Should be an array of image URLs
      author: req.body.author || 'Anonymous',
      timestamp: new Date(),
      comments: [],
      likes: 0
    });

    const savedPost = await newPost.save();
    console.log('✅ Saved post:', savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Error saving post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all travel posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });

    // Add default posts if DB is empty
    if (posts.length === 0) {
      const defaultPosts = [
        {
          title: "Welcome to TedBus!",
          story: "I had an amazing journey with TedBus! Highly recommended!",
          tips: "",
          route: "Delhi - Manali",
          city: "Delhi,Manali",
          photos: [],
          author: "Ritika",
          timestamp: new Date(),
          comments: [],
          likes: 3
        },
        {
          title: "Pro Tip for Travelers",
          story: "",
          tips: "Always keep a power bank and snacks handy for long trips.",
          route: "",
          city: "India",
          photos: [],
          author: "TravelBot",
          timestamp: new Date(),
          comments: [],
          likes: 5
        },
        {
          title: "Save Hotel Charges",
          story: "",
          tips: "Advice: Book night buses to save on hotel stays.",
          route: "",
          city: "Mumbai,Pune",
          photos: [],
          author: "Aakash",
          timestamp: new Date(),
          comments: [],
          likes: 4
        }
      ];

      const insertedDefaults = await CommunityPost.insertMany(defaultPosts);
      console.log('ℹ️ Inserted default posts:', insertedDefaults);
      return res.status(200).json(insertedDefaults);
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error('❌ Get Posts Error:', err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};
