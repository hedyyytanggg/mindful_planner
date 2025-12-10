# PostgreSQL Setup Guide

## Quick Start

### 1. Install PostgreSQL (if not already installed)

**macOS (with Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

---

### 2. Create a Local Database & User

```bash
# Connect to PostgreSQL (macOS/Linux)
psql postgres

# Then in psql, run these commands:
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
CREATE DATABASE mindful_dev OWNER mindful_user;
ALTER USER mindful_user CREATEDB;
\q
```

**Or on Windows using pgAdmin:**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `mindful_dev`
4. Owner: Create new user `mindful_user` with password `mindful_dev_password`

---

### 3. Verify Connection

```bash
psql -U mindful_user -d mindful_dev -h localhost
# Should connect successfully
\q
```

---

### 4. Install Dependencies

```bash
npm install
```

---

### 5. Initialize the Database Schema

```bash
node scripts/init-db.js
```

You should see:
```
📦 Initializing database...
✅ Database schema created successfully!
```

---

### 6. Verify Tables Were Created

```bash
psql -U mindful_user -d mindful_dev -h localhost

# In psql:
\dt                    # List all tables
SELECT * FROM users;   # Should be empty
\q
```

---

## Environment Variables

The `.env.local` file is already configured with:

```env
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-very-secret-key-change-in-production"
NODE_ENV="development"
```

### For Production (change before deploying):
- Change `NEXTAUTH_SECRET` to a random string: `openssl rand -base64 32`
- Update `DATABASE_URL` to your production database
- Set `NODE_ENV="production"`

---

## Database Utilities

The setup includes helper functions in `src/lib/dbHelpers.ts`:

### User Operations
```typescript
import { createUser, getUserByEmail, getUserById } from '@/lib/dbHelpers';

// Create a user
const user = await createUser('user@example.com', 'John Doe', 'hashed_password');

// Get user
const user = await getUserByEmail('user@example.com');
```

### Daily Plans
```typescript
import { getDailyPlan, updateDailyPlan, getOrCreateDailyPlan } from '@/lib/dbHelpers';

// Get or create a plan for today
const plan = await getOrCreateDailyPlan(userId, '2025-12-10');

// Update a plan
await updateDailyPlan(userId, '2025-12-10', {
  deep_work: [...],
  reflection: 'Great day!'
});
```

### App Settings
```typescript
import { getAppSettings, updateAppSettings } from '@/lib/dbHelpers';

// Get user settings
const settings = await getAppSettings(userId);

// Update settings
await updateAppSettings(userId, {
  theme: 'dark',
  notifications_enabled: false
});
```

---

## Useful SQL Commands

```sql
-- See all tables
\dt

-- View table structure
\d daily_plans

-- Count rows
SELECT COUNT(*) FROM users;

-- Delete all data (be careful!)
DELETE FROM users CASCADE;

-- Export data
pg_dump mindful_dev > backup.sql

-- Import data
psql mindful_dev < backup.sql
```

---

## Troubleshooting

### "Could not connect to server"
- Make sure PostgreSQL is running: `brew services list` (macOS)
- Check credentials in DATABASE_URL

### "Relation 'users' does not exist"
- Run the initialization script: `node scripts/init-db.js`

### Connection pool warnings
- Check `DATABASE_URL` format: `postgresql://user:password@host:port/database`

---

## Next Steps

1. ✅ Database is ready!
2. 🔗 Update NextAuth.js to use PostgreSQL for sessions
3. 📝 Create API endpoints to use the database helpers
4. 🔐 Implement password hashing with bcrypt
5. 🧪 Add tests for database operations

---

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
- [Connection Pooling Best Practices](https://node-postgres.com/features/pooling)
