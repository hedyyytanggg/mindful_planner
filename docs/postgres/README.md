# PostgreSQL Documentation

Complete guide for setting up, connecting to, and using PostgreSQL with your Mindful Daily Planner application.

---

## 📚 Documentation Files

Read these in order for a complete understanding:

### 1. **`00-GETTING-STARTED.md`** ⭐ Start here!
- Quick 3-step setup
- Overview of what's already installed
- Links to detailed guides

**Read this first if:** You just want to get up and running

---

### 2. **`01-SETUP-GUIDE.md`** 🔧
- How to install PostgreSQL (macOS, Linux, Windows)
- Create database and user
- Verify installation
- Troubleshooting installation issues

**Read this if:** PostgreSQL isn't installed or you're having setup issues

---

### 3. **`02-CONNECTING.md`** 🔌
- Command line (psql) connection
- Connection from Node.js code
- VS Code extension setup
- Connection verification
- Database structure overview

**Read this if:** You want to connect to your database

---

### 4. **`03-DATABASE-INTERFACES.md`** 🖥️
- pgAdmin (comprehensive web-based tool)
- DBeaver (user-friendly desktop app)
- VS Code extension (quick access)
- TablePlus (premium option)
- Comparison table and recommendations

**Read this if:** You want a GUI to manage your database

---

### 5. **`04-IMPLEMENTATION-GUIDE.md`** 💻
- How to use the database in your code
- Direct SQL queries
- Helper functions for common operations
- Building API routes
- Frontend integration examples
- Error handling and validation

**Read this if:** You're writing code that uses the database

---

### 6. **`05-QUICK-REFERENCE.md`** ⚡
- Quick lookup for commands
- All helper functions at a glance
- Common SQL queries
- API route templates
- Troubleshooting table

**Read this if:** You just need to quickly look something up

---

## 🚀 Quick Start

```bash
# 1. Make sure PostgreSQL is running
brew services start postgresql@16

# 2. Initialize the database
node scripts/init-db.js

# 3. Start your app
npm run dev
```

---

## 🎯 Find What You Need

**I need to...**

- ✅ Get everything working → `00-GETTING-STARTED.md`
- 🔧 Install PostgreSQL → `01-SETUP-GUIDE.md`
- 🔌 Connect to database → `02-CONNECTING.md`
- 🖥️ Use a GUI tool → `03-DATABASE-INTERFACES.md`
- 💻 Write database code → `04-IMPLEMENTATION-GUIDE.md`
- ⚡ Quick command lookup → `05-QUICK-REFERENCE.md`

---

## 📂 Project Structure

```
your-project/
├── docs/postgres/                    (Documentation folder)
│   ├── 00-GETTING-STARTED.md
│   ├── 01-SETUP-GUIDE.md
│   ├── 02-CONNECTING.md
│   ├── 03-DATABASE-INTERFACES.md
│   ├── 04-IMPLEMENTATION-GUIDE.md
│   ├── 05-QUICK-REFERENCE.md
│   └── README.md                     (This file)
│
├── src/lib/
│   ├── db.ts                         (Connection pooling)
│   ├── dbHelpers.ts                  (Helper functions)
│   └── schema.sql.ts                 (Schema definition)
│
├── src/app/api/
│   └── plans/[date]/route.ts         (Example API routes)
│
├── scripts/
│   └── init-db.js                    (Database initialization)
│
└── .env.local                        (Configuration)
```

---

## 🗄️ Database Overview

### 5 Tables

1. **users** - User accounts
2. **daily_plans** - Daily plans per date
3. **deep_work_zones** - Deep work tasks (optional, can use JSONB instead)
4. **quick_wins** - Quick wins (optional, can use JSONB instead)
5. **app_settings** - User preferences

### Key Features

✅ Connection pooling for efficiency
✅ Type-safe queries with TypeScript
✅ Helper functions for common operations
✅ JSONB support for flexible data
✅ Proper indexes for performance
✅ Cascading deletes for data integrity

---

## 🛠️ Available Functions

### In `src/lib/dbHelpers.ts`

**Users**
- `createUser()`
- `getUserByEmail()`
- `getUserById()`

