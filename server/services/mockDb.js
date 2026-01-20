// Mock Database Service
// This can be easily replaced with MongoDB/PostgreSQL

class MockDatabase {
  constructor() {
    this.users = [
      {
        id: '1',
        name: 'John Student',
        email: 'john@university.edu',
        password: '$2a$10$rOzJqZXp8XQqXqXqXqXqXe', // mock hash for "password123"
        role: 'student',
        universityId: 'STU001',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Dr. Jamil Acad',
        email: 'jamil@university.edu',
        password: '$2a$10$rOzJqZXp8XQqXqXqXqXqXe',
        role: 'instructor',
        universityId: 'INS001',
        department: 'Computer Science',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Sarah Student',
        email: 'sarah@university.edu',
        password: '$2a$10$rOzJqZXp8XQqXqXqXqXqXe',
        role: 'student',
        universityId: 'STU002',
        department: 'Engineering',
        createdAt: new Date().toISOString()
      }
    ];

    this.courses = [
      {
        id: '1',
        courseCode: 'CS101',
        title: 'Introduction to Computer Science',
        instructorId: '2',
        instructorName: 'Dr. Jamil Acad',
        semester: 'Fall 2024',
        totalSeats: 30,
        availableSeats: 12,
        prerequisites: ['None'],
        description: 'Fundamental concepts of computer science and programming.',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        courseCode: 'CS233',
        title: 'Software Design Methods',
        instructorId: '2',
        instructorName: 'Dr. Jamil Acad',
        semester: 'Fall 2024',
        totalSeats: 25,
        availableSeats: 0,
        prerequisites: ['CS101'],
        description: 'Advanced software design patterns and methodologies.',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        courseCode: 'CS250',
        title: 'Systems Analysis',
        instructorId: '2',
        instructorName: 'Dr. Jamil Acad',
        semester: 'Fall 2024',
        totalSeats: 20,
        availableSeats: 5,
        prerequisites: ['CS101'],
        description: 'Analysis and design of computer systems.',
        createdAt: new Date().toISOString()
      }
    ];

    this.enrollments = [
      {
        id: '1',
        studentId: '3',
        courseId: '1',
        status: 'approved',
        submittedAt: new Date().toISOString(),
        studentName: 'Sarah Student',
        studentUniversityId: 'STU002'
      }
    ];

    this.notifications = [];
    this.notificationSubscriptions = []; // { studentId, courseId }
  }

  // User operations
  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(user) {
    const newUser = {
      id: String(this.users.length + 1),
      ...user,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Course operations
  getAllCourses() {
    return this.courses;
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id);
  }

  getCoursesByInstructor(instructorId) {
    return this.courses.filter(c => c.instructorId === instructorId);
  }

  createCourse(course) {
    const newCourse = {
      id: String(this.courses.length + 1),
      ...course,
      createdAt: new Date().toISOString()
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateCourse(id, updates) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = { ...this.courses[index], ...updates };
      return this.courses[index];
    }
    return null;
  }

  deleteCourse(id) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      return this.courses.splice(index, 1)[0];
    }
    return null;
  }

  // Enrollment operations
  createEnrollment(enrollment) {
    const student = this.findUserById(enrollment.studentId);
    const newEnrollment = {
      id: String(this.enrollments.length + 1),
      ...enrollment,
      studentName: student?.name || '',
      studentUniversityId: student?.universityId || '',
      submittedAt: new Date().toISOString()
    };
    this.enrollments.push(newEnrollment);
    return newEnrollment;
  }

  getEnrollmentById(id) {
    return this.enrollments.find(e => e.id === id);
  }

  getEnrollmentsByCourse(courseId) {
    return this.enrollments.filter(e => e.courseId === courseId);
  }

  getEnrollmentsByStudent(studentId) {
    return this.enrollments.filter(e => e.studentId === studentId);
  }

  updateEnrollment(id, updates) {
    const index = this.enrollments.findIndex(e => e.id === id);
    if (index !== -1) {
      this.enrollments[index] = { ...this.enrollments[index], ...updates };
      return this.enrollments[index];
    }
    return null;
  }

  // Notification operations
  createNotification(notification) {
    const newNotification = {
      id: String(this.notifications.length + 1),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  getNotificationsByStudent(studentId) {
    return this.notifications.filter(n => n.studentId === studentId);
  }

  updateNotification(id, updates) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], ...updates };
      return this.notifications[index];
    }
    return null;
  }

  // Notification subscription operations
  subscribeToCourseNotifications(studentId, courseId) {
    const exists = this.notificationSubscriptions.find(
      s => s.studentId === studentId && s.courseId === courseId
    );
    if (!exists) {
      this.notificationSubscriptions.push({ studentId, courseId });
      return true;
    }
    return false;
  }

  getSubscriptionsByCourse(courseId) {
    return this.notificationSubscriptions.filter(s => s.courseId === courseId);
  }

  notifySubscribedStudents(courseId, message) {
    const subscriptions = this.getSubscriptionsByCourse(courseId);
    subscriptions.forEach(sub => {
      this.createNotification({
        studentId: sub.studentId,
        courseId: courseId,
        message: message
      });
    });
  }
}

// Singleton instance
const mockDb = new MockDatabase();

module.exports = mockDb;
