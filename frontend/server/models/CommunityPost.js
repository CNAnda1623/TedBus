// models/CommunityPost.js

const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  imageUrls: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  postType: {
    type: String,
    enum: ['story', 'tip', 'advice', 'gallery'],
    default: 'story'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);