**Daily Plans**
- `getDailyPlan()`
- `getOrCreateDailyPlan()`
- `updateDailyPlan()`
- `getUserPlans()`

**Settings**
- `getAppSettings()`
- `createAppSettings()`
- `updateAppSettings()`

**Low-level**
- `query()` - Raw SQL queries
- `transaction()` - Multi-query transactions
- `getClient()` - Direct pool access

---

## 📖 Example Usage

### Quick Example

```typescript
import { getOrCreateDailyPlan, updateDailyPlan } from '@/lib/dbHelpers';

// Get or create a plan
const plan = await getOrCreateDailyPlan(userId, '2025-12-10');

// Update it
await updateDailyPlan(userId, '2025-12-10', {
  deep_work: [{ title: 'Task', timeEstimate: 120, completed: false }],
  reflection: 'Great day!'
});
```

### API Route Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateDailyPlan } from '@/lib/dbHelpers';

export async function GET(request: NextRequest, context: any) {
  const { date } = await context.params;
  const userId = request.nextUrl.searchParams.get('userId');

  const plan = await getOrCreateDailyPlan(parseInt(userId!), date);
  return NextResponse.json(plan);
}
```

---

## 🔒 Security

✅ **Parameterized queries** - Prevents SQL injection
✅ **Connection pooling** - Efficient resource management
✅ **Type safety** - TypeScript catches errors
✅ **Error handling** - Proper error messages and logging

---

## ❓ FAQ

**Q: Do I need to install pgAdmin?**
A: No, it's optional. You can use psql, VS Code extension, or DBeaver instead.

**Q: Can I use a cloud database?**
A: Yes! Just change the DATABASE_URL in .env.local to your cloud provider's connection string.

**Q: Is this production-ready?**
A: Yes, the setup includes proper error handling, connection pooling, and type safety.

**Q: What if I want to use a different database?**
A: The setup is specific to PostgreSQL, but similar patterns work for MySQL, SQLite, etc.

---

## 🚨 Troubleshooting

Most issues are covered in the individual documentation files. Common ones:

| Error | Solution |
|-------|----------|
| "could not connect" | Start PostgreSQL: `brew services start postgresql@16` |
| "role does not exist" | Create user (see `01-SETUP-GUIDE.md`) |
| "database does not exist" | Initialize: `node scripts/init-db.js` |
| "password authentication failed" | Check DATABASE_URL in `.env.local` |

See the specific guide for more troubleshooting tips.

---

## 📞 Support

Each documentation file has:
- ✅ Step-by-step instructions
- ✅ Code examples
- ✅ Troubleshooting section
- ✅ Next steps

---

## 🎓 Learning Path

**Beginner:**
1. Read `00-GETTING-STARTED.md`
2. Read `01-SETUP-GUIDE.md`
3. Start with `03-DATABASE-INTERFACES.md` for GUI
4. Check `05-QUICK-REFERENCE.md` when needed

**Intermediate:**
1. Read `02-CONNECTING.md`
2. Focus on `04-IMPLEMENTATION-GUIDE.md`
3. Use `05-QUICK-REFERENCE.md` for lookup

**Advanced:**
1. Explore `04-IMPLEMENTATION-GUIDE.md` deeply
2. Create custom API routes
3. Implement complex queries
4. Use transactions for multi-step operations

---

## 📝 Notes

- All documentation assumes PostgreSQL 16+
- macOS examples use Homebrew (adjust for your system)
- Node.js must be installed (you already have it)
- Next.js 16+ is being used (you already have it)

---

## 🔗 External Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## ✅ Checklist

- [ ] Read `00-GETTING-STARTED.md`
- [ ] PostgreSQL is installed and running
- [ ] Database is initialized with `node scripts/init-db.js`
- [ ] You can connect using one of the methods in `02-CONNECTING.md`
- [ ] You've chosen a GUI tool from `03-DATABASE-INTERFACES.md` (optional)
- [ ] You understand the helper functions from `04-IMPLEMENTATION-GUIDE.md`
- [ ] You've bookmarked `05-QUICK-REFERENCE.md` for quick lookup

---

**Happy database development! 🚀**
