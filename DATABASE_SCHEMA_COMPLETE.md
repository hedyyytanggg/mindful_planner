# Complete Database Schema & Field Mapping

## Overview

The Mindful Planner uses a PostgreSQL database with normalized tables for users, daily plans, and plan details. All tables use UUID-like string IDs (25-character hex strings) and camelCase column names.

---

## Table Schemas & Interfaces

### 1. Users Table

**Database Schema:**
```sql
CREATE TABLE users (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  name VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  theme VARCHAR(20) DEFAULT 'light',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**TypeScript Interface:**
```typescript
export interface User {
  id: string;              // Generated UUID (25 chars)
  email: string;           // Unique email address
  password: string | null; // Hashed password (SHA256)
  name: string | null;     // User's display name
  timezone: string;        // Timezone preference (default: UTC)
  createdAt: string;       // Timestamp of account creation
  updatedAt: string;       // Timestamp of last update
}
```

---

### 2. Daily Plans (Master Table)

**Database Schema:**
```sql
CREATE TABLE daily_plans (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  userId VARCHAR(25) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  planDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(userId, planDate),
  INDEX idx_daily_plans_userid (userId)
);
```

**TypeScript Interface:**
```typescript
export interface DailyPlan {
  id: string;              // Generated UUID (25 chars) - REQUIRED!
  userId: string;          // FK to users.id
  planDate: string;        // Date of the plan (YYYY-MM-DD)
  createdAt: string;       // Timestamp of creation
  updatedAt: string;       // Timestamp of last update
}
```

**Key Points:**
- `id` must be generated before INSERT (previously missing!)
- `userId` and `planDate` form a unique constraint (one plan per user per day)
- Foreign key relationship ensures cascade delete

---

### 3. Deep Work Zones

**Database Schema:**
```sql
CREATE TABLE deep_work_zones (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  timeEstimate INTEGER,           -- Minutes
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_deep_work_zones_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface DeepWorkZone {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id
  title: string;           // Task title
  timeEstimate?: number;   // Time in minutes
  notes?: string;          // Additional notes
  completed: boolean;      // Completion status
  completedAt?: string;    // When completed
  createdAt: string;
  updatedAt: string;
}
```

---

### 4. Quick Wins

**Database Schema:**
```sql
CREATE TABLE quick_wins (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_quick_wins_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface QuickWin {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id
  title: string;           // Win title
  completed: boolean;      // Completion status
  completedAt?: string;    // When completed
  createdAt: string;
  updatedAt: string;
}
```

---

### 5. Make It Happen

**Database Schema:**
```sql
CREATE TABLE make_it_happen (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_make_it_happen_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface MakeItHappen {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id
  task: string;            // Task description
  completed: boolean;      // Completion status
  completedAt?: string;    // When completed
  createdAt: string;
  updatedAt: string;
}
```

---

### 6. Recharge Zones

**Database Schema:**
```sql
CREATE TABLE recharge_zones (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  activityId VARCHAR(255),        -- Predefined activity ID
  customActivity VARCHAR(255),    -- Custom activity text
  completed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_recharge_zones_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface RechargeZone {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id
  activityId?: string;     // Reference to preset activity
  customActivity?: string; // User-defined activity
  completed: boolean;      // Completion status
  completedAt?: string;    // When completed
  createdAt: string;
  updatedAt: string;
}
```

---

### 7. Little Joys

**Database Schema:**
```sql
CREATE TABLE little_joys (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL REFERENCES daily_plans(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_little_joys_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface LittleJoy {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id
  content: string;         // Joy description
  createdAt: string;
}
```

---

### 8. Reflections Today

**Database Schema:**
```sql
CREATE TABLE reflections_today (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL UNIQUE REFERENCES daily_plans(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reflections_today_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface ReflectionToday {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id (UNIQUE - one per plan)
  content: string;         // Reflection text
  createdAt: string;
  updatedAt: string;
}
```

---

### 9. Focus Tomorrow

**Database Schema:**
```sql
CREATE TABLE focus_tomorrow (
  id VARCHAR(25) PRIMARY KEY NOT NULL,
  planId VARCHAR(25) NOT NULL UNIQUE REFERENCES daily_plans(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_focus_tomorrow_planid (planId)
);
```

**TypeScript Interface:**
```typescript
export interface FocusTomorrow {
  id: string;              // Generated UUID
  planId: string;          // FK to daily_plans.id (UNIQUE - one per plan)
  content: string;         // Focus description
  createdAt: string;
  updatedAt: string;
}
```

---

## Data Relationships

```
users (1) ──┐
            │
            ├──→ daily_plans (1) ──┬──→ deep_work_zones (many)
            │                      ├──→ quick_wins (many)
            │                      ├──→ make_it_happen (one)
            │                      ├──→ recharge_zones (many)
            │                      ├──→ little_joys (many)
            │                      ├──→ reflections_today (one - unique)
            │                      └──→ focus_tomorrow (one - unique)
            │
            └──→ sessions (many)
```

---

## ID Generation

All tables use 25-character hex string IDs generated using:

```typescript
function generateId(): string {
  return randomBytes(12).toString('hex').substring(0, 25);
}
```

**When to generate IDs:**
- ✅ `users` table - generateId() in createUser()
- ✅ `daily_plans` table - generateId() in getOrCreateDailyPlan()
- ✅ All detail tables - generateId() when creating records
- ❌ Never for auto-increment (we use string UUIDs)

---

## Database Operations

### Get or Create Daily Plan
```typescript
const plan = await getOrCreateDailyPlan(userId: string, planDate: string);
// Returns: DailyPlan with id, userId, planDate, createdAt, updatedAt
```

### Update Daily Plan
```typescript
const plan = await updateDailyPlan(userId: string, planDate: string, updates: Partial<DailyPlan>);
// Updates allowed fields and returns updated plan
```

### Get User Plans
```typescript
const plans = await getUserPlans(userId: string, limit?: number);
// Returns: DailyPlan[] ordered by date DESC
```

---

## Timestamps & Defaults

All tables use:
- `createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Set at creation
- `updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP` - Set at creation AND updated on any modification

When querying, always return these fields for client-side tracking.

---

## Foreign Key Relationships

All child tables have `ON DELETE CASCADE` on the `planId` foreign key. This means:
- Deleting a `daily_plan` automatically deletes all associated records
- Safe for data cleanup without orphaned records

---

## UI Field Mapping

From `app/planner/page.tsx`:

| UI Component | Database Table | Fields Used |
|---|---|---|
| DeepWorkZone | deep_work_zones | title, timeEstimate, notes, completed |
| QuickWins | quick_wins | title, completed |
| MakeItHappen | make_it_happen | task, completed |
| RechargeZone | recharge_zones | activityId, customActivity, completed |
| LittleJoys | little_joys | content |
| ReflectionToday | reflections_today | content |
| FocusTomorrow | focus_tomorrow | content |

---

## Error Prevention Checklist

- ✅ Daily plan `id` must be generated before INSERT
- ✅ All child record `id`s must be generated
- ✅ `userId` must be a valid user ID
- ✅ `planDate` must be a valid DATE format (YYYY-MM-DD)
- ✅ Foreign keys must reference existing parents
- ✅ Required fields must have values (NOT NULL constraints)
- ✅ Unique constraints respected (userId+planDate on daily_plans, planId on unique tables)

---

## Recent Fixes

1. **Added ID generation to getOrCreateDailyPlan()** - Was missing `id` in INSERT
2. **Updated type signatures** - Changed userId from number to string
3. **Verified all column names** - All use camelCase (userId, planDate, createdAt, etc.)
4. **Confirmed foreign key structure** - All properly cascade on delete
