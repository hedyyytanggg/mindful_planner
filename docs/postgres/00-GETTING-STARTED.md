# PostgreSQL Setup - Getting Started

## Quick Start (3 Steps)

### 1. Ensure PostgreSQL is Running
```bash
# macOS
brew services start postgresql@16

# Or check if it's running
pg_isready -U mindful_user -h localhost
```

### 2. Initialize Database
```bash
node scripts/init-db.js
```

You should see:
```
📦 Initializing database...
✅ Database schema created successfully!
📊 Tables created:
  - users
  - daily_plans
  - deep_work_zones
  - quick_wins
  - app_settings
```

### 3. Start Your App
```bash
npm run dev
```

---

## Environment Variables

Your `.env.local` is already configured:

```env
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-very-secret-key-change-in-production"
NODE_ENV="development"
```

---

## Next Steps

1. **Read** `01-SETUP-GUIDE.md` - Installation if needed
2. **Explore** `02-CONNECTING.md` - How to connect to your database
3. **Learn** `03-DATABASE-INTERFACES.md` - GUI tools to manage your data
4. **Implement** `04-IMPLEMENTATION-GUIDE.md` - How to use the database in your code
5. **Reference** `05-QUICK-REFERENCE.md` - Commands and helper functions

---

## Folder Structure

```
docs/postgres/
├── 00-GETTING-STARTED.md           (This file)
├── 01-SETUP-GUIDE.md               (PostgreSQL installation)
├── 02-CONNECTING.md                (Connection methods)
├── 03-DATABASE-INTERFACES.md       (GUI tools like pgAdmin, DBeaver)
├── 04-IMPLEMENTATION-GUIDE.md      (Code examples and API routes)
└── 05-QUICK-REFERENCE.md           (Commands and functions)
```

---

## What You Have

✅ **PostgreSQL with `pg` library** - Connected and ready
✅ **Connection pooling** - Efficient resource management
✅ **Helper functions** - Type-safe database operations
✅ **5 tables** - users, daily_plans, deep_work_zones, quick_wins, app_settings
✅ **Example API routes** - GET/PATCH daily plans
✅ **Full documentation** - Everything you need to get started

---

## Files in Your Project

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Connection pool and query execution |
| `src/lib/dbHelpers.ts` | Type-safe helper functions |
| `src/lib/schema.sql.ts` | Database schema definition |
| `scripts/init-db.js` | Database initialization script |
| `src/app/api/plans/[date]/route.ts` | Example API routes |

---

## Questions?

- **Installation issues?** → Read `01-SETUP-GUIDE.md`
- **How to connect?** → Read `02-CONNECTING.md`
- **Which GUI tool?** → Read `03-DATABASE-INTERFACES.md`
- **How to code it?** → Read `04-IMPLEMENTATION-GUIDE.md`
- **Quick commands?** → Read `05-QUICK-REFERENCE.md`

Let's get started! 🚀
