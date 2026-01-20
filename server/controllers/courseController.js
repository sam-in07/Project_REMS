const mockDb = require('../services/mockDb');

const getAllCourses = (req, res) => {
  try {
    const courses = mockDb.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = (req, res) => {
  try {
    const { id } = req.params;
    const course = mockDb.getCourseById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourse = (req, res) => {
  try {
    const {
      courseCode,
      title,
      instructorId,
      instructorName,
      semester,
      totalSeats,
      prerequisites,
      description
    } = req.body;

    if (!courseCode || !title || !instructorId || !semester || !totalSeats) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const course = mockDb.createCourse({
      courseCode,
      title,
      instructorId,
      instructorName: instructorName || '',
      semester,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      prerequisites: prerequisites || [],
      description: description || ''
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert string numbers to integers if present
    if (updates.totalSeats) updates.totalSeats = parseInt(updates.totalSeats);
    if (updates.availableSeats) updates.availableSeats = parseInt(updates.availableSeats);

    const course = mockDb.updateCourse(id, updates);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = (req, res) => {
  try {
    const { id } = req.params;
    const course = mockDb.deleteCourse(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoursesByInstructor = (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = mockDb.getCoursesByInstructor(instructorId);
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
