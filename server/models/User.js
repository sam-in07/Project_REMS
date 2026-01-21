const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },   // ✅ Add this field
  role: { type: String, enum: ['student', 'instructor'], required: true },
  universityId: { type: String, required: true },
  department: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);