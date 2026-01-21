# University Course Registration & Enrollment Management System

A comprehensive course registration system for universities, built with React frontend and Node.js/Express backend, using a mock database that can be easily replaced with MongoDB or PostgreSQL.

## Features

### Student Features
- Browse course catalog with search functionality
- View detailed course information
- Submit enrollment requests
- Subscribe to seat availability notifications
- Real-time notification system when seats become available
- View enrollment status

### Instructor Features
- Create and edit courses
- View all courses they teach
- Review and manage enrollment requests
- Approve/reject student enrollments
- Automatic seat management
- Track enrollment statistics

## Tech Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: Mock JSON database (MongoDB/PostgreSQL ready)
- **Authentication**: Simple mock authentication (password: "password123" for demo)

## Installation

1. Install backend dependencies:
```bash
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

Or install all at once:
```bash
npm run install-all
```

## Running the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Demo Accounts

### Students
- Email: `john@university.edu` or `sarah@university.edu`
- Password: `password123`

### Instructors
- Email: `jamil@university.edu`
- Password: `password123`

You can also create new accounts using the Sign Up form.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)
- `GET /api/courses/instructor/:instructorId` - Get courses by instructor

### Enrollments
- `POST /api/enrollments` - Create enrollment request
- `GET /api/enrollments/course/:courseId` - Get enrollments by course
- `GET /api/enrollments/student/:studentId` - Get enrollments by student
- `PUT /api/enrollments/:id` - Update enrollment status

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to course notifications
- `GET /api/notifications/:studentId` - Get notifications for student
- `PUT /api/notifications/:id/read` - Mark notification as read

## Project Structure

```
Project_REMS/
├── server/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── services/        # Database service (mockDb.js)
│   └── index.js         # Express server
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/        # Login/Signup
│   │   │   ├── Student/     # Student dashboard & components
│   │   │   ├── Instructor/  # Instructor dashboard & components
│   │   │   └── Course/      # Course details
│   │   ├── services/        # API service layer
│   │   └── App.js           # Main app component
│   └── package.json
├── package.json
└── README.md
```

```
Project_REMS/
server/
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── enrollmentController.js
│   └── notificationController.js
├── routes/
│   ├── auth.js
│   ├── course.js
│   ├── enrollment.js
│   └── notification.js
├── services/
│   ├── db.js              # MongoDB connection
│   └── mockDb.js          # Keep for testing if needed
├── models/                # ✅ NEW: MongoDB schemas
│   ├── User.js
│   ├── Course.js
│   ├── Enrollment.js
│   └── Notification.js
└── index.js               # Express server              # Express server
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Student/
│   │   │   ├── Instructor/
│   │   │   └── Course/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── package.json
└── README.md

```
## Backend FLow 
```
- Flow: Request → Route → Controller → Model → MongoDB → Response
```

## Frontendflow :

🚀 Flow of the Frontend
- Browser loads public/index.html → contains <div id="root"></div>.
- src/index.js runs → attaches React to that root div.
- App.js loads → defines routes and renders components (Auth, Student, Instructor, Course).
- Components call backend APIs via services/ (e.g., authAPI, courseAPI).
- Backend responds → React updates the UI dynamically.

✅ In Short
- index.js is the starting point of your React app.
- It mounts your App component into the browser DOM.
- From there, everything else (routes, components, API calls) flows through App.js.
👉 Do you want me to show you how App.js usually looks in a MERN project (with React Router) so you can see how it connects different components like Login, Dashboard, and Courses?




## Database Migration

The mock database service (`server/services/mockDb.js`) is designed to be easily replaced with a real database:

1. Replace `mockDb.js` with a MongoDB/PostgreSQL service
2. Keep the same method signatures
3. Update controllers to use the new service
4. API contracts remain unchanged

## Business Rules

- Students cannot enroll when course is full (seats = 0)
- "Notify Me" button appears only when seats = 0
- Instructors approve/reject enrollments
- Seat count updates automatically on approval/rejection
- Notifications sent when seat becomes available (0 → 1)
- Enrollment status: pending → approved/rejected

## Future Enhancements

- Real database integration (MongoDB/PostgreSQL)
- JWT-based authentication
- Admin role with full system management
- Course prerequisites validation
- Semester-based course scheduling
- Email notifications
- Grade management
- Assignment submissions

## License

MIT
