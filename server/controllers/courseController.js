const courseService = require('../services/courseService');

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    // Transform prerequisites from string to array for frontend compatibility
    const transformedCourses = courses.map(course => ({
      ...course,
      prerequisites: course.prerequisites ? course.prerequisites.split(',').map(p => p.trim()) : []
    }));
    res.json(transformedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Transform prerequisites from string to array for frontend compatibility
    const transformedCourse = {
      ...course,
      prerequisites: course.prerequisites ? course.prerequisites.split(',').map(p => p.trim()) : []
    };

    res.json(transformedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCourse = async (req, res) => {
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

    // Convert prerequisites array to string if needed
    const prerequisitesStr = Array.isArray(prerequisites) 
      ? prerequisites.join(', ') 
      : (prerequisites || '');

    const course = await courseService.createCourse({
      courseCode,
      title,
      instructorId,
      semester,
      totalSeats: parseInt(totalSeats),
      availableSeats: parseInt(totalSeats),
      prerequisites: prerequisitesStr,
      description: description || ''
    });

    // Transform prerequisites for response
    const transformedCourse = {
      ...course,
      prerequisites: course.prerequisites ? course.prerequisites.split(',').map(p => p.trim()) : []
    };

    res.status(201).json(transformedCourse);
  } catch (error) {
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert string numbers to integers if present
    if (updates.totalSeats) updates.totalSeats = parseInt(updates.totalSeats);
    if (updates.availableSeats) updates.availableSeats = parseInt(updates.availableSeats);

    // Convert prerequisites array to string if needed
    if (updates.prerequisites) {
      if (Array.isArray(updates.prerequisites)) {
        updates.prerequisites = updates.prerequisites.join(', ');
      }
    }

    const course = await courseService.updateCourse(id, updates);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Transform prerequisites for response
    const transformedCourse = {
      ...course,
      prerequisites: course.prerequisites ? course.prerequisites.split(',').map(p => p.trim()) : []
    };

    res.json(transformedCourse);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await courseService.deleteCourse(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', course });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const courses = await courseService.getCoursesByInstructor(instructorId);
    
    // Transform prerequisites for response
    const transformedCourses = courses.map(course => ({
      ...course,
      prerequisites: course.prerequisites ? course.prerequisites.split(',').map(p => p.trim()) : []
    }));

    res.json(transformedCourses);
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
