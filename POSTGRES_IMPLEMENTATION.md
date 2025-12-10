# PostgreSQL Implementation Guide

## Overview

Your Mindful Daily Planner is now set up to use **PostgreSQL** with the `pg` library. This guide explains the database structure and how to use it in your application.

---

## 📁 Files Created

### Core Database Files
- **`src/lib/db.ts`** - Connection pool and query execution
- **`src/lib/dbHelpers.ts`** - Type-safe helper functions for common operations
- **`src/lib/schema.sql.ts`** - Database schema definition
- **`scripts/init-db.js`** - Database initialization script

### Example API Routes
- **`src/app/api/plans/[date]/route.ts`** - GET/PATCH daily plans

### Documentation
- **`POSTGRES_SETUP.md`** - Installation and setup guide

---

## 🚀 Getting Started

### Step 1: Set Up PostgreSQL Locally

Follow the guide in `POSTGRES_SETUP.md`:

```bash
# macOS with Homebrew
brew install postgresql@16
brew services start postgresql@16

# Create database and user
psql postgres
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
CREATE DATABASE mindful_dev OWNER mindful_user;
\q
```

### Step 2: Install Dependencies

```bash
npm install
```

Already done! The following were added:
- `pg` ^8.11.3 - PostgreSQL client
- `@types/pg` ^8.11.6 - TypeScript types

### Step 3: Initialize Database Schema

```bash
node scripts/init-db.js
```

This creates:
- ✅ `users` table
- ✅ `daily_plans` table
- ✅ `deep_work_zones` table
- ✅ `quick_wins` table
- ✅ `app_settings` table
- ✅ Indexes for performance

### Step 4: Start Your App

```bash
npm run dev
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Daily Plans Table
```sql
CREATE TABLE daily_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  deep_work JSONB DEFAULT '[]',           -- Array of deep work items
  quick_wins JSONB DEFAULT '[]',          -- Array of quick wins
  make_it_happen JSONB DEFAULT 'null',    -- Single task
  recharge_zone JSONB DEFAULT 'null',     -- Single activity
  little_joys JSONB DEFAULT '[]',         -- Array of joy items
  reflection TEXT,                         -- End-of-day reflection
  focus_tomorrow TEXT,                     -- Tomorrow's focus
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, plan_date)
);
```

### Deep Work Zones Table
```sql
CREATE TABLE deep_work_zones (
  id SERIAL PRIMARY KEY,
  daily_plan_id INTEGER NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  time_estimate INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### App Settings Table
```sql
CREATE TABLE app_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_digest_enabled BOOLEAN DEFAULT TRUE,
  daily_reminder_enabled BOOLEAN DEFAULT TRUE,
  daily_reminder_time TIME DEFAULT '09:00:00',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Using the Database

### Basic Query Function

The `src/lib/db.ts` provides the core query function:

```typescript
import { query } from '@/lib/db';

// Simple query
const { rows, rowCount } = await query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);

// With TypeScript types
const { rows } = await query<User>(
  'SELECT * FROM users WHERE id = $1',
  [1]
);
```

### Using Helper Functions

The `src/lib/dbHelpers.ts` provides ready-to-use functions:

#### User Operations

```typescript
import { 
  createUser, 
  getUserByEmail, 
  getUserById 
} from '@/lib/dbHelpers';

// Create a user
const user = await createUser(
  'john@example.com',
  'John Doe',
  'hashed_password_here'
);

// Get user
const user = await getUserByEmail('john@example.com');
const user = await getUserById(1);
```

#### Daily Plan Operations

```typescript
import { 
  getDailyPlan, 
  getOrCreateDailyPlan,
  updateDailyPlan,
  getUserPlans 
} from '@/lib/dbHelpers';

// Get or create plan for a date
const plan = await getOrCreateDailyPlan(userId, '2025-12-10');

// Update a plan
await updateDailyPlan(userId, '2025-12-10', {
  deep_work: [
    { title: 'Finish proposal', timeEstimate: 120, completed: false }
  ],
  reflection: 'Great day!',
  focus_tomorrow: 'Review feedback'
});

// Get all user's plans (last 30 days)
const plans = await getUserPlans(userId);
```

#### App Settings Operations

```typescript
import { 
  getAppSettings,
  createAppSettings,
  updateAppSettings 
} from '@/lib/dbHelpers';

// Get settings
const settings = await getAppSettings(userId);

// Create settings (auto on user signup)
const settings = await createAppSettings(userId);

// Update settings
await updateAppSettings(userId, {
  theme: 'dark',
  notifications_enabled: false
});
```

---

## 🔄 Transactions

For operations that require multiple queries to succeed or fail together:

```typescript
import { transaction } from '@/lib/db';

await transaction(async (client) => {
  // All queries here are part of one transaction
  // If any fails, all changes are rolled back
  
  await client.query('INSERT INTO users ...', [...]);
  await client.query('INSERT INTO app_settings ...', [...]);
});
```

---

## 📡 API Routes Example

### Get/Update Daily Plan

File: `src/app/api/plans/[date]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyPlan, updateDailyPlan } from '@/lib/dbHelpers';

