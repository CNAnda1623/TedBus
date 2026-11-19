const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  title: String,
  route: String,
  city: String,
  story: String,
  tips: String,
  photos: [String], // image URLs
  author: { type: String, default: 'Anonymous' },
  posterName: { type: String, default: 'Anonymous' },
  posterPhoto: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [
    {
      content: String,
      author: { type: String, default: 'Anonymous' },
      authorPhoto: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
