const prisma = require('../prismaClient');

const createCourse = async (data) => {
  return await prisma.course.create({
    data: {
      courseCode: data.courseCode,
      title: data.title,
      instructorId: data.instructorId,
      semester: data.semester,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      prerequisites: data.prerequisites || null,
      description: data.description || null
    },
    include: {
      instructor: true
    }
  });
};

const getAllCourses = async () => {
  return await prisma.course.findMany({
    include: {
      instructor: true
    }
  });
};

const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      instructor: true
    }
  });

  // Transform to match frontend expectations (instructorName)
  if (course) {
    return {
      ...course,
      instructorName: course.instructor.name
    };
  }
  return null;
};

const getCoursesByInstructor = async (instructorId) => {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    include: {
      instructor: true
    }
  });

  // Transform to match frontend expectations
  return courses.map(course => ({
    ...course,
    instructorName: course.instructor.name
  }));
};

const updateCourse = async (id, data) => {
  const course = await prisma.course.update({
    where: { id },
    data,
    include: {
      instructor: true
    }
  });

  return {
    ...course,
    instructorName: course.instructor.name
  };
};

const deleteCourse = async (id) => {
  return await prisma.course.delete({
    where: { id },
    include: {
      instructor: true
    }
  });
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByInstructor,
  updateCourse,
  deleteCourse
};
