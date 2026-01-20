# Migration from Mock DB to Prisma + PostgreSQL

## ✅ Migration Complete

The system has been successfully migrated from `mockDb.js` to Prisma 7 with PostgreSQL.

## Changes Made

### 1. **Prisma Client Setup**
- Created `server/prismaClient.js` - exports PrismaClient instance
- Updated `server/index.js` - added database connection health check and graceful shutdown

### 2. **Service Layer** (Replaced mockDb)
- ✅ `server/services/userService.js` - User CRUD operations
- ✅ `server/services/courseService.js` - Course CRUD operations with instructor relations
- ✅ `server/services/enrollmentService.js` - Enrollment management
- ✅ `server/services/notificationService.js` - Notification and subscription management

### 3. **Controllers Updated**
- ✅ `server/controllers/authController.js` - Uses userService
- ✅ `server/controllers/courseController.js` - Uses courseService
- ✅ `server/controllers/enrollmentController.js` - Uses enrollmentService + courseService
- ✅ `server/controllers/notificationController.js` - Uses notificationService

### 4. **Key Features**
- ✅ All CRUD operations use Prisma
- ✅ Relations properly loaded (instructor info, student info)
- ✅ Prisma error handling (P2002 for unique constraints, P2025 for not found)
- ✅ Notification subscription tracking via special notification records
- ✅ Frontend compatibility maintained (prerequisites array, instructorName, read field)

### 5. **Data Transformations**
- **Prerequisites**: Stored as comma-separated string in DB, converted to array for frontend
- **instructorName**: Added to course responses via Prisma relations
- **read field**: Prisma uses `isRead`, transformed to `read` for frontend

## Database Schema

The Prisma schema (`prisma/schema.prisma`) includes:
- **User** model with Role enum (student | instructor)
- **Course** model with instructor relation
- **Enrollment** model with status enum (pending | approved | rejected)
- **Notification** model with isRead boolean

## Notification Subscription Mechanism

Since there's no separate subscription table, subscriptions are tracked via:
1. Special notification records with message prefix "SUBSCRIPTION:"
2. These are filtered out from regular notifications
3. When seats become available, notifications are sent to:
   - Students with subscription notifications
   - Students with pending enrollments

## Environment Setup

Make sure you have a `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rems_db"
```

## Running the System

1. **Set up database**:
   ```bash
   npx prisma migrate deploy
   # or for development:
   npx prisma migrate dev
   ```

2. **Generate Prisma Client** (if needed):
   ```bash
   npx prisma generate
   ```

3. **Start the server**:
   ```bash
   npm run server
   # or
   npm run dev
   ```

## Testing

- Health check: `GET /api/health` - verifies database connection
- All API endpoints maintain the same contract as before
- Frontend requires no changes

## Notes

- `mockDb.js` can be removed, but kept for reference
- All async operations properly handled
- Prisma connection properly closed on shutdown
- Error handling includes Prisma-specific error codes
