// controller/communityController.js
const CommunityPost = require('../models/CommunityPost');

// Create a new travel post
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      story,
      template = 'story',
      route = '',
      city = '',
      tips = '',
      photos = [],
      itineraryDays = 3,
      budgetRange = '₹5,000 - ₹10,000',
      bestSeason = 'Oct - Mar',
      tipCategory = 'General',
      reviewMode = 'bus',
      operator = '',
      rating = 4,
      pros = '',
      cons = ''
    } = req.body;

    if (!title || title.trim().length < 8) {
      return res.status(400).json({ message: 'Title must be at least 8 characters long.' });
    }

    const minBody = template === 'tip' ? 20 : 50;
    if (!story || story.trim().length < minBody) {
      return res.status(400).json({ message: `Body must be at least ${minBody} characters long.` });
    }

    const author = req.body.posterName || req.body.author || 'Traveller';
    const photo = req.body.posterPhoto || '';

    const newPost = new CommunityPost({
      title: title.trim(),
      story: story.trim(),
      template,
      route: route.trim(),
      city: city.trim(),
      tips: tips.trim(),
      photos,
      itineraryDays: Number(itineraryDays) || 3,
      budgetRange,
      bestSeason,
      tipCategory,
      reviewMode,
      operator,
      rating: Number(rating) || 4,
      pros,
      cons,
      author: author.trim() || 'Traveller',
      posterName: author.trim() || 'Traveller',
      posterPhoto: photo,
      timestamp: new Date(),
      likes: 0,
      comments: []
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('❌ Error saving post:', error);
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

// Get travel posts with pagination & filtering
exports.getAllPosts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(50, parseInt(req.query.pageSize) || 9));
    const skip = (page - 1) * pageSize;

    const query = {};

    // Template filter
    if (req.query.template && req.query.template !== 'all') {
      query.template = req.query.template;
    }

    // City / Destination filter
    if (req.query.city && req.query.city !== 'All') {
      query.city = new RegExp(req.query.city, 'i');
    }

    // Search keyword
    if (req.query.search) {
      const term = req.query.search.trim();
      query.$or = [
        { title: new RegExp(term, 'i') },
        { story: new RegExp(term, 'i') },
        { city: new RegExp(term, 'i') },
        { route: new RegExp(term, 'i') }
      ];
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (req.query.sort === 'likes') {
      sortObj = { likes: -1, createdAt: -1 };
    }

    const total = await CommunityPost.countDocuments(query);
    const posts = await CommunityPost.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      posts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
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

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!req.body.content || !req.body.content.trim()) {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }

    const comment = {
      content: req.body.content.trim(),
      author: req.body.author || 'Traveller',
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
    const post = await CommunityPost.findById(req.params.id).select('comments');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post.comments || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load comments' });
  }
};