// GET /api/plans/2025-12-10?userId=1
export async function GET(request: NextRequest, context: any) {
  const { date } = await context.params;
  const userId = request.nextUrl.searchParams.get('userId');

  const plan = await getOrCreateDailyPlan(parseInt(userId!), date);
  return NextResponse.json(plan);
}

// PATCH /api/plans/2025-12-10?userId=1
export async function PATCH(request: NextRequest, context: any) {
  const { date } = await context.params;
  const userId = request.nextUrl.searchParams.get('userId');
  const updates = await request.json();

  const plan = await updateDailyPlan(parseInt(userId!), date, updates);
  return NextResponse.json(plan);
}
```

---

## 🔐 Authentication Integration

### With NextAuth.js

To use PostgreSQL with NextAuth.js for storing sessions and accounts:

```typescript
// src/app/api/auth/[...nextauth]/route.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from '@/lib/dbHelpers';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials: any) {
        const user = await getUserByEmail(credentials.email);
        if (!user) return null;
        
        // Verify password with bcrypt
        // return user if valid
        return user;
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};
```

---

## 📝 Common Patterns

### Migrating from localStorage

**Before (localStorage):**
```typescript
const savePlan = (date: string, plan: DailyPlan) => {
  localStorage.setItem(`plan_${date}`, JSON.stringify(plan));
};
```

**After (PostgreSQL):**
```typescript
const savePlan = async (userId: number, date: string, plan: DailyPlan) => {
  await updateDailyPlan(userId, date, plan);
};
```

### Batch Updates

```typescript
// Update multiple fields at once
await updateDailyPlan(userId, date, {
  deep_work: [...],
  quick_wins: [...],
  reflection: 'Today was productive'
});
```

### Pagination

```typescript
// Get plans with limit and offset
const { rows } = await query(
  'SELECT * FROM daily_plans WHERE user_id = $1 ORDER BY plan_date DESC LIMIT $2 OFFSET $3',
  [userId, 10, offset]
);
```

---

## 🧪 Testing Queries

### Using psql CLI

```bash
# Connect to your database
psql -U mindful_user -d mindful_dev -h localhost

# View tables
\dt

# Query data
SELECT * FROM users;
SELECT * FROM daily_plans WHERE plan_date = '2025-12-10';

# View table structure
\d daily_plans

# Count rows
SELECT COUNT(*) FROM users;
```

### From Node.js

```typescript
import { query } from '@/lib/db';

// Test connection
const { rows } = await query('SELECT NOW()');
console.log('Database connected:', rows);
```

---

## ⚡ Performance Tips

### 1. Use Indexes

Indexes are already created on:
- `users(email)` - for fast lookups
- `daily_plans(user_id, plan_date)` - for user's plans
- `daily_plans(plan_date)` - for date-based queries

### 2. Connection Pooling

`src/lib/db.ts` uses a connection pool automatically. No need to manually manage connections.

### 3. JSONB Queries

PostgreSQL's JSONB type allows querying nested data:

```typescript
// Get all tasks in deep_work array
const { rows } = await query(
  `SELECT jsonb_array_elements(deep_work) as task 
   FROM daily_plans 
   WHERE user_id = $1`,
  [userId]
);
```

### 4. Batch Inserts

For multiple rows:

```typescript
const { rows } = await query(
  `INSERT INTO quick_wins (daily_plan_id, title) VALUES 
   ($1, $2), ($3, $4), ($5, $6)
   RETURNING *`,
  [planId1, 'Task 1', planId1, 'Task 2', planId1, 'Task 3']
);
```

---

## 🔍 Debugging

### Enable Query Logging

Already enabled in `src/lib/db.ts`:

```typescript
console.log('Executed query', { text, duration, rows });
```

### Check for Connection Issues

```bash
# Test connection
psql -U mindful_user -d mindful_dev -h localhost -c "SELECT 1;"

# Check if PostgreSQL is running
pg_isready -U mindful_user -h localhost
```

---

## 📚 Next Steps

1. **Implement Sign-Up**: Create API endpoint using `createUser()`
2. **Implement Login**: Verify password with bcrypt and return JWT or session
3. **Sync Frontend**: Update React components to call API endpoints
4. **Add Validations**: Use Zod to validate all inputs
5. **Add Error Handling**: Proper error messages for different scenarios
6. **Set Up Backups**: Regular PostgreSQL backups for production

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "ECONNREFUSED" | PostgreSQL not running: `brew services start postgresql@16` |
| "FATAL: role does not exist" | User not created. Run steps in POSTGRES_SETUP.md |
| "Connection timeout" | Check DATABASE_URL in .env.local |
| "permission denied" | Check user permissions: `ALTER USER mindful_user CREATEDB;` |

---

## 📖 Resources

- [Node.js pg Documentation](https://node-postgres.com/)
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Connection Pooling Best Practices](https://node-postgres.com/features/pooling)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
