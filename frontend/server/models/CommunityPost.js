const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  posterName: String,
  title: String,
  route: String,
  city: String,
  story: String,
  tips: String,
  imageFilenames: [String],
  likes: { type: Number, default: 0 },
  comments: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
