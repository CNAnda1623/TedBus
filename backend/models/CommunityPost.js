const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  title: String,
  route: String,
  city: String,
  story: String,
  tips: String,
  photos: [String], // this is where image URLs will be saved
  author: { type: String, default: 'Anonymous' },
  timestamp: { type: Date, default: Date.now }, // when the post is created
  likes: { type: Number, default: 0 },
  comments: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});
module.exports = mongoose.model('CommunityPost', communityPostSchema);
