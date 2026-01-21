const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./services/db');   // ✅ import MongoDB connection

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');       // make sure file name matches
const enrollmentRoutes = require('./routes/enrollments');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running with MongoDB!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});