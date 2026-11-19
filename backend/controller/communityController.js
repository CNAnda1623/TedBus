// controller/communityController.js

const CommunityPost = require('../models/CommunityPost');

// Create a new travel post
exports.createPost = async (req, res) => {
  try {
    console.log('📤 Creating post with data:', req.body);

    if (!req.body.title || !req.body.story) {
      return res.status(400).json({ message: 'Title and Story are required' });
    }

    const poster = req.body.posterName || req.body.author || 'Anonymous';
    const photo = req.body.posterPhoto || '';

    const newPost = new CommunityPost({
      title: req.body.title,
      route: req.body.route || '',
      city: req.body.city || '',
      story: req.body.story,
      tips: req.body.tips || '',
      photos: req.body.photos || [],
      author: poster,
      posterName: poster,
      posterPhoto: photo,
      timestamp: new Date(),
      comments: [],
      likes: 0
    });

    const savedPost = await newPost.save();
    console.log('✅ Saved post to MongoDB:', savedPost._id);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Error saving post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all travel posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ timestamp: -1, createdAt: -1 });

    // Ensure posterName is set if author is present
    const mapped = posts.map(p => {
      const doc = p.toObject();
      if (!doc.posterName) doc.posterName = doc.author || 'Anonymous';
      return doc;
    });

    res.status(200).json(mapped);
  } catch (err) {
    console.error('❌ Get Posts Error:', err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error('❌ Like post error:', err);
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = {
      content: req.body.content,
      author: req.body.author || 'Anonymous',
      authorPhoto: req.body.authorPhoto || '',
      createdAt: new Date()
    };
    const post = await CommunityPost.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error('❌ Add comment error:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get comments for a post
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post.comments || []);
  } catch (err) {
    console.error('❌ Get comments error:', err);
    res.status(500).json({ error: 'Failed to get comments' });
  }
};
