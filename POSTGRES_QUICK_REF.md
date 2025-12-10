# PostgreSQL Quick Reference

## Installation

```bash
# 1. Install dependencies (already done)
npm install

# 2. Verify PostgreSQL is running
pg_isready -U mindful_user -h localhost

# 3. Initialize database
node scripts/init-db.js

# 4. Start your app
npm run dev
```

---

## Essential Commands

### Connect to Database
```bash
psql -U mindful_user -d mindful_dev -h localhost
```

### View All Tables
```bash
\dt
```

### View Table Structure
```bash
\d daily_plans
```

### Quit psql
```bash
\q
```

---

## Common Queries

### Users
```sql
-- Get all users
SELECT * FROM users;

-- Get user by email
SELECT * FROM users WHERE email = 'john@example.com';

-- Count users
SELECT COUNT(*) FROM users;
```

### Daily Plans
```sql
-- Get plans for a user
SELECT * FROM daily_plans WHERE user_id = 1;

-- Get specific date plan
SELECT * FROM daily_plans WHERE user_id = 1 AND plan_date = '2025-12-10';

-- Get recent plans
SELECT * FROM daily_plans WHERE user_id = 1 ORDER BY plan_date DESC LIMIT 7;
```

### Quick Cleanup
```sql
-- Delete all data (⚠️ careful!)
DELETE FROM app_settings CASCADE;
DELETE FROM deep_work_zones CASCADE;
DELETE FROM quick_wins CASCADE;
DELETE FROM daily_plans CASCADE;
DELETE FROM users CASCADE;

-- Or use this in your app:
node scripts/init-db.js  # Recreates schema
```

---

## Database Functions in Your Code

### Import and Use
```typescript
import {
  // Users
  createUser,
  getUserByEmail,
  getUserById,
  
  // Daily Plans
  getDailyPlan,
  getOrCreateDailyPlan,
  updateDailyPlan,
  getUserPlans,
  
  // Deep Work
  createDeepWorkZone,
  
  // App Settings
  getAppSettings,
  createAppSettings,
  updateAppSettings,
} from '@/lib/dbHelpers';

// Example
const user = await getUserByEmail('john@example.com');
const plan = await getOrCreateDailyPlan(user.id, '2025-12-10');
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Connection pool & query function |
| `src/lib/dbHelpers.ts` | Helper functions for common operations |
| `src/lib/schema.sql.ts` | Schema definition |
| `scripts/init-db.js` | Initialization script |
| `.env.local` | DATABASE_URL configuration |

---

## Environment Variables

```env
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="development"
```

---

## Files Added to Your Project

```
/Users/hedytang/ai/mindful/
├── src/lib/
│   ├── db.ts                    (New) Connection pooling
│   ├── dbHelpers.ts             (New) Helper functions
│   └── schema.sql.ts            (New) Schema definition
│
├── src/app/api/
│   └── plans/[date]/route.ts   (New) Example API route
│
├── scripts/
│   └── init-db.js               (New) Initialization
│
├── POSTGRES_SETUP.md             (New) Setup guide
├── POSTGRES_IMPLEMENTATION.md    (New) Implementation guide
└── POSTGRES_QUICK_REF.md         (This file)
```

---

## Next Steps

1. ✅ PostgreSQL installed and running
2. ✅ Dependencies installed
3. ✅ Database schema created
4. 📝 Create sign-up endpoint
5. 📝 Create login endpoint
6. 📝 Connect frontend to API
7. 📝 Add password hashing with bcrypt
8. 📝 Set up NextAuth.js with database

---

## Troubleshooting

**Error: "Could not connect to server"**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if not running
brew services start postgresql@16
```

**Error: "FATAL: role does not exist"**
```bash
# Follow setup in POSTGRES_SETUP.md
psql postgres
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
```

**Error: "database does not exist"**
```bash
node scripts/init-db.js
```

---

## Database Backups

```bash
# Backup database
pg_dump mindful_dev > backup.sql

# Restore from backup
psql mindful_dev < backup.sql
```

---

## Production Checklist

- [ ] Update DATABASE_URL to production database
- [ ] Update NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Set NODE_ENV="production"
- [ ] Enable SSL in connection: `ssl: true`
- [ ] Set up automated backups
- [ ] Monitor connection pool size
- [ ] Add query timeouts
- [ ] Set up error logging/monitoring
