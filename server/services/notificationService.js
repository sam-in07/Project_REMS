const prisma = require('../prismaClient');

const createNotification = async (data) => {
  return await prisma.notification.create({
    data: {
      studentId: data.studentId,
      courseId: data.courseId,
      message: data.message
    }
  });
};

const getNotificationsByStudent = async (studentId) => {
  // Get all notifications except subscription markers
  const notifications = await prisma.notification.findMany({
    where: {
      studentId,
      NOT: {
        message: {
          startsWith: 'SUBSCRIPTION:'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Transform isRead to read for frontend compatibility
  return notifications.map(notif => ({
    ...notif,
    read: notif.isRead
  }));
};

const updateNotification = async (id, data) => {
  return await prisma.notification.update({
    where: { id },
    data
  });
};

const markAsRead = async (id) => {
  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });

  // Transform isRead to read for frontend compatibility
  return {
    ...notification,
    read: notification.isRead
  };
};

// Notification subscriptions - track subscriptions via notifications with special marker
const subscribeToCourseNotifications = async (studentId, courseId) => {
  // Verify student and course exist
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  
  if (!student) {
    throw new Error('Student not found');
  }
  if (!course) {
    throw new Error('Course not found');
  }

  // Check if already subscribed (has a subscription notification)
  const existingSubscription = await prisma.notification.findFirst({
    where: {
      studentId,
      courseId,
      message: {
        startsWith: 'SUBSCRIPTION:'
      },
      isRead: false
    }
  });

  if (existingSubscription) {
    throw new Error('Already subscribed to notifications for this course');
  }

  // Create a subscription marker notification (students won't see this as a regular notification)
  // We'll use a special message prefix to identify subscriptions
  await prisma.notification.create({
    data: {
      studentId,
      courseId,
      message: `SUBSCRIPTION: You are subscribed to notifications for ${course.courseCode}`
    }
  });

  return { studentId, courseId, subscribed: true };
};

const getSubscriptionsByCourse = async (courseId) => {
  // Get all students subscribed to this course (those with subscription notifications)
  const subscriptions = await prisma.notification.findMany({
    where: {
      courseId,
      message: {
        startsWith: 'SUBSCRIPTION:'
      }
    },
    select: {
      studentId: true
    },
    distinct: ['studentId']
  });

  return subscriptions.map(s => ({ studentId: s.studentId, courseId }));
};

const notifySubscribedStudents = async (courseId, message) => {
  // Get all students who are subscribed:
  // 1. Students with subscription notifications for this course
  // 2. Students with pending enrollments (they also want notifications)
  
  const subscriptionNotifications = await prisma.notification.findMany({
    where: {
      courseId,
      message: {
        startsWith: 'SUBSCRIPTION:'
      }
    },
    select: {
      studentId: true
    },
    distinct: ['studentId']
  });

  const pendingEnrollments = await prisma.enrollment.findMany({
    where: {
      courseId,
      status: 'pending'
    },
    select: {
      studentId: true
    },
    distinct: ['studentId']
  });

  // Combine and deduplicate student IDs
  const subscribedStudentIds = [
    ...new Set([
      ...subscriptionNotifications.map(n => n.studentId),
      ...pendingEnrollments.map(e => e.studentId)
    ])
  ];

  // Create notifications for all subscribed students (skip subscription marker messages)
  const notifications = await Promise.all(
    subscribedStudentIds.map(studentId =>
      prisma.notification.create({
        data: {
          studentId,
          courseId,
          message
        }
      })
    )
  );

  return notifications;
};

module.exports = {
  createNotification,
  getNotificationsByStudent,
  updateNotification,
  markAsRead,
  subscribeToCourseNotifications,
  getSubscriptionsByCourse,
  notifySubscribedStudents
};
