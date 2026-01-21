//Imports
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./services/db');   // ✅ import MongoDB connection

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');       // make sure file name matches
const enrollmentRoutes = require('./routes/enrollments');
const notificationRoutes = require('./routes/notifications');

//App Setup
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // eta frontend backend er moddhe communication er jonne lagbe / allows frontend to talk to backend
app.use(bodyParser.json()); // eta json data parse korar jonne lagbe
/*
- Parses incoming requests with JSON payloads.
- Example: when you POST /api/auth/register with { "name": "Samin" }, 
this middleware makes sure req.body.name is available in your controller.

*/

app.use(bodyParser.urlencoded({ extended: true })); // eta urlencoded data parse korar jonne lagbe
/*
- Parses form submissions (like HTML forms).
- Useful if you send data as application/x-www-form-urlencoded.

*/


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