# Authentication System Documentation

## Overview

The Mindful Planner uses **NextAuth.js 4.24.13** with a custom **CredentialsProvider** for user authentication. The system implements signup, login, and logout flows with real database user management.

## Architecture

### Technology Stack
- **NextAuth.js**: Session management and authentication provider
- **CredentialsProvider**: Custom authentication with email/password
- **PostgreSQL**: User credential storage
- **JWT**: Session token strategy
- **SHA256**: Password hashing (should use bcrypt in production)

### File Structure
```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          # NextAuth handler & CredentialsProvider config
├── login/
│   └── page.tsx                  # Login page component
├── signup/
│   └── page.tsx                  # Signup page component
└── planner/
    └── page.tsx                  # Protected route (redirects if not authenticated)

src/
├── components/
│   └── Common/
│       ├── Header.tsx            # Shows user info & logout button
│       └── SessionProvider.tsx    # NextAuth SessionProvider wrapper
└── lib/
    └── dbHelpers.ts              # User database functions
```

## Authentication Flow

### 1. Signup Flow

```
User visits /signup
    ↓
Enters email, password, confirm password
    ↓
Client validates (passwords match, min 6 chars)
    ↓
Calls signIn('credentials', {email, password, signUp: 'true'})
    ↓
NextAuth CredentialsProvider.authorize() called
    ↓
Checks if user already exists with getUserByEmail()
    ↓
If exists: Returns null → Error "Email already in use"
    ↓
If new: Creates user with createUser() → Returns user object
    ↓
JWT callback creates token with user.id
    ↓
Session callback adds token.id to session.user.id
    ↓
Redirects to /planner
```

**Code Flow:**
```typescript
// app/signup/page.tsx
const result = await signIn('credentials', {
  email,
  password,
  signUp: 'true',  // Flag to differentiate signup from login
  redirect: false,
});
```

### 2. Login Flow

```
User visits /login
    ↓
Enters email and password
    ↓
Calls signIn('credentials', {email, password, redirect: false})
    ↓
NextAuth CredentialsProvider.authorize() called
    ↓
Retrieves user with getUserByEmail()
    ↓
If not found: Returns null → Error "Invalid email or password"
    ↓
If found: Verifies password with verifyPassword()
    ↓
If invalid: Returns null → Error "Invalid email or password"
    ↓
If valid: Returns user object
    ↓
JWT callback creates token with user.id
    ↓
Session callback adds token.id to session.user.id
    ↓
Redirects to /planner
```

**Code Flow:**
```typescript
// app/login/page.tsx
const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});
```

### 3. Logout Flow

```
User clicks "Sign Out" button in header dropdown
    ↓
Calls signOut({callbackUrl: '/'})
    ↓
NextAuth clears session cookie
    ↓
Redirects to home page (/)
    ↓
Header shows "Sign In" / "Sign Up" buttons
```

**Code Flow:**
```typescript
// src/components/Common/Header.tsx
await signOut({ callbackUrl: '/' });
```

## Protected Routes

### Planner Page (`/planner`)

The planner page requires authentication. Unauthenticated users are automatically redirected to `/login`.

```typescript
// app/planner/page.tsx
const router = useRouter();
const sessionData = useSession();
const authStatus = sessionData?.status || 'loading';

useEffect(() => {
  if (authStatus === 'unauthenticated') {
    router.push('/login');
  }
}, [authStatus, router]);
```

**Authentication States:**
- `loading` - Checking session, show loading UI
- `authenticated` - User has valid session, allow access
- `unauthenticated` - No session, redirect to login

## Session Management

### SessionProvider Setup

The entire app is wrapped with `SessionProvider` in the root layout to enable `useSession()` hook throughout the application.

**`app/layout.tsx`:**
```typescript
import { SessionProviderWrapper } from '@/components/SessionProvider';

export default function RootLayout() {
  return (
    <html>
      <body>
        <SessionProviderWrapper>
          <Header />
          <main>{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
```

**`src/components/SessionProvider.tsx`:**
```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

### Accessing Session

Use the `useSession()` hook to access user information:

```typescript
'use client';

import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not signed in</p>;
  
  return (
    <div>
      <p>Welcome {session?.user?.email}</p>
      <p>User ID: {(session?.user as any)?.id}</p>
    </div>
  );
}
```

## Database Integration

### User Table Schema

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

### Helper Functions

**`src/lib/dbHelpers.ts`:**

```typescript
// Create a new user
export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  timezone: string = 'UTC'
): Promise<User>

// Get user by email (for login verification)
export async function getUserByEmail(email: string): Promise<User | null>

// Get user by ID (for session retrieval)
export async function getUserById(id: number): Promise<User | null>
```

### Password Hashing

Currently uses SHA256 (for demo purposes). **Should be upgraded to bcrypt in production**:

```typescript
// Current (demo)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Recommended for production
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

## NextAuth Configuration

