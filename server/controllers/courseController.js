const Course = require('../models/Course');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructorId', 'name email department');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructorId', 'name email department');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      title,
      instructorId,
      semester,
      totalSeats,
      prerequisites,
      description
    } = req.body;

    if (!courseCode || !title || !instructorId || !semester || !totalSeats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course already exists' });
    }

    const course = new Course({
      courseCode,
      title,
      instructorId,
      semester,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      prerequisites: prerequisites || [],
      description: description || ''
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.totalSeats) updates.totalSeats = parseInt(updates.totalSeats);
    if (updates.availableSeats) updates.availableSeats = parseInt(updates.availableSeats);

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get courses by instructor
const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = await Course.find({ instructorId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor
};