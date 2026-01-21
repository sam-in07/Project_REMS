const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/project_rems', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected...');
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;