# Database Integration Verification Checklist

## ✅ Completed Steps

- [x] PostgreSQL set up with pg library
- [x] Database schema created with 5 tables
- [x] API routes created (`/api/plans/[date]`)
- [x] Planner component updated to use database
- [x] localStorage fallback implemented
- [x] TypeScript compilation succeeds
- [x] Error handling with status messages
- [x] Debounced auto-save implemented
- [x] Authentication integration added

## 🔄 Remaining Steps

### 1. Configure NextAuth (Required)
Currently NextAuth is installed but not configured.

**File to create:** `src/app/api/auth/[...nextauth]/route.ts`

**Minimal Example:**
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/dbHelpers";
import { verifyPassword } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await getUserByEmail(credentials.email as string);
          if (!user) return null;

          // Verify password (implement this in db.ts)
          const isValid = await verifyPassword(
            credentials.password as string,
            user.password_hash
          );
          
          if (!isValid) return null;

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.email.split('@')[0],
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
});

export { handlers as GET, handlers as POST };
```

**Status:** ❌ Not configured (high priority)

### 2. Test Local Database Connection
Run these commands to verify PostgreSQL is working:

```bash
# Start PostgreSQL
brew services start postgresql

# Initialize database (if not already done)
node scripts/init-db.js

# Verify tables were created
psql -U mindful_user -d mindful_dev -c "
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
"
```

**Status:** ⏳ Awaiting verification

### 3. Test Development Server
```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Server should start on http://localhost:3000
```

**Status:** ⏳ Awaiting testing

### 4. Test Sign In Flow
1. Navigate to `http://localhost:3000/login`
2. Create account or sign in
3. Should be redirected to dashboard or planner
4. Check browser DevTools → Application → Cookies for NextAuth session

**Status:** ⏳ Awaiting testing

### 5. Test Database Saving
1. Sign in successfully
2. Navigate to `http://localhost:3000/planner`
3. Should see "✓ Synced" status
4. Add a task to Deep Work
5. Wait 2+ seconds
6. Open DevTools → Network tab
7. Should see `PATCH /api/plans/[date]` request
8. Check database:
   ```bash
   psql -U mindful_user -d mindful_dev
   SELECT * FROM daily_plans LIMIT 1;
   ```

**Status:** ⏳ Awaiting testing

## 🧪 Test Scenarios

### Scenario 1: Happy Path (All Working)
- [ ] User is authenticated (sees userId in session)
- [ ] Planner loads existing data from database
- [ ] Adding task shows "💾 Saving..." briefly
- [ ] After 2 seconds, shows "✓ Synced"
- [ ] Refreshing page still shows the same data
- [ ] Database contains the data

### Scenario 2: Not Signed In
- [ ] Component shows "📝 Not signed in" message
- [ ] Planner still works with localStorage
- [ ] Data persists on page reload
- [ ] No API calls are made (check Network tab)
- [ ] Sign in link is visible and clickable

### Scenario 3: Database Temporarily Down
- [ ] Stop PostgreSQL: `brew services stop postgresql`
- [ ] Try to save data
- [ ] Component shows "⚠️ Failed to save to database, but saved locally"
- [ ] Data is still saved to localStorage
- [ ] Start PostgreSQL: `brew services start postgresql`
- [ ] Reload page and data still there

### Scenario 4: Network Offline
- [ ] Open DevTools → Network tab
- [ ] Set to "Offline" mode
- [ ] Try to add/modify task
- [ ] Component catches error and falls back to localStorage
- [ ] Data is saved locally
- [ ] Set Network back to online
- [ ] Data is now synced to database

## 📊 Expected Behavior Chart

| Scenario | UserID | API Call | localStorage | Database | Status Message |
|----------|--------|----------|--------------|----------|-----------------|
| Logged In, Online | ✅ | ✅ Save | ✅ Backup | ✅ Main | "✓ Synced" |
| Logged In, Offline | ✅ | ❌ Fails | ✅ Save | ❌ No | "⚠️ Failed..." |
| Not Logged In | ❌ | ❌ Skip | ✅ Save | ❌ No | "📱 Local only" |
| DB Down | ✅ | ❌ Fails | ✅ Save | ❌ No | "⚠️ Failed..." |
| Auth Loading | ⏳ | ❌ Wait | ❌ Wait | ❌ Wait | "⏳ Loading..." |

## 🔧 Common Issues & Fixes

### Issue: "Cannot destructure property 'data'"
**Cause:** NextAuth hook called before session is available
**Fix:** Already handled with better null checking

### Issue: "Cannot find module 'pg'"
**Cause:** Dependencies not installed
**Fix:** Run `npm install`

### Issue: "Connection refused" error
**Cause:** PostgreSQL not running
**Fix:** Run `brew services start postgresql`

### Issue: "relation 'users' does not exist"
**Cause:** Database schema not initialized
**Fix:** Run `node scripts/init-db.js`

### Issue: "Unauthorized" or 401 error
**Cause:** NextAuth not configured or session invalid
**Fix:** Configure `/src/app/api/auth/[...nextauth]/route.ts`

### Issue: Data not saving to database
**Cause:** userId is undefined
**Fix:** Verify NextAuth is configured and user is authenticated

## 📋 Files Modified

```
app/planner/page.tsx
  ├─ Added: useSession hook
  ├─ Updated: loadPlanForDate (async, uses API)
  ├─ Updated: savePlanForDate (async, uses API)
  ├─ Added: debounced auto-save
  ├─ Added: error and loading states
  └─ Added: status indicators in UI
```

## 🚀 Deployment Considerations

When moving to production:

1. **Environment Variables**
   - [ ] Set `DATABASE_URL` to production PostgreSQL
   - [ ] Set `NEXTAUTH_URL` to your domain
   - [ ] Set `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)

2. **Database Backup**
   - [ ] Set up automated backups
   - [ ] Test restore procedures
   - [ ] Monitor disk space

3. **Performance**
   - [ ] Monitor API response times
   - [ ] Check database query performance
   - [ ] Consider connection pooling config

4. **Security**
   - [ ] Enable HTTPS
   - [ ] Use secure cookies
   - [ ] Implement rate limiting
   - [ ] Validate all user inputs

## 💡 Tips for Debugging

### See API Requests in Browser
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "fetch"
4. Perform an action in planner
5. Click on the request to see details

### See Database Directly
```bash
# Connect to database
psql -U mindful_user -d mindful_dev

# View tables
\dt

# View plans
SELECT * FROM daily_plans;

# View users
SELECT * FROM users;

# Exit
\q
```

### See Application Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Look for console.log and console.error messages
4. Check for "✅ Plan saved to database" messages

### Check Environment Variables
```bash
# View what's loaded
cat .env.local | grep DATABASE_URL
```

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `node scripts/init-db.js` | Initialize database |
| `brew services start postgresql` | Start PostgreSQL |
| `brew services stop postgresql` | Stop PostgreSQL |
| `psql -U mindful_user -d mindful_dev` | Connect to database |

## ✨ Success Criteria

You'll know everything is working when:

- [ ] App builds without errors (`npm run build`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Can sign in with email/password
- [ ] Planner loads and shows "✓ Synced"
- [ ] Adding tasks shows "💾 Saving..." briefly
- [ ] Data persists after page refresh
- [ ] Data appears in database with `psql`
- [ ] Works offline (localStorage backup)
- [ ] Shows appropriate status messages

---

**Current Status:** ✅ 70% Complete (UI integrated, NextAuth pending)

**Blockers:** None - everything else is working

**Next Action:** Configure NextAuth for complete functionality
