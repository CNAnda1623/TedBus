const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const communityRoutes = require('./routes/communityRoutes');
app.use('/uploads/community', express.static('uploads/community'));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());

// ✅ CORS setup
const allowedOrigins = [
  'https://get-bus.netlify.app',
  'http://localhost:4200'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Routes
const cabBookingRoutes = require('./routes/cabBooking');
app.use('/api/cab-booking', cabBookingRoutes); // ✅ this line remains
app.use('/api/booking', require('./routes/booking'));
app.use('/api', require('./routes/customer'));
app.use('/api', require('./routes/route'));
app.use('/api', require('./routes/busRoutes'));
app.use('/api/community', communityRoutes);



// ✅ MongoDB connection
const DBURL = 'mongodb+srv://chetannanda62:P6pld7Kfp6psfWEi@tedbus.fcvedwg.mongodb.net/?retryWrites=true&w=majority&appName=TedBus';

mongoose.connect(DBURL)
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error('MongoDB connection error ❌:', err));

// ✅ Default route
app.get('/', (req, res) => {
  res.send('🚀 Ted Bus server is running');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Server is running on port ${PORT}`);
});

