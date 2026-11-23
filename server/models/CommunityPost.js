const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  template: {
    type: String,
    enum: ['story', 'itinerary', 'tip', 'review'],
    default: 'story'
  },
  route: { type: String, default: '' },
  city: { type: String, default: '' },
  story: { type: String, required: true },
  tips: { type: String, default: '' },
  photos: [{ type: String }],
  
  // Itinerary fields
  itineraryDays: { type: Number, default: 3 },
  budgetRange: { type: String, default: '₹5,000 - ₹10,000' },
  bestSeason: { type: String, default: 'Oct - Mar' },
  
  // Tip fields
  tipCategory: { type: String, default: 'General' },
  
  // Route review fields
  reviewMode: { type: String, enum: ['bus', 'train', 'cab'], default: 'bus' },
  operator: { type: String, default: '' },
  rating: { type: Number, default: 4 },
  pros: { type: String, default: '' },
  cons: { type: String, default: '' },

  author: { type: String, default: 'Traveller' },
  posterName: { type: String, default: 'Traveller' },
  posterPhoto: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [
    {
      content: String,
      author: { type: String, default: 'Traveller' },
      authorPhoto: { type: String, default: '' },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

communityPostSchema.index({ title: 'text', story: 'text', city: 'text' });
communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ template: 1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
