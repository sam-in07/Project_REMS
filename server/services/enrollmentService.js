const prisma = require('../prismaClient');

const createEnrollment = async (data) => {
  // Check if enrollment already exists
  const existing = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: data.studentId,
        courseId: data.courseId
      }
    }
  });

  if (existing) {
    throw new Error('Enrollment already exists');
  }

  // Get student info for response
  const student = await prisma.user.findUnique({
    where: { id: data.studentId }
  });

  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: data.studentId,
      courseId: data.courseId,
      status: data.status || 'pending'
    },
    include: {
      student: true,
      course: true
    }
  });

  // Transform to match frontend expectations
  return {
    ...enrollment,
    studentName: enrollment.student.name,
    studentUniversityId: enrollment.student.universityId
  };
};

const getEnrollmentById = async (id) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { id },
    include: {
      student: true,
      course: true
    }
  });

  if (enrollment) {
    return {
      ...enrollment,
      studentName: enrollment.student.name,
      studentUniversityId: enrollment.student.universityId
    };
  }
  return null;
};

const getEnrollmentsByCourse = async (courseId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      student: true,
      course: true
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return enrollments.map(enrollment => ({
    ...enrollment,
    studentName: enrollment.student.name,
    studentUniversityId: enrollment.student.universityId
  }));
};

const getEnrollmentsByStudent = async (studentId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      student: true,
      course: {
        include: {
          instructor: true
        }
      }
    },
    orderBy: {
      submittedAt: 'desc'
    }
  });

  return enrollments.map(enrollment => ({
    ...enrollment,
    studentName: enrollment.student.name,
    studentUniversityId: enrollment.student.universityId,
    course: {
      ...enrollment.course,
      instructorName: enrollment.course.instructor.name
    }
  }));
};

const updateEnrollment = async (id, data) => {
  const enrollment = await prisma.enrollment.update({
    where: { id },
    data,
    include: {
      student: true,
      course: true
    }
  });

  return {
    ...enrollment,
    studentName: enrollment.student.name,
    studentUniversityId: enrollment.student.universityId
  };
};

module.exports = {
  createEnrollment,
  getEnrollmentById,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  updateEnrollment
};
