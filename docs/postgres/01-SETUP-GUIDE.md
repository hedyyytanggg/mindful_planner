# PostgreSQL Installation & Setup Guide

## 1. Install PostgreSQL

### macOS (Recommended: Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Verify installation:**
```bash
psql --version
pg_isready -U postgres
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for `postgres` user
4. Use pgAdmin from the installer

---

## 2. Create Database & User

### macOS/Linux (Command Line)

```bash
# Connect to PostgreSQL as superuser
psql postgres

# Then run these commands in psql:
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
CREATE DATABASE mindful_dev OWNER mindful_user;
ALTER USER mindful_user CREATEDB;
\q
```

### Windows (Using pgAdmin)
1. Open pgAdmin (installed with PostgreSQL)
2. Right-click "Databases" → Create → Database
3. Name: `mindful_dev`
4. Owner: Click dropdown, select "New..." 
5. Create user:
   - Username: `mindful_user`
   - Password: `mindful_dev_password`
   - Confirm password

---

## 3. Verify Connection

```bash
# Test connection
psql -U mindful_user -d mindful_dev -h localhost

# Should see:
# mindful_dev=>

# Exit
\q
```

---

## 4. Install Node Dependencies

```bash
cd /Users/hedytang/ai/mindful
npm install
```

**Packages added:**
- `pg` ^8.11.3
- `@types/pg` ^8.11.6

---

## 5. Initialize Database Schema

```bash
node scripts/init-db.js
```

**Expected output:**
```
📦 Initializing database...
📍 Database URL: postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev
✅ Database schema created successfully!
📊 Tables created:
  - users
  - daily_plans
  - deep_work_zones
  - quick_wins
  - app_settings

🎉 Ready to use! Start your app with: npm run dev
```

---

## 6. Verify Tables Were Created

```bash
psql -U mindful_user -d mindful_dev -h localhost

# In psql:
\dt                    # List all tables
SELECT COUNT(*) FROM users;  # Should be empty (0 rows)
\q
```

---

## 7. Update .env.local (Already Done)

Your `.env.local` should have:
```env
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="a-very-secret-key-change-in-production"
NODE_ENV="development"
```

**For production, change:**
- `DATABASE_URL` → Your production database URL
- `NEXTAUTH_SECRET` → Run: `openssl rand -base64 32`
- `NODE_ENV` → "production"

---

## Troubleshooting

### "brew: command not found"
Install Homebrew: https://brew.sh/

### "psql: command not found (macOS)"
```bash
# Add PostgreSQL to PATH
echo 'export PATH="/usr/local/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

### "could not connect to server"
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# If not running, start it
brew services start postgresql@16
```

### "FATAL: role does not exist"
The user wasn't created. Run:
```bash
psql postgres
CREATE USER mindful_user WITH PASSWORD 'mindful_dev_password';
CREATE DATABASE mindful_dev OWNER mindful_user;
\q
```

### "database does not exist"
The database wasn't created. Run:
```bash
node scripts/init-db.js
```

### "password authentication failed"
Check your DATABASE_URL in `.env.local`:
```env
# Should be:
DATABASE_URL="postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev"

# NOT:
DATABASE_URL="postgresql://postgres:password@localhost:5432/mindful_dev"
```

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U mindful_user -d mindful_dev -h localhost

# List databases
psql -U mindful_user -l

# Backup database
pg_dump mindful_dev > backup.sql

# Restore database
psql mindful_dev < backup.sql

# Drop database (careful!)
dropdb -U mindful_user mindful_dev

# Stop PostgreSQL (macOS)
brew services stop postgresql@16
```

---

## Next Steps

✅ PostgreSQL is installed and running
✅ Database and tables are created
✅ Connection is tested

Now go to:
- **02-CONNECTING.md** - How to connect and view your data
- **04-IMPLEMENTATION-GUIDE.md** - How to use it in your code
