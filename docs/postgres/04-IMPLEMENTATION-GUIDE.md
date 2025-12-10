# PostgreSQL Implementation Guide

Learn how to use PostgreSQL in your Next.js application code.

---

## Overview

Your project has three layers for database operations:

1. **`src/lib/db.ts`** - Low-level: Direct SQL queries
2. **`src/lib/dbHelpers.ts`** - Mid-level: Pre-built helper functions
3. **Your API routes** - High-level: HTTP endpoints

---

## Layer 1: Direct SQL Queries

### Basic Query

```typescript
import { query } from '@/lib/db';

// Simple query
const { rows, rowCount } = await query(
  'SELECT * FROM users WHERE email = $1',
  ['user@example.com']
);

console.log(`Found ${rowCount} users`);
console.log(rows);
```

### Type-Safe Queries

```typescript
// Define your types
interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

// Use them in queries
const { rows } = await query<User>(
  'SELECT * FROM users WHERE id = $1',
  [1]
);

// rows is typed as User[]
console.log(rows[0].email);
```

### Parameterized Queries (Safe from SQL Injection)

```typescript
// ✅ SAFE - Use $1, $2, etc. for parameters
const { rows } = await query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  ['user@example.com', true]
);

// ❌ UNSAFE - Never concatenate user input
const { rows } = await query(
  `SELECT * FROM users WHERE email = '${userEmail}'` // BAD!
);
```

---

## Layer 2: Helper Functions

Pre-built functions for common operations.

### User Operations

#### Create User
```typescript
import { createUser } from '@/lib/dbHelpers';

const user = await createUser(
  'john@example.com',
  'John Doe',
  'hashed_password_from_bcrypt'
);

console.log(user.id);
```

#### Get User by Email
```typescript
import { getUserByEmail } from '@/lib/dbHelpers';

const user = await getUserByEmail('john@example.com');

if (user) {
  console.log(`User: ${user.name}`);
} else {
  console.log('User not found');
}
```

#### Get User by ID
```typescript
import { getUserById } from '@/lib/dbHelpers';

const user = await getUserById(123);
```

---

### Daily Plan Operations

#### Get or Create Plan
```typescript
import { getOrCreateDailyPlan } from '@/lib/dbHelpers';

const plan = await getOrCreateDailyPlan(userId, '2025-12-10');

// Returns existing plan if found, creates new one if not
console.log(plan.id, plan.plan_date);
```

#### Get Specific Plan
```typescript
import { getDailyPlan } from '@/lib/dbHelpers';

const plan = await getDailyPlan(userId, '2025-12-10');

if (plan) {
  console.log(plan.deep_work);
} else {
  console.log('Plan not found');
}
```

#### Update Plan
```typescript
import { updateDailyPlan } from '@/lib/dbHelpers';

const updatedPlan = await updateDailyPlan(
  userId,
  '2025-12-10',
  {
    deep_work: [
      {
        title: 'Finish proposal',
        timeEstimate: 120,
        completed: false
      }
    ],
    reflection: 'Great day!',
    focus_tomorrow: 'Get feedback'
  }
);
```

#### Get User's Plans
```typescript
import { getUserPlans } from '@/lib/dbHelpers';

// Get last 30 days of plans
const plans = await getUserPlans(userId, 30);

plans.forEach(plan => {
  console.log(`${plan.plan_date}: ${plan.reflection}`);
});
```

---

### App Settings Operations

#### Get Settings
```typescript
import { getAppSettings } from '@/lib/dbHelpers';

const settings = await getAppSettings(userId);

if (settings) {
  console.log(`Theme: ${settings.theme}`);
  console.log(`Notifications: ${settings.notifications_enabled}`);
}
```

#### Create Settings
```typescript
import { createAppSettings } from '@/lib/dbHelpers';

// Usually done when user signs up
const settings = await createAppSettings(userId);
```

#### Update Settings
```typescript
import { updateAppSettings } from '@/lib/dbHelpers';

const updated = await updateAppSettings(userId, {
  theme: 'dark',
  notifications_enabled: false,
  daily_reminder_time: '07:00:00'
});
```

---

## Layer 3: API Routes

Create HTTP endpoints that use your database.

### Example 1: Get Daily Plan

**File:** `src/app/api/plans/[date]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyPlan } from '@/lib/dbHelpers';

// GET /api/plans/2025-12-10?userId=123
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await context.params;
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const plan = await getOrCreateDailyPlan(parseInt(userId), date);
    return NextResponse.json(plan);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}
```

