# Database Management Interfaces for PostgreSQL

A database management interface (GUI) makes it easier to view, edit, and manage your data without writing SQL commands.

---

## 1. pgAdmin ⭐ Most Popular

**Free | Web-based | Comprehensive**

### Installation (macOS)
```bash
brew install pgadmin4
brew services start pgadmin4
```

### Access
- Open browser: http://localhost:5050
- Default login:
  - Email: `pgadmin4@pgadmin.org`
  - Password: `admin`

### Create Connection
1. Right-click "Servers" in left sidebar
2. Select "Register" → "Server"
3. Fill in General tab:
   - **Name:** mindful_dev
4. Fill in Connection tab:
   - **Host name:** localhost
   - **Port:** 5432
   - **Username:** mindful_user
   - **Password:** mindful_dev_password
   - **Database:** mindful_dev
5. Click "Save"

### Features
✅ Query editor with syntax highlighting
✅ Visual table browser
✅ User & permission management
✅ Backup & restore
✅ Performance monitoring
✅ Multiple server connections

### Best For
Production databases, team collaboration, advanced features

---

## 2. DBeaver ⭐ Most User-Friendly

**Free | Desktop app | Beautiful UI**

### Installation
1. Download: https://dbeaver.io/download/
2. Install and open

### Create Connection
1. Menu: Database → New Database Connection
2. Select "PostgreSQL"
3. Click "Next >"
4. Fill in:
   - **Server Host:** localhost
   - **Port:** 5432
   - **Database:** mindful_dev
   - **Username:** mindful_user
   - **Password:** mindful_dev_password
5. Test connection: "Test Connection"
6. Click "Finish"

### Features
✅ Visual query builder (great for beginners)
✅ Entity-relationship diagrams (ERD)
✅ Data export/import (CSV, Excel, JSON)
✅ SQL beautifier & formatter
✅ Database comparison
✅ Mock data generation

### Best For
General use, learning SQL, data exploration

---

## 3. VS Code Extension ⭐ Easiest (if you use VS Code)

**Free | Built into your editor | Quick access**

### Installation
1. Open VS Code
2. Extensions sidebar (Cmd+Shift+X or Ctrl+Shift+X)
3. Search "PostgreSQL"
4. Install "PostgreSQL" by Chris Kolkman

### Create Connection
1. Click PostgreSQL icon in sidebar (bottom of activity bar)
2. Click "+" to add connection
3. Enter connection string:
   ```
   postgresql://mindful_user:mindful_dev_password@localhost:5432/mindful_dev
   ```
4. Press Enter

### Use It
1. Expand connection in sidebar
2. Browse: Tables → Columns
3. Right-click table:
   - "Select Top 1000" → View data
   - "New Query" → Write SQL
4. Click play button to execute queries

### Features
✅ Quick access from VS Code
✅ Table browser
✅ Query editor
✅ SQL syntax highlighting
✅ Connection status indicator

### Best For
Quick queries while coding, integrated workflow

---

## 4. TablePlus (Premium)

**$69 one-time | Desktop app | Lightning fast**

### Installation
1. Download: https://tableplus.com/
2. Purchase or trial
3. Open and create connection with same details

### Features
✅ Extremely fast and responsive
✅ Beautiful, modern interface
✅ SSH tunneling
✅ Excellent team features
✅ Relationship visualization

### Best For
Power users, speed-focused developers, premium support

---

## 5. Adminer (Self-hosted)

**Free | Web-based | Single PHP file**

### Installation
```bash
# Download
curl https://www.adminer.org/latest.php -o adminer.php

# Run with PHP (if installed)
php -S localhost:8080 adminer.php

# Access: http://localhost:8080
```

### Features
✅ No installation required (single file)
✅ Supports multiple databases
✅ SQL query editor
✅ Data export

### Best For
Quick testing, minimal setup

---

## 6. DataGrip (Premium by JetBrains)

**$15/month or $89/year | Desktop | Professional**

### Features
✅ Professional IDE for databases
✅ Advanced debugging
✅ Smart code completion
✅ Excellent for large projects

### Best For
Large enterprises, professional teams

---

## Comparison Table

| Tool | Cost | Type | Best For | Setup Time |
|------|------|------|----------|-----------|
| **pgAdmin** | Free | Web | Production | 5 min |
| **DBeaver** | Free | Desktop | General use | 5 min |
| **VS Code Ext** | Free | Extension | Quick queries | 2 min |
| **TablePlus** | $69 | Desktop | Speed | 5 min |
| **DataGrip** | $15/mo | Desktop | Professionals | 10 min |
| **Adminer** | Free | Web | Testing | 5 min |

---

## My Recommendations

### Quick Answer: "Which should I use?"

- **Just getting started?** → **DBeaver** (easiest)
- **Already use VS Code?** → **VS Code Extension** (fastest)
- **Production database?** → **pgAdmin** (most features)
- **Want it all?** → **TablePlus** (best experience)
- **Tight budget?** → **DBeaver** (free & powerful)

---

## Quick Setup Checklist

### For DBeaver
- [ ] Download from dbeaver.io
- [ ] Install application
- [ ] Create new PostgreSQL connection
- [ ] Enter localhost, mindful_dev, mindful_user
- [ ] Test connection
- [ ] Start exploring!

### For VS Code Extension
- [ ] Install PostgreSQL extension
- [ ] Click PostgreSQL icon
- [ ] Add connection with your DATABASE_URL
- [ ] Browse tables in sidebar

### For pgAdmin
- [ ] Install: `brew install pgadmin4`
- [ ] Start: `brew services start pgadmin4`
- [ ] Open: http://localhost:5050
- [ ] Create server connection
- [ ] Start managing data

---

## Common Tasks

### View All Users
1. Navigate to `users` table
2. Right-click → "Select Top 1000"
3. See all user data

### Insert Test Data
1. Right-click table → "Insert New Row"
2. Fill in values
3. Save

### Write Custom Query
1. Right-click connection/database
2. Select "New Query" or "SQL Query"
3. Write SQL
4. Execute
5. View results

### Export Data
1. Right-click table
2. Select "Export"
3. Choose format (CSV, Excel, JSON)
4. Save file

---

## Next Steps

- **Choose your tool** from the list above
- **Follow setup instructions** for that tool
- **Go to 04-IMPLEMENTATION-GUIDE.md** to learn how to use the database in code
- **Check 05-QUICK-REFERENCE.md** for command reference

Happy database exploring! 🚀
