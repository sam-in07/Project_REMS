# Setup Guide - University Course Registration System

## Prerequisites

1. **Node.js** (v14 or higher)
2. **PostgreSQL** database (v12 or higher)
3. **npm** or **yarn**

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Set Up PostgreSQL Database

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE rems_db;
   ```

2. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/rems_db?schema=public"
   PORT=5000
   ```
   
   Replace `username`, `password`, and adjust `localhost:5432` if needed.

### 3. Run Prisma Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate deploy
```

For development (creates migration files):
```bash
npx prisma migrate dev
```

### 4. (Optional) Seed Initial Data

You can manually create test users via the Sign Up form, or use Prisma Studio:
```bash
npx prisma studio
```

### 5. Start the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Testing the System

### Create Test Accounts

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create accounts:
   - **Student**: Role = "student"
   - **Instructor**: Role = "instructor"

### Demo Flow

1. **As Instructor**:
   - Login with instructor account
   - Create a new course
   - View enrollment requests
   - Approve/reject enrollments

2. **As Student**:
   - Login with student account
   - Browse courses
   - Enroll in courses
   - Subscribe to notifications for full courses
   - View notifications

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check `.env` file has correct DATABASE_URL
- Ensure database exists: `psql -l` should show `rems_db`

### Port Already in Use

- Change PORT in `.env` file
- Or kill the process using the port

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create fresh migration
npx prisma migrate dev --name init
```

## Project Structure

```
Project_REMS/
├── server/           # Backend (Express + Prisma)
├── client/           # Frontend (React)
├── prisma/           # Prisma schema and migrations
├── generated/        # Generated Prisma client
└── .env              # Environment variables (create this)
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (instructor)
- `GET /api/enrollments/course/:courseId` - Get enrollments
- `POST /api/enrollments` - Create enrollment request
- `GET /api/notifications/:studentId` - Get notifications

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify database connection: `GET /api/health`
3. Check Prisma logs in terminal
4. Ensure all dependencies are installed