### Example 2: Update Daily Plan

**Add to the same file:**

```typescript
// PATCH /api/plans/2025-12-10?userId=123
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await context.params;
    const userId = request.nextUrl.searchParams.get('userId');
    const updates = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const plan = await updateDailyPlan(parseInt(userId), date, updates);
    return NextResponse.json(plan);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to update plan' },
      { status: 500 }
    );
  }
}
```

### Example 3: Create User (Sign Up)

**File:** `src/app/api/auth/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser, getUserByEmail } from '@/lib/dbHelpers';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password } = signupSchema.parse(body);

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser(email, name, passwordHash);

    // Return user (without password)
    const { password_hash, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', issues: error.issues },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

## Using Transactions

For operations that require multiple queries to succeed together:

```typescript
import { transaction } from '@/lib/db';

// Both queries succeed or both fail
await transaction(async (client) => {
  // Create user
  await client.query(
    'INSERT INTO users (email, name) VALUES ($1, $2)',
    ['john@example.com', 'John Doe']
  );

  // Create settings for that user
  await client.query(
    'INSERT INTO app_settings (user_id) VALUES ($1)',
    [newUserId]
  );

  // If either fails, both are rolled back
});
```

---

## Frontend Integration

### Using Fetch API

```typescript
// In a React component

// Get plan
const response = await fetch(`/api/plans/2025-12-10?userId=${userId}`);
const plan = await response.json();

// Update plan
const response = await fetch(`/api/plans/2025-12-10?userId=${userId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    deep_work: [...],
    reflection: 'Today was great!'
  })
});
const updatedPlan = await response.json();
```

### Creating a Custom Hook

```typescript
// hooks/useDailyPlan.ts

import { useState, useEffect } from 'react';

export function useDailyPlan(userId: number, date: string) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/plans/${date}?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPlan(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId, date]);

  const updatePlan = async (updates: any) => {
    const response = await fetch(`/api/plans/${date}?userId=${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
    const newPlan = await response.json();
    setPlan(newPlan);
    return newPlan;
  };

  return { plan, loading, error, updatePlan };
}
```

---

## Error Handling

### Try-Catch Pattern

```typescript
try {
  const user = await getUserByEmail('test@example.com');
  // Process user
} catch (error) {
  if (error instanceof Error) {
    console.error(`Database error: ${error.message}`);
  }
  // Return error response
  return NextResponse.json(
    { error: 'Database operation failed' },
    { status: 500 }
  );
}
```

### Validation Pattern

```typescript
import { z } from 'zod';

const updateSchema = z.object({
  reflection: z.string().optional(),
  focus_tomorrow: z.string().optional(),
  deep_work: z.array(z.any()).optional(),
});

try {
  const validated = updateSchema.parse(requestBody);
  // Safe to use now
} catch (error) {
  return NextResponse.json(
    { error: 'Invalid request data' },
    { status: 400 }
  );
}
```

---

## Connection Pool Management

The connection pool in `src/lib/db.ts` is automatically managed:

```typescript
// Queries automatically use the pool
// No need to manually acquire/release connections

// But if you need direct access:
import { getClient, closePool } from '@/lib/db';

// Get a client from the pool
const client = await getClient();
try {
  // Use client
} finally {
  client.release(); // Return to pool
}

// On app shutdown (optional)
process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});
```

---

## Performance Tips

### 1. Use Indexes
Already created for you on:
- `users(email)`
- `daily_plans(user_id, plan_date)`
- `daily_plans(plan_date)`

### 2. Batch Operations
```typescript
// Instead of multiple inserts
const values = [
  [planId1, 'Task 1'],
  [planId1, 'Task 2'],
  [planId1, 'Task 3']
];

const { rows } = await query(
  `INSERT INTO quick_wins (daily_plan_id, title) VALUES
   ($1, $2), ($3, $4), ($5, $6)
   RETURNING *`,
  values.flat()
);
```

### 3. Limit Results
```typescript
// Get only recent plans
const { rows } = await query(
  'SELECT * FROM daily_plans WHERE user_id = $1 ORDER BY plan_date DESC LIMIT 30',
  [userId]
);
```

---

## Next Steps

1. **Explore:** Use the helper functions in your code
2. **Build APIs:** Create endpoints for your features
3. **Test:** Verify data is being saved correctly
4. **Scale:** Add more complex queries as needed

See **05-QUICK-REFERENCE.md** for a quick command reference.
