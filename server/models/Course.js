const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  prerequisites: [{ type: String }],   // list of course codes
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);