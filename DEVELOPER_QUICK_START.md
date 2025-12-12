# 🚀 Developer Quick Start

Fast reference for getting productive with Mindful development.

---

## ⚡ 5-Minute Setup

```bash
# 1. Clone and install
git clone https://github.com/yourusername/mindful.git
cd mindful
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

---

## 🗂️ Project Structure

```
mindful/
├── app/                     # Next.js app (pages & routes)
│   ├── api/auth/           # Authentication endpoints
│   ├── api/plans/          # Plans API
│   ├── planner/            # Main app
│   └── [page].tsx          # Public pages (login, signup, etc)
├── src/
│   ├── components/         # React components
│   │   ├── Common/        # Buttons, Inputs, etc
│   │   └── Planner/       # 7 planner feature components
│   └── lib/               # Database & utilities
│       └── dbHelpers.ts   # All database queries
├── prisma/                 # Database
│   └── init.sql           # Schema initialization
└── package.json            # Dependencies
```

---

## 🔌 Key Files Reference

| File | Purpose |
|------|---------|
| `app/api/plans/[date]/route.ts` | GET/PATCH endpoints for plans |
| `app/api/auth/[...nextauth]/route.ts` | Authentication routes |
| `src/lib/dbHelpers.ts` | All database queries |
| `src/lib/db.ts` | Database connection pool |
| `app/planner/page.tsx` | Main planner UI & state management |
| `src/components/Planner/*.tsx` | Feature components (DeepWorkZone, etc) |

---

## 💾 Database Quick Reference

### Connection
```bash
# Connect to local database
psql -d mindful

# Connect to production
psql "postgresql://user:password@host/mindful"
```

### Common Queries
```sql
-- View all users
SELECT id, email, name FROM users;

-- View user's plans
SELECT * FROM daily_plans WHERE "userId" = 'user-id';

-- View all deep work zones for a plan
SELECT * FROM deep_work_zones WHERE "planId" = 'plan-id';

-- Check table structure
\d daily_plans
\d deep_work_zones

-- Reset database (development only!)
DROP SCHEMA public CASCADE; CREATE SCHEMA public;
```

---

## 🔐 Authentication Flow

### Sign Up
```
User enters email/password → POST /auth/signup → Hash password → Create user in DB → Return success
```

### Sign In
```
User enters credentials → POST /auth/signin → Verify password → Create JWT session → Return auth
```

### Protected Routes
```
/planner requires authentication → Redirect to /login if no session
```

---

## 📡 API Endpoints

### Base URL (Local)
```
http://localhost:3000/api
```

### Authentication Endpoints

**POST /auth/signup**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "User Name"
}
```

**POST /auth/signin**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**POST /auth/signout**
```
No body needed, clears session
```

### Plans Endpoints

**GET /api/plans/2024-12-12**
Returns complete plan with all nested data

**PATCH /api/plans/2024-12-12**
```json
{
  "deep_work": [...],
  "quick_wins": [...],
  "make_it_happen": {...},
  "recharge_zone": [...],
  "little_joys": [...],
  "reflection": "text",
  "focus_tomorrow": "text"
}
```

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full details.

---

## 🧩 Component Architecture

### 7 Main Components
```
planner/page.tsx (Parent - State Management)
├── DeepWorkZone.tsx
├── QuickWins.tsx
├── MakeItHappen.tsx
├── RechargeZone.tsx
├── LittleJoys.tsx
├── ReflectionToday.tsx
└── FocusTomorrow.tsx
```

### State Management Pattern
```typescript
// Parent state
const [deepWork, setDeepWork] = useState([]);

// Auto-save on change
useEffect(() => {
  const timer = setTimeout(() => {
    savePlanForDate(selectedDate, planData);
  }, 2000);
  return () => clearTimeout(timer);
}, [deepWork, quickWins, ...]);

// Pass to child
<DeepWorkZone items={deepWork} onUpdate={setDeepWork} />
```

### Child Component Pattern
```typescript
// Child receives props
export function DeepWorkZone({ items, onUpdate }) {
  const [localState, setLocalState] = useState(items);
  
  // Sync when prop changes
  useEffect(() => {
    setLocalState(items);
  }, [items]);
  
  // Update parent on change
  const handleChange = (updated) => {
    setLocalState(updated);
    onUpdate(updated);
  };
  
  return (...);
}
```

---

## 🔄 Data Flow: Saving

```
User edits component
    ↓
Local state updates
    ↓
useEffect watches state
    ↓
2-second debounce
    ↓
PATCH /api/plans/[date]
    ↓
Backend normalizes data → Save to 7 tables
    ↓
Return complete plan
    ↓
Parent state updates
    ↓
All children re-render
```

---

## 🔄 Data Flow: Loading

```
User navigates to /planner
    ↓
GET /api/plans/[date]
    ↓
Execute 8 parallel queries:
  - daily_plans (master)
  - deep_work_zones
  - quick_wins
  - make_it_happen
  - recharge_zones
  - little_joys
  - reflections_today
  - focus_tomorrow
    ↓
Assemble nested structure
    ↓
Return to frontend
    ↓
Parent state updates
    ↓
All children render with data
```

---

## 🛠️ Common Development Tasks

### Add New Feature Component

1. Create `src/components/Planner/NewFeature.tsx`:
```typescript
export function NewFeature({ items, onUpdate }) {
  const [localItems, setLocalItems] = useState(items);
  
  useEffect(() => {
    setLocalItems(items);
  }, [items]);
  
  const handleUpdate = (updated) => {
    setLocalItems(updated);
    onUpdate(updated);
  };
  
  return (...);
}
```

2. Add to `app/planner/page.tsx`:
```typescript
const [newFeature, setNewFeature] = useState([]);

// In useEffect watching state:
useEffect(() => {
  const timer = setTimeout(() => {
    savePlanForDate(...);
  }, 2000);
}, [..., newFeature]);

// In JSX:
<NewFeature items={newFeature} onUpdate={setNewFeature} />
```

3. Add database table and save function in `src/lib/dbHelpers.ts`

### Add New API Endpoint

1. Create `app/api/new-endpoint/route.ts`:
```typescript
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  // Your logic here
  return NextResponse.json({ data: ... });
}
```

2. Use in component:
```typescript
const res = await fetch('/api/new-endpoint');
const data = await res.json();
```

### Modify Database Schema

1. Update `prisma/init.sql`
2. In production:
   ```bash
   psql "postgresql://..." -f prisma/init.sql
   ```
3. Update TypeScript types in `src/lib/dbHelpers.ts`

---

## 🧪 Testing

### Type Checking
```bash
npx tsc --noEmit
```

### Build Check
```bash
npm run build
```

### Manual Testing
```bash
# Test sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","name":"Test"}'

# Test get plan
curl http://localhost:3000/api/plans/2024-12-12 \
  -H "Authorization: Bearer token"
```

---

## 🐛 Debugging Tips

### Enable Database Logging
```typescript
// In src/lib/db.ts
const DEBUG = true;
pool.on('query', (query) => {
  if (DEBUG) console.log('Query:', query.text, query.values);
});
```

### Check Component Props
```typescript
useEffect(() => {
  console.log('Component received:', { items, onUpdate });
}, [items, onUpdate]);
```

### Browser DevTools
```javascript
// In console:
// View localStorage
localStorage.getItem('plan_2024-12-12')

// View session
await fetch('/api/auth/session').then(r => r.json())
```

### Server Logs
```bash
# dev server shows all API calls and errors
npm run dev
```

---

## 📦 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16 | Framework |
| react | 19 | UI library |
| typescript | 5.6 | Type safety |
| tailwindcss | 3.4 | Styling |
| next-auth | 4.24 | Authentication |
| pg | 8.11 | PostgreSQL client |

---

## 🚀 Deployment Quick Reference

### Production Checklist
- [ ] All TypeScript errors fixed
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Tests passing
- [ ] Git repository ready

### Deploy to Vercel
```bash
# Push to GitHub
git push origin main

# Vercel automatically deploys
# Monitor at https://vercel.com/dashboard
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full guide.

---

## 📚 Full Documentation

- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md) - Database schema
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [development.md](development.md) - Development workflow
- [DOCS_INDEX.md](DOCS_INDEX.md) - Documentation hub

---

## ⏱️ Common Command Times

| Task | Time |
|------|------|
| Full install from scratch | 5 min |
| Start dev server | 3 sec |
| Build production | 30-45 sec |
| Deploy to Vercel | 2-3 min |
| Load planner page | ~50ms |
| Auto-save to database | 2 sec |

---

## 💡 Tips & Tricks

1. **Hot reload**: Edit component → save → browser auto-updates
2. **Database debugging**: Use `psql` directly to inspect tables
3. **API testing**: Use `curl` or Postman for endpoint testing
4. **Performance**: Check Network tab for slow requests
5. **State issues**: Check React DevTools for component tree

---

**Last Updated:** December 12, 2025  
**Ready to code? Start with `npm run dev`!** 🎉
