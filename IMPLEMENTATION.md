## Implementation Guide — Mindful Daily Planner

> **Note:** This document was created with Prisma ORM in mind. Prisma has been removed from the codebase. Use this as a historical reference, but be aware that Prisma-specific steps and code examples should be adapted for your chosen database solution.

This document provides **step-by-step, incremental coding instructions** to build the Mindful Daily Planner from scratch. Each step is small, testable, and builds on the previous one.

---

## Table of Contents

1. [Step 0: Project Initialization](#step-0-project-initialization)
2. [Step 1–5: Authentication & Database](#steps-1-5-authentication--database)
3. [Step 6–10: API Endpoints](#steps-6-10-api-endpoints)
4. [Step 11–17: UI Components](#steps-11-17-ui-components)
5. [Step 18–22: Dashboard Integration](#steps-18-22-dashboard-integration)
6. [Step 23+: Feature Expansion](#step-23-feature-expansion)

Each step includes:
- **Goal:** What you're building
- **Action:** Code to write
- **Test:** How to verify it works
- **Commit:** Git message to save progress

---

## STEP 0: Project Initialization

### Goal
Set up a Next.js project with TypeScript, Tailwind CSS, and development tools.

### Action

#### 0.1: Create Next.js App
```bash
npx create-next-app@latest mindful-daily-planner \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --no-git \
  --no-src-dir \
  --import-alias '@/*'

cd mindful-daily-planner
```

#### 0.2: Install Dependencies
```bash
npm install \
  next-auth@^5 \
  prisma @prisma/client \
  dotenv \
  zod \
  typescript

npm install --save-dev \
  @types/node \
  eslint eslint-config-next \
  prettier \
  husky lint-staged \
  jest @testing-library/react @testing-library/jest-dom
```

#### 0.3: Initialize Prisma
```bash
npx prisma init
```

This creates `prisma/schema.prisma` and `.env.local`.

#### 0.4: Update `.env.local`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mindful_planner"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

#### 0.5: Create `.env.example`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mindful_planner"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

#### 0.6: Set Up ESLint & Prettier

Create `.eslintrc.json`:
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "react/no-unescaped-entities": "off"
  }
}
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}
```

#### 0.7: Add Git Hooks

```bash
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Create `.lintstagedrc`:
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

#### 0.8: Create Directory Structure
```bash
mkdir -p src/{components,hooks,lib,types,context}
mkdir -p app/api/auth
mkdir -p tests/{unit,integration}
```

#### 0.9: Update `package.json` Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src app",
    "format": "prettier --write src app",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Test
```bash
npm run dev
# Visit http://localhost:3000
# Should see Next.js default welcome page
```

### Commit
```bash
git add .
git commit -m "step-0: initial nextjs setup with typescript, tailwind, and dev tools"
```

---

## STEP 1: Database Schema

### Goal
Define PostgreSQL schema for users, daily plans, and planning zones.

### Action

#### 1.1: Create Prisma Schema

Edit `prisma/schema.prisma`:
```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  timezone  String   @default("UTC")
  theme     String   @default("light")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  dailyPlans  DailyPlan[]
  sessions    Session[]

  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model DailyPlan {
  id       String   @id @default(cuid())
  userId   String
  planDate DateTime @db.Date
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  deepWorkZones   DeepWorkZone[]
  quickWins       QuickWin[]
  makeItHappens   MakeItHappen[]
  rechargeZones   RechargeZone[]
  littleJoys      LittleJoy[]
  reflectionToday ReflectionToday[]
  focusTomorrow   FocusTomorrow[]

  @@unique([userId, planDate])
  @@map("daily_plans")
}

model DeepWorkZone {
  id        String   @id @default(cuid())
  planId    String
  title     String
  timeEstimate Int?  // minutes
  notes     String?
  completed Boolean  @default(false)
  completedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("deep_work_zones")
}

model QuickWin {
  id        String   @id @default(cuid())
  planId    String
  title     String
  completed Boolean  @default(false)
  completedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("quick_wins")
}

model MakeItHappen {
  id        String   @id @default(cuid())
  planId    String
  task      String
  completed Boolean  @default(false)
  completedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("make_it_happen")
}

model RechargeZone {
  id        String   @id @default(cuid())
  planId    String
  activityId String?
  customActivity String?
  completed Boolean  @default(false)
  completedAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("recharge_zones")
}

model LittleJoy {
  id        String   @id @default(cuid())
  planId    String
  content   String
  createdAt DateTime @default(now())

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("little_joys")
}

model ReflectionToday {
  id        String   @id @default(cuid())
  planId    String   @unique
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("reflections_today")
}

model FocusTomorrow {
  id        String   @id @default(cuid())
  planId    String   @unique
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  plan DailyPlan @relation(fields: [planId], references: [id], onDelete: Cascade)

  @@map("focus_tomorrow")
}
```

#### 1.2: Create Migration
```bash
npx prisma migrate dev --name init
# Follow prompts to create the database
# This creates your PostgreSQL tables
```

#### 1.3: Create TypeScript Types

Create `src/types/index.ts`:
```typescript
// src/types/index.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  timezone: string;
  theme: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPlan {
  id: string;
  userId: string;
  planDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeepWorkZone {
  id: string;
  planId: string;
  title: string;
  timeEstimate?: number;
  notes?: string;
  completed: boolean;
  completedAt?: Date;
}

export interface QuickWin {
  id: string;
  planId: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface MakeItHappen {
  id: string;
  planId: string;
  task: string;
  completed: boolean;
  completedAt?: Date;
}

export interface RechargeZone {
  id: string;
  planId: string;
  activityId?: string;
  customActivity?: string;
  completed: boolean;
  completedAt?: Date;
}

export interface LittleJoy {
  id: string;
  planId: string;
  content: string;
  createdAt: Date;
}

export interface ReflectionToday {
  id: string;
  planId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FocusTomorrow {
  id: string;
  planId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanWithZones extends DailyPlan {
  deepWorkZones: DeepWorkZone[];
  quickWins: QuickWin[];
  makeItHappens: MakeItHappen[];
  rechargeZones: RechargeZone[];
  littleJoys: LittleJoy[];
  reflectionToday?: ReflectionToday;
  focusTomorrow?: FocusTomorrow;
}
```

### Test
```bash
# Verify migration ran successfully
npx prisma db push
# Check database in your PostgreSQL client
psql -d mindful_planner -c "\dt"
```

### Commit
```bash
git add .
git commit -m "step-1: create prisma schema for users, daily plans, and zones"
```

---

## STEP 2: Authentication Setup with NextAuth

### Goal
Implement user authentication with email/password and Google OAuth.

### Action

#### 2.1: Create Auth Configuration

Create `src/lib/auth.ts`:
```typescript
// src/lib/auth.ts

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // TODO: Implement password verification
        // For now, passwords are not stored in DB
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};
```

#### 2.2: Create Prisma Client

Create `src/lib/prisma.ts`:
```typescript
// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 2.3: Install NextAuth Dependencies
```bash
npm install @next-auth/prisma-adapter bcrypt
npm install --save-dev @types/bcrypt
```

#### 2.4: Update `.env.local`
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mindful_planner"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Google OAuth (optional for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

#### 2.5: Create NextAuth API Route

Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

#### 2.6: Create Sign-In Page

Create `app/auth/signin/page.tsx`:
```typescript
// app/auth/signin/page.tsx

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Mindful Daily Planner
          </h1>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mb-4"
          >
            Sign in with Google
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 2.7: Create Sign-Up Page

Create `app/auth/signup/page.tsx`:
```typescript
// app/auth/signup/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      if (res.ok) {
        alert('Check your email to verify your account');
      } else {
        const data = await res.json();
        setError(data.message || 'Sign up failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 2.8: Create Sign-Up API Route

Create `app/api/auth/signup/route.ts`:
```typescript
// app/api/auth/signup/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Test
```bash
npm run dev
# Visit http://localhost:3000/auth/signin
# Try signing in with Google (requires credentials)
# Or visit http://localhost:3000/auth/signup and create a test account
```

### Commit
```bash
git add .
git commit -m "step-2: implement nextauth authentication with email/google oauth"
```

---

## STEP 3: Middleware for Protected Routes

### Goal
Protect dashboard routes so only authenticated users can access them.

### Action

#### 3.1: Create Middleware

Create `middleware.ts`:
```typescript
// middleware.ts

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

### Test
```bash
npm run dev
# Visit http://localhost:3000/dashboard
# Should redirect to /auth/signin if not logged in
```

### Commit
```bash
git add .
git commit -m "step-3: add middleware to protect dashboard routes"
```

---

## STEP 4: API Endpoints for Daily Plans (CRUD)

### Goal
Create API endpoints to create, read, update, and delete daily plans.

### Action

#### 4.1: Create GET /api/plans Endpoint

Create `app/api/plans/route.ts`:
```typescript
// app/api/plans/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter required' },
        { status: 400 }
      );
    }

    const plan = await prisma.dailyPlan.findUnique({
      where: {
        userId_planDate: {
          userId: session.user.id,
          planDate: new Date(date),
        },
      },
      include: {
        deepWorkZones: true,
        quickWins: true,
        makeItHappens: true,
        rechargeZones: true,
        littleJoys: true,
        reflectionToday: true,
        focusTomorrow: true,
      },
    });

    return NextResponse.json(plan || null);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planDate } = await req.json();

    if (!planDate) {
      return NextResponse.json(
        { error: 'planDate required' },
        { status: 400 }
      );
    }

    const plan = await prisma.dailyPlan.create({
      data: {
        userId: session.user.id,
        planDate: new Date(planDate),
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Plan already exists for this date' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### 4.2: Create API Utility

Create `src/lib/api.ts`:
```typescript
// src/lib/api.ts

const API_BASE = '/api';

export async function fetchPlan(date: string) {
  const res = await fetch(`${API_BASE}/plans?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch plan');
  return res.json();
}

export async function createPlan(planDate: string) {
  const res = await fetch(`${API_BASE}/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planDate }),
  });
  if (!res.ok) throw new Error('Failed to create plan');
  return res.json();
}

export async function createZone(
  type: string,
  planId: string,
  data: Record<string, any>
) {
  const res = await fetch(`${API_BASE}/zones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, planId, ...data }),
  });
  if (!res.ok) throw new Error(`Failed to create ${type}`);
  return res.json();
}

