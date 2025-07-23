// controller/communityController.js

const CommunityPost = require('../models/CommunityPost');
const path = require('path');
const fs = require('fs');

exports.createPost = async (req, res) => {
  try {
    const { content, author, postType } = req.body;
    const imageUrls = req.files ? req.files.map(file => file.filename) : [];

    const newPost = new CommunityPost({
      content,
      author,
      postType,
      imageUrls
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Create Post Error:', err);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });

    // Add default posts if none are in DB
    if (posts.length === 0) {
      const defaultPosts = [
        {
          content: "I had an amazing journey with TedBus! Highly recommended!",
          author: "Ritika",
          postType: "story"
        },
        {
          content: "Travel Tip: Always keep a power bank and snacks handy for long trips.",
          author: "TravelBot",
          postType: "tip"
        },
        {
          content: "Advice: Book night buses to save on hotel stays.",
          author: "Aakash",
          postType: "advice"
        }
      ];

      await CommunityPost.insertMany(defaultPosts);
      return res.status(200).json(defaultPosts);
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error('Get Posts Error:', err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};
