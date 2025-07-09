const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cabBookingRoutes = require('./routes/cabBooking');
const app = express();


// ✅ Define allowed origins before using cors
const allowedOrigins = [
  'https://get-bus.netlify.app',
  'http://localhost:4200'
];

// ✅ Apply middleware FIRST
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

app.use(express.json());         // ✅ JSON parser
app.use(bodyparser.json());      // Optional: if you still use body-parser

// ✅ Now use your routes
app.use('/api/cab-booking', cabBookingRoutes);
app.use('/api/booking', require('./routes/booking'));
app.use(require('./routes/customer'));
app.use(require('./routes/route'));

// ✅ DB connection
const DBURL = 'mongodb+srv://chetannanda62:P6pld7Kfp6psfWEi@tedbus.fcvedwg.mongodb.net/?retryWrites=true&w=majority&appName=TedBus';

mongoose.connect(DBURL)
  .then(() => console.log('Mongodb connected'))
  .catch(err => console.error('Mongodb connection error:', err));

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('Hello, Ted bus is working');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