**`app/api/auth/[...nextauth]/route.ts`:**

```typescript
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Credentials shown to user at login
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        signUp: { label: "Signing up", type: "hidden" },
      },
      
      async authorize(credentials) {
        // Custom logic: check signUp flag to handle signup vs login
        if (isSignUp) {
          // Create new user
        } else {
          // Validate existing user
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Add user.id to JWT token
      if (user) token.id = user.id;
      return token;
    },
    
    async session({ session, token }) {
      // Add token.id to session.user
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
    error: "/login",
  },
  
  session: {
    strategy: "jwt",
  },
};
```

## UI Components

### Header with User Menu

**`src/components/Common/Header.tsx`:**

- Shows **logged-out view** if `session?.user` is null:
  - "Sign In" button → `/login`
  - "Sign Up" button → `/signup`

- Shows **logged-in view** if session exists:
  - User email button with dropdown menu
  - Settings link → `/settings`
  - Sign Out button → calls `signOut()`

- Responsive design hides email on mobile, shows abbreviation

### Login Page

**`app/login/page.tsx`:**

- Email input
- Password input
- Submit button
- Error banner for failed authentication
- Link to signup page: "Don't have an account? Create one here"
- Disabled state while authentication is in progress

### Signup Page

**`app/signup/page.tsx`:**

- Email input
- Password input
- Confirm password input
- Client-side validation:
  - Passwords must match
  - Minimum 6 characters
  - Email validation
- Error handling for duplicate emails
- Link to login page: "Already have an account? Sign in here"
- Disabled state while account creation is in progress

## Error Handling

### Signup Errors

| Error | Cause | User Message |
|-------|-------|--------------|
| Email already in use | Duplicate email | "This email is already registered" |
| Generic failure | Database error | "Failed to create account. Please try again." |

### Login Errors

| Error | Cause | User Message |
|-------|-------|--------------|
| Invalid credentials | Wrong email/password | "Invalid email or password" |
| Generic failure | Database error | "An error occurred during login" |

## Security Considerations

### Current Implementation
- ✅ Password hashing (SHA256)
- ✅ JWT-based sessions
- ✅ HttpOnly cookies for token storage
- ✅ CSRF protection via NextAuth
- ✅ Protected routes with session verification

### Recommendations for Production
1. **Replace SHA256 with bcrypt** for stronger password hashing
2. **Enable HTTPS** to encrypt credentials in transit
3. **Add rate limiting** on auth endpoints to prevent brute force
4. **Implement email verification** for new accounts
5. **Add two-factor authentication (2FA)** for enhanced security
6. **Set secure NEXTAUTH_SECRET** in environment variables (not hardcoded)
7. **Add password reset functionality**
8. **Implement account lockout** after failed attempts
9. **Add audit logging** for authentication events
10. **Regular security audits** and dependency updates

## Testing the Auth Flow

### 1. Test Signup
```bash
# Visit http://localhost:3000/signup
# Enter: test@example.com / password123 / password123
# Should create user and redirect to /planner
```

### 2. Test Login
```bash
# Visit http://localhost:3000/login
# Enter: test@example.com / password123
# Should authenticate and redirect to /planner
```

### 3. Test Duplicate Signup
```bash
# Visit http://localhost:3000/signup
# Enter same email as before
# Should show "This email is already registered"
```

### 4. Test Logout
```bash
# Click header user menu → "Sign Out"
# Should redirect to home page
# Header should show "Sign In" / "Sign Up" buttons
```

### 5. Test Protected Route
```bash
# Visit http://localhost:3000/planner while not logged in
# Should redirect to /login
```

### 6. Verify Database
```bash
# Connect to PostgreSQL
psql -U mindful_user -d mindful_dev

# Query users table
SELECT id, email, name, created_at FROM users;
```

## Troubleshooting

### "Session is null in planner"
- Ensure SessionProvider wraps the app in layout.tsx
- Check that NEXTAUTH_SECRET is set (or using default in dev)
- Verify user is authenticated by checking Header shows email

### "Signup creates user but doesn't log in"
- Check NextAuth configuration has both JWT and session callbacks
- Verify createUser() returns all required fields (id, email, name)
- Check browser console for errors

### "Can't verify password"
- Ensure password hashing function matches verification function
- Check that password_hash is stored in database (psql query)
- Verify database column name is `password_hash` (camelCase)

### "Email already in use error on new email"
- Clear browser cookies/storage
- Check PostgreSQL for duplicate emails: `SELECT COUNT(*) FROM users WHERE email = 'test@example.com';`
- Verify getUserByEmail() is returning correct result

## Environment Variables

Required for production:

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/mindful_dev
```

## Related Documentation

- [DATABASE_INTEGRATION-COMPLETE.md](./docs/DATABASE-INTEGRATION-COMPLETE.md) - Database schema and helpers
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall system architecture
- [README.md](./README.md) - Project overview
