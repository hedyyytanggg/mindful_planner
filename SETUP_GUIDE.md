# 🚀 Setup & Installation Guide

## Prerequisites

### System Requirements
- Node.js 18 or higher (test with `node --version`)
- npm 9+ or yarn 4+ (test with `npm --version`)
- PostgreSQL 16+ installed and running
- Git (for version control)

### Required Services
- PostgreSQL database (local or cloud)
- NextAuth secret for session management
- (Optional) GitHub account for Vercel deployment

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mindful.git
cd mindful
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`:
- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- NextAuth.js
- PostgreSQL client (pg)

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindful

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-one

# Optional: Database debugging
DEBUG=false
```

#### Generating NEXTAUTH_SECRET
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL (macOS with Homebrew)

```bash
# Install PostgreSQL if not already installed
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Create a new database
createdb mindful

# Test connection
psql -d mindful -c "SELECT version();"
```

#### Option B: Using Docker

```bash
# Pull PostgreSQL image
docker pull postgres:16

# Run container
docker run --name mindful-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mindful \
  -p 5432:5432 \
  -d postgres:16

# Test connection
psql postgresql://postgres:password@localhost:5432/mindful
```

#### Option C: Cloud Database

Use Neon, Railway, or Supabase:
1. Create a new PostgreSQL project
2. Get the connection string
3. Add to `.env.local` as `DATABASE_URL`

### 5. Initialize Database Schema

The application uses raw PostgreSQL queries. Initialize the schema:

```bash
# Run the initialization SQL
psql -d mindful -f prisma/init.sql

# Or manually create tables (see DATABASE_SCHEMA_COMPLETE.md)
```

### 6. Start Development Server

```bash
npm run dev
```

The server starts at `http://localhost:3000`

### 7. Verify Installation

- Open http://localhost:3000
- You should see the landing page
- Click "Sign Up" to create an account
- Click "Login" to access the planner

---

## Configuration Guide

### Environment Variables Explained

```env
# PostgreSQL Connection
# Format: postgresql://[user][:password]@[host][:port]/[database]
DATABASE_URL=postgresql://user:password@localhost:5432/mindful

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000        # App URL for production: https://yourdomain.com
NEXTAUTH_SECRET=long-random-string        # Session encryption key

# Optional: Development Settings
NODE_ENV=development                      # development or production
DEBUG=false                               # Enable detailed logging
```

### Database Connection Pooling

Connection pooling is configured in `src/lib/db.ts`:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle after 30s
  connectionTimeoutMillis: 2000,
});
```

---

## Project Structure After Setup

```
mindful/
├── .env.local                 # Your local environment (NOT in git)
├── .next/                     # Build output
├── node_modules/              # Dependencies
├── app/                       # Next.js app
│   ├── api/auth/              # Authentication routes
│   ├── api/plans/             # Plans API
│   ├── planner/               # Main app
│   ├── login/                 # Login page
│   └── signup/                # Signup page
├── src/
│   ├── components/            # React components
│   └── lib/                   # Database & utilities
├── prisma/                    # Database (migrations/schema)
├── public/                    # Static files
└── package.json               # Dependencies list
```

---

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript type checking
npx tsc --noEmit

# Format code with Prettier (if configured)
npm run format

# Lint code with ESLint (if configured)
npm run lint
```

---

## Database Management

### Connect to Database Directly

```bash
# Using psql
psql -d mindful

# Using a specific connection string
psql postgresql://user:password@localhost:5432/mindful
```

### Common Database Queries

```sql
-- View all tables
\dt

-- View users table
SELECT * FROM users;

-- View daily plans
SELECT * FROM daily_plans WHERE "userId" = 'user-id';

-- Check table structure
\d daily_plans

-- View all data for debugging
SELECT * FROM deep_work_zones LIMIT 10;
```

### Reset Database (Development Only)

```bash
# Drop all tables
psql -d mindful -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-initialize schema
psql -d mindful -f prisma/init.sql
```

---

## Troubleshooting

### Issue: `DATABASE_URL not found`
**Solution:** Check `.env.local` exists and has `DATABASE_URL` set

### Issue: `ECONNREFUSED` - Database connection failed
**Solutions:**
- PostgreSQL service not running: `brew services start postgresql@16`
- Wrong database URL
- Database doesn't exist: `createdb mindful`

### Issue: Port 3000 already in use
**Solutions:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: Next.js build error with TypeScript
**Solution:** Run type check: `npx tsc --noEmit`

### Issue: Changes not appearing in browser
**Solution:** 
- Clear `.next` folder: `rm -rf .next`
- Restart dev server
- Hard refresh browser (Cmd+Shift+R on Mac)

---

## Testing Your Setup

### 1. Sign Up New Account
```
Email: test@example.com
Password: TestPassword123
Name: Test User
```

### 2. Create a Plan
- Navigate to `/planner`
- Add Deep Work Zone
- Add Quick Win
- Add Reflection
- Click "Save" buttons
- Check browser console for "✅ Plan saved"

### 3. Verify Database
```bash
psql -d mindful -c "SELECT * FROM users WHERE email = 'test@example.com';"
psql -d mindful -c "SELECT * FROM daily_plans WHERE \"userId\" = '...';"
```

### 4. Page Refresh
- Refresh the planner page
- Data should persist from database
- Check that previous entries are displayed

---

## Next Steps

1. **Configure Production Domain**
   - Update `NEXTAUTH_URL` in environment
   - Update allowed callback URLs

2. **Set Up Monitoring**
   - Add error tracking (Sentry, Rollbar)
   - Monitor database performance

3. **Deploy to Production**
   - See [deployment documentation](DEPLOYMENT.md)
   - Use Vercel + Neon for serverless setup

4. **Optimize Performance**
   - Add caching strategies
   - Optimize database queries
   - Enable compression

---

## Additional Resources

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API reference
- **[DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md)** - Database schema
- **[Next.js Docs](https://nextjs.org/docs)** - Framework documentation
- **[PostgreSQL Docs](https://www.postgresql.org/docs/)** - Database documentation

---

**Last Updated:** December 12, 2025
