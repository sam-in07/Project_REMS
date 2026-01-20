# 🚀 Quick Start Guide

## ✅ Your project is COMPLETE! Here's how to run it:

### Step 1: Create `.env` file

Create a `.env` file in the root directory with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/rems_db?schema=public"
PORT=5000
```

**Replace:**
- `username` - your PostgreSQL username
- `password` - your PostgreSQL password  
- `localhost:5432` - your PostgreSQL host and port (if different)
- `rems_db` - your database name

### Step 2: Install Dependencies

```bash
npm run install-all
```

### Step 3: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate deploy
```

### Step 4: Start the Application

```bash
npm run dev
```

This starts:
- ✅ Backend server on http://localhost:5000
- ✅ Frontend React app on http://localhost:3000

### Step 5: Open in Browser

Go to: **http://localhost:3000**

---

## 🎯 First Time Setup Checklist

- [ ] PostgreSQL is installed and running
- [ ] Database `rems_db` is created
- [ ] `.env` file created with DATABASE_URL
- [ ] Dependencies installed (`npm run install-all`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Migrations run (`npx prisma migrate deploy`)
- [ ] Server started (`npm run dev`)

---

## 🧪 Test It Works

1. **Health Check**: Visit http://localhost:5000/api/health
   - Should show: `{"status":"ok","message":"Server is running","database":"connected"}`

2. **Create Account**: 
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Create a student or instructor account

3. **Login** and start using the system!

---

## ⚠️ Common Issues

**"Cannot find module '../generated/prisma'"**
→ Run: `npx prisma generate`

**"Database connection failed"**
→ Check `.env` file has correct DATABASE_URL
→ Verify PostgreSQL is running
→ Ensure database exists

**"Port 3000 already in use"**
→ Kill the process or change port in `client/package.json`

**"Port 5000 already in use"**
→ Change PORT in `.env` file

---

## 📚 Need More Help?

See `SETUP.md` for detailed setup instructions.
