# PostgreSQL Quick Reference

Fast lookup for commands, functions, and common queries.

---

## Installation

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Verify
pg_isready -U mindful_user -h localhost
```

---

## Connection String

```
postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev
```

---

## Command Line (psql)

```bash
# Connect
psql -U mindful_user -d mindful_dev -h localhost

# Inside psql:
\dt              # List tables
\d TABLE_NAME    # Describe table
\l               # List databases
\du              # List users
SELECT * FROM users;
\q               # Quit
```

---

## Database Helper Functions

### Import
```typescript
import {
  createUser,
  getUserByEmail,
  getUserById,
  getDailyPlan,
  getOrCreateDailyPlan,
  updateDailyPlan,
  getUserPlans,
  createAppSettings,
  getAppSettings,
  updateAppSettings,
} from '@/lib/dbHelpers';
```

### Users
```typescript
// Create
const user = await createUser(email, name, passwordHash, timezone);

// Get
const user = await getUserByEmail('john@example.com');
const user = await getUserById(1);
```

### Daily Plans
```typescript
// Get or create
const plan = await getOrCreateDailyPlan(userId, '2025-12-10');

// Get specific
const plan = await getDailyPlan(userId, '2025-12-10');

// Update
await updateDailyPlan(userId, '2025-12-10', { reflection: 'Good day!' });

// Get all
const plans = await getUserPlans(userId, 30); // Last 30
```

### Settings
```typescript
// Get
const settings = await getAppSettings(userId);

// Create
const settings = await createAppSettings(userId);

// Update
await updateAppSettings(userId, { theme: 'dark' });
```

### Raw Queries
```typescript
import { query } from '@/lib/db';

const { rows, rowCount } = await query<User>(
  'SELECT * FROM users WHERE id = $1',
  [1]
);
```

---

## Database Schema

### users
```sql
id SERIAL PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
name VARCHAR(255)
password_hash VARCHAR(255)
timezone VARCHAR(50) DEFAULT 'UTC'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### daily_plans
```sql
id SERIAL PRIMARY KEY
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
plan_date DATE NOT NULL
deep_work JSONB DEFAULT '[]'
quick_wins JSONB DEFAULT '[]'
make_it_happen JSONB DEFAULT 'null'
recharge_zone JSONB DEFAULT 'null'
little_joys JSONB DEFAULT '[]'
reflection TEXT
focus_tomorrow TEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
UNIQUE(user_id, plan_date)
```

### quick_wins
```sql
id SERIAL PRIMARY KEY
daily_plan_id INTEGER NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE
title VARCHAR(255) NOT NULL
completed BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### app_settings
```sql
id SERIAL PRIMARY KEY
user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
theme VARCHAR(50) DEFAULT 'light'
notifications_enabled BOOLEAN DEFAULT TRUE
email_digest_enabled BOOLEAN DEFAULT TRUE
daily_reminder_enabled BOOLEAN DEFAULT TRUE
daily_reminder_time TIME DEFAULT '09:00:00'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## Common SQL Queries

### Users
```sql
-- All users
SELECT * FROM users;

-- Find by email
SELECT * FROM users WHERE email = 'john@example.com';

-- Count users
SELECT COUNT(*) FROM users;

-- Active users
SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days';
```

### Daily Plans
```sql
-- User's plans
SELECT * FROM daily_plans WHERE user_id = 1;

-- Specific date
SELECT * FROM daily_plans WHERE user_id = 1 AND plan_date = '2025-12-10';

-- Recent plans
SELECT * FROM daily_plans 
  WHERE user_id = 1 
  ORDER BY plan_date DESC 
  LIMIT 7;

-- Plans by date range
SELECT * FROM daily_plans 
  WHERE user_id = 1 
  AND plan_date BETWEEN '2025-12-01' AND '2025-12-31';
```

### Quick Wins
```sql
-- Get completed tasks
SELECT * FROM quick_wins WHERE completed = true;

-- Get incomplete tasks
SELECT * FROM quick_wins WHERE completed = false;

-- Count by plan
SELECT daily_plan_id, COUNT(*) FROM quick_wins GROUP BY daily_plan_id;
```

---

## API Routes Template

### GET - Fetch Data
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getDailyPlan } from '@/lib/dbHelpers';

export async function GET(request: NextRequest, context: any) {
  const { date } = await context.params;
  const userId = request.nextUrl.searchParams.get('userId');

  const plan = await getDailyPlan(parseInt(userId!), date);
  return NextResponse.json(plan);
}
```

### PATCH - Update Data
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { updateDailyPlan } from '@/lib/dbHelpers';

export async function PATCH(request: NextRequest, context: any) {
  const { date } = await context.params;
  const userId = request.nextUrl.searchParams.get('userId');
  const updates = await request.json();

  const plan = await updateDailyPlan(parseInt(userId!), date, updates);
  return NextResponse.json(plan);
}
```

### POST - Create Data
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/dbHelpers';

export async function POST(request: NextRequest) {
  const { email, name, passwordHash } = await request.json();

  const user = await createUser(email, name, passwordHash);
  return NextResponse.json(user, { status: 201 });
}
```

---

## GUI Tools

| Tool | Command | URL |
|------|---------|-----|
| **pgAdmin** | `brew install pgadmin4 && brew services start pgadmin4` | http://localhost:5050 |
| **DBeaver** | Download from dbeaver.io | - |
| **VS Code** | Install "PostgreSQL" extension | Built-in |

---

## Environment Variables

```env
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NODE_ENV="development"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "could not connect" | `brew services start postgresql@16` |
| "role does not exist" | Create user in POSTGRES_SETUP.md |
| "database does not exist" | `node scripts/init-db.js` |
| "password failed" | Check DATABASE_URL in .env.local |
| "Connection refused" | PostgreSQL not running on port 5432 |

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Connection pool & query function |
| `src/lib/dbHelpers.ts` | Helper functions (254 lines) |
| `scripts/init-db.js` | Database initialization |
| `src/app/api/plans/[date]/route.ts` | Example API routes |

---

## Useful Commands

```bash
# Start PostgreSQL
brew services start postgresql@16

# Stop PostgreSQL
brew services stop postgresql@16

# Check status
brew services list | grep postgresql

# Backup
pg_dump mindful_dev > backup.sql

# Restore
psql mindful_dev < backup.sql

# Initialize database
node scripts/init-db.js

# Build app
npm run build

# Start app
npm run dev
```

---

## Next Steps

1. **Setup?** → Read `01-SETUP-GUIDE.md`
2. **Connect?** → Read `02-CONNECTING.md`
3. **GUI Tool?** → Read `03-DATABASE-INTERFACES.md`
4. **Code?** → Read `04-IMPLEMENTATION-GUIDE.md`

---

## Documentation Files

```
docs/postgres/
├── 00-GETTING-STARTED.md
├── 01-SETUP-GUIDE.md
├── 02-CONNECTING.md
├── 03-DATABASE-INTERFACES.md
├── 04-IMPLEMENTATION-GUIDE.md
└── 05-QUICK-REFERENCE.md (this file)
```