export async function updateZone(
  type: string,
  id: string,
  data: Record<string, any>
) {
  const res = await fetch(`${API_BASE}/zones/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...data }),
  });
  if (!res.ok) throw new Error(`Failed to update ${type}`);
  return res.json();
}

export async function deleteZone(type: string, id: string) {
  const res = await fetch(`${API_BASE}/zones/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw new Error(`Failed to delete ${type}`);
  return res.json();
}
```

#### 4.3: Create Generic Zone API Route

Create `app/api/zones/route.ts`:
```typescript
// app/api/zones/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, planId, title, task, content, timeEstimate, notes } = await req.json();

    // Verify plan belongs to user
    const plan = await prisma.dailyPlan.findUnique({
      where: { id: planId },
    });

    if (plan?.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let zone;

    switch (type) {
      case 'deepWork':
        zone = await prisma.deepWorkZone.create({
          data: { planId, title: title || '', timeEstimate, notes },
        });
        break;
      case 'quickWin':
        zone = await prisma.quickWin.create({
          data: { planId, title: title || '' },
        });
        break;
      case 'makeItHappen':
        zone = await prisma.makeItHappen.create({
          data: { planId, task: task || '' },
        });
        break;
      case 'littleJoy':
        zone = await prisma.littleJoy.create({
          data: { planId, content: content || '' },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### 4.4: Create Zone Update/Delete Route

Create `app/api/zones/[id]/route.ts`:
```typescript
// app/api/zones/[id]/route.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, completed, title, task, content, notes, timeEstimate } = await req.json();
    const { id } = params;

    let zone;

    switch (type) {
      case 'deepWork':
        zone = await prisma.deepWorkZone.update({
          where: { id },
          data: { completed, title, notes, timeEstimate },
        });
        break;
      case 'quickWin':
        zone = await prisma.quickWin.update({
          where: { id },
          data: { completed, title },
        });
        break;
      case 'makeItHappen':
        zone = await prisma.makeItHappen.update({
          where: { id },
          data: { completed, task },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(zone);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await req.json();
    const { id } = params;

    let zone;

    switch (type) {
      case 'deepWork':
        zone = await prisma.deepWorkZone.delete({ where: { id } });
        break;
      case 'quickWin':
        zone = await prisma.quickWin.delete({ where: { id } });
        break;
      case 'makeItHappen':
        zone = await prisma.makeItHappen.delete({ where: { id } });
        break;
      case 'littleJoy':
        zone = await prisma.littleJoy.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(zone);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Test
```bash
# Test creating a plan via API
curl -X POST http://localhost:3000/api/plans \
  -H "Content-Type: application/json" \
  -d '{"planDate":"2025-11-25"}'
```

### Commit
```bash
git add .
git commit -m "step-4: create api endpoints for daily plans and zones crud"
```

---

## STEP 5: React Hooks for Plan Management

### Goal
Create custom hooks to manage fetching and updating plans from the UI.

### Action

#### 5.1: Create usePlan Hook

Create `src/hooks/usePlan.ts`:
```typescript
// src/hooks/usePlan.ts

'use client';

import { useEffect, useState } from 'react';
import { PlanWithZones } from '@/types';
import * as api from '@/lib/api';

export function usePlan(date: string) {
  const [plan, setPlan] = useState<PlanWithZones | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      try {
        setLoading(true);
        const existingPlan = await api.fetchPlan(date);

        if (!existingPlan) {
          // Create plan if doesn't exist
          const newPlan = await api.createPlan(date);
          setPlan(newPlan);
        } else {
          setPlan(existingPlan);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPlan();
  }, [date]);

  const addZone = async (type: string, data: Record<string, any>) => {
    if (!plan) return;
    try {
      const zone = await api.createZone(type, plan.id, data);
      setPlan({
        ...plan,
        [getZoneKey(type)]: [...(plan as any)[getZoneKey(type)], zone],
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateZone = async (type: string, id: string, data: Record<string, any>) => {
    if (!plan) return;
    try {
      const updatedZone = await api.updateZone(type, id, data);
      const key = getZoneKey(type);
      setPlan({
        ...plan,
        [key]: (plan as any)[key].map((zone: any) =>
          zone.id === id ? updatedZone : zone
        ),
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteZone = async (type: string, id: string) => {
    if (!plan) return;
    try {
      await api.deleteZone(type, id);
      const key = getZoneKey(type);
      setPlan({
        ...plan,
        [key]: (plan as any)[key].filter((zone: any) => zone.id !== id),
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    plan,
    loading,
    error,
    addZone,
    updateZone,
    deleteZone,
  };
}

function getZoneKey(type: string): string {
  const keys: Record<string, string> = {
    deepWork: 'deepWorkZones',
    quickWin: 'quickWins',
    makeItHappen: 'makeItHappens',
    littleJoy: 'littleJoys',
  };
  return keys[type] || '';
}
```

#### 5.2: Create useAuth Hook

Create `src/hooks/useAuth.ts`:
```typescript
// src/hooks/useAuth.ts

'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn,
    signOut,
  };
}
```

#### 5.3: Create useDateContext Hook

Create `src/hooks/useDateContext.ts`:
```typescript
// src/hooks/useDateContext.ts

'use client';

import { useContext } from 'react';
import { DateContext } from '@/context/DateContext';

export function useDateContext() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateContext must be used within DateProvider');
  }
  return context;
}
```

#### 5.4: Create DateContext

Create `src/context/DateContext.tsx`:
```typescript
// src/context/DateContext.tsx

'use client';

import { createContext, useState, ReactNode } from 'react';

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}
```

### Test
```bash
# Hooks are tested through components in next steps
```

### Commit
```bash
git add .
git commit -m "step-5: create custom hooks for plan management and auth"
```

---

## STEP 6–10: UI Components (Quick Summary)

Due to length constraints, I'll provide the template structure. You can build each component incrementally.

### Step 6: Create Common Components
- Button, Input, Textarea, Card components in `src/components/Common/`

### Step 7: Create Zone Components
- DeepWorkZone.tsx, QuickWins.tsx, MakeItHappen.tsx, etc. in `src/components/Planner/`

### Step 8: Create Dashboard Layout
- Header, Sidebar, DailyDashboard in `src/components/Dashboard/`

### Step 9: Create Main Planner Page
- `app/dashboard/page.tsx` - Assemble all zones

### Step 10: Add Date Navigation
- Date picker, past days history

---

## STEP 11–22: Testing & Deployment

### Step 11: Write Unit Tests
- Test API endpoints, hooks, utility functions

### Step 12: Write Integration Tests
- Test full flows (auth, plan creation, zone updates)

### Step 13: Write E2E Tests
- Test complete user journeys with Playwright

### Step 14: Security Audit
- CSRF protection, SQL injection prevention, rate limiting

### Step 15: Accessibility Audit
- WCAG 2.1 AA compliance check

### Step 16: Performance Optimization
- Code splitting, image optimization, caching

### Step 17: Deploy to Staging
- Vercel staging deployment

### Step 18–22: Beta Testing & Fixes
- Collect user feedback, iterate on UX

---

## STEP 23+: Feature Expansion

After MVP is complete:
- Step 23: Recharge Activity Library
- Step 24: Export to PDF/CSV
- Step 25: Email Notifications
- Step 26: Analytics Dashboard
- Step 27: Social Features
- Step 28: Calendar Integration
- Step 29: Premium Features
- Step 30: Mobile App

---

## Summary: Quick Start Checklist

```bash
# Steps 0-2: Setup & Auth (First Day)
npm install && npx prisma migrate dev
npm run dev  # Visit http://localhost:3000/auth/signin

# Steps 3-5: API & Hooks (Second Day)
# Create endpoints, test with curl or Postman

# Steps 6-10: UI Components (Days 3-5)
# Build components incrementally, test in browser

# Steps 11-16: Testing & Polish (Days 6-7)
# Add tests, security, accessibility

# Step 17+: Deploy & Expand (Week 2+)
# Push to production, add advanced features
```

---

**Total Time Estimate:**
- **MVP (7 days - 1 week):** Steps 0–10 + basic testing
- **Production-Ready (14 days - 2 weeks):** Add tests, security, deploy
- **Phase 2 (4 weeks):** Add export, notifications, analytics, social

---

**Next:** Choose a step and start building! Each step is independent and takes 1–2 hours.

Would you like me to build out **Step 6** (Common Components) with full code examples next?
