# Connecting to Your PostgreSQL Database

## Connection Methods

There are several ways to connect to and interact with your PostgreSQL database. Choose the one that works best for you.

---

## Method 1: Command Line (psql)

### Basic Connection
```bash
psql -U mindful_user -d mindful_dev -h localhost
```

**Break down:**
- `-U mindful_user` → Username
- `-d mindful_dev` → Database name
- `-h localhost` → Host (your computer)

### Once Connected

View data:
```sql
SELECT * FROM users;
SELECT * FROM daily_plans;
SELECT * FROM app_settings;
```

List all tables:
```sql
\dt
```

Describe a table:
```sql
\d daily_plans
```

Quit psql:
```sql
\q
```

---

## Method 2: From Your Node.js Code

### Test Connection
```typescript
import { query } from '@/lib/db';

async function testConnection() {
  try {
    const { rows } = await query('SELECT NOW()');
    console.log('✅ Connected at:', rows[0].now);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

### Use Helper Functions
```typescript
import { getUserByEmail, getOrCreateDailyPlan } from '@/lib/dbHelpers';

// Get a user
const user = await getUserByEmail('john@example.com');

// Get or create a plan
const plan = await getOrCreateDailyPlan(user.id, '2025-12-10');

console.log(plan);
```

---

## Method 3: VS Code Extension

### Install Extension
1. Open VS Code
2. Go to Extensions (Cmd+Shift+X / Ctrl+Shift+X)
3. Search "PostgreSQL"
4. Install "PostgreSQL" by Chris Kolkman

### Add Connection
1. Click the PostgreSQL icon in the sidebar
2. Click "+" to add connection
3. Enter connection string:
   ```
   postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev
   ```
4. Press Enter

### Use It
1. Expand your connection in the sidebar
2. Browse tables, views, etc.
3. Right-click a table → "Select Top 1000"
4. Write queries in the editor
5. Click the play button to execute

---

## Method 4: Verify Connection with CLI

### Quick Connection Test
```bash
pg_isready -U mindful_user -h localhost
```

**Output if connected:**
```
localhost:5432 - accepting connections
```

**Output if not connected:**
```
localhost:5432 - rejecting connections
```

### Check Connection Status
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

---

## Connection Details Reference

| Property | Value |
|----------|-------|
| **Host** | localhost |
| **Port** | 5432 |
| **Username** | mindful_user |
| **Password** | mindful_dev_password |
| **Database** | mindful_dev |
| **Connection String** | `postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev` |

---

## Database Structure

### Tables

**users**
```
id, email, name, password_hash, timezone, created_at, updated_at
```

**daily_plans**
```
id, user_id, plan_date, deep_work, quick_wins, make_it_happen, 
recharge_zone, little_joys, reflection, focus_tomorrow, created_at, updated_at
```

**deep_work_zones**
```
id, daily_plan_id, title, time_estimate, notes, completed, created_at, updated_at
```

**quick_wins**
```
id, daily_plan_id, title, completed, created_at, updated_at
```

**app_settings**
```
id, user_id, theme, notifications_enabled, email_digest_enabled, 
daily_reminder_enabled, daily_reminder_time, created_at, updated_at
```

---

## Troubleshooting Connection Issues

### "could not connect to server"
```bash
# Make sure PostgreSQL is running
brew services start postgresql@16

# Check status
pg_isready -U mindful_user -h localhost
```

### "FATAL: role 'mindful_user' does not exist"
```bash
# Create the user
psql postgres
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
\q
```

### "database 'mindful_dev' does not exist"
```bash
# Initialize database
node scripts/init-db.js
```

### "password authentication failed"
Check your credentials:
```bash
# Default credentials are:
# Username: mindful_user
# Password: mindful_dev_password
# Database: mindful_dev

# Update .env.local if needed:
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
```

### "Connection refused"
PostgreSQL might be on a different port:
```bash
# Check which port PostgreSQL is using
psql -U mindful_user -d mindful_dev -h localhost -p 5432
```

---

## Next Steps

- **Want a GUI?** → Go to `03-DATABASE-INTERFACES.md`
- **Ready to code?** → Go to `04-IMPLEMENTATION-GUIDE.md`
- **Need quick commands?** → Go to `05-QUICK-REFERENCE.md`
