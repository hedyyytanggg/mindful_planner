# 📚 Documentation Index

Welcome to the **Mindful** project documentation! This is your central hub for understanding the system architecture, getting started with development, and using the application.

## 🎯 Start Here

Choose based on what you want to do:

### 👤 I'm a User
- [**README.md**](README.md) - Project overview and quick start
- [**SETUP_GUIDE.md**](SETUP_GUIDE.md) - Installation and configuration

### 👨‍💻 I'm a Developer
- [**ARCHITECTURE.md**](ARCHITECTURE.md) - System design and data flow
- [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md) - Complete API reference
- [**DATABASE_SCHEMA_COMPLETE.md**](DATABASE_SCHEMA_COMPLETE.md) - Database structure

### 🚀 I Want to Deploy
- [**DEPLOYMENT.md**](DEPLOYMENT.md) - Production deployment guide
- [**development.md**](development.md) - Development workflow

---

## 📖 Core Documentation

### 🚀 Getting Started
| Document | Purpose | Audience |
|----------|---------|----------|
| [**README.md**](README.md) | Project overview, features, quick start | Everyone |
| [**SETUP_GUIDE.md**](SETUP_GUIDE.md) | Step-by-step installation and configuration | Developers |
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | System design with diagrams and data flow | Developers |

### 🔌 API Reference
| Document | Purpose | Audience |
|----------|---------|----------|
| [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md) | Complete API endpoints with examples | Developers |
| [**DATABASE_SCHEMA_COMPLETE.md**](DATABASE_SCHEMA_COMPLETE.md) | Database tables, columns, and relationships | Developers |

### 📊 Data & Storage
| Document | Purpose | Audience |
|----------|---------|----------|
| [**DATA_GUIDE.md**](DATA_GUIDE.md) | Understanding the data structure | Developers |
| [**DATA_STORAGE.md**](DATA_STORAGE.md) | Database connection and storage details | Developers |
| [**DATA_CHEATSHEET.md**](DATA_CHEATSHEET.md) | Quick reference for queries | Developers |

### 🚢 Operations & Deployment
| Document | Purpose | Audience |
|----------|---------|----------|
| [**DEPLOYMENT.md**](DEPLOYMENT.md) | Production deployment (Vercel + Neon) | DevOps/Developers |
| [**development.md**](development.md) | Local development workflow | Developers |

### 🛠️ Technical References
| Document | Purpose | Audience |
|----------|---------|----------|
| [**POSTGRES_QUICK_REF.md**](POSTGRES_QUICK_REF.md) | PostgreSQL queries cheatsheet | Developers |
| [**POSTGRES_SETUP.md**](POSTGRES_SETUP.md) | PostgreSQL installation and setup | Developers |
| [**POSTGRES_SETUP_SUMMARY.md**](POSTGRES_SETUP_SUMMARY.md) | Summary of PostgreSQL configuration | Developers |
| [**POSTGRES_IMPLEMENTATION.md**](POSTGRES_IMPLEMENTATION.md) | Implementation details of PostgreSQL integration | Developers |

### ♿ Accessibility & Compliance
| Document | Purpose | Audience |
|----------|---------|----------|
| [**ACCESSIBILITY_AUDIT.md**](ACCESSIBILITY_AUDIT.md) | Accessibility audit results | Developers/QA |
| [**ACCESSIBILITY_SUMMARY.md**](ACCESSIBILITY_SUMMARY.md) | Accessibility features summary | Developers/QA |
| [**ACCESSIBILITY_IMPLEMENTATION.md**](ACCESSIBILITY_IMPLEMENTATION.md) | How accessibility is implemented | Developers |

### 📋 Additional Guides
| Document | Purpose | Audience |
|----------|---------|----------|
| [**requirement.md**](requirement.md) | Project requirements and specifications | Everyone |
| [**ANSWER_DATA_LOCATION.md**](ANSWER_DATA_LOCATION.md) | FAQ about data location | Users/Developers |
| [**HYDRATION_MISMATCH_FIXES.md**](HYDRATION_MISMATCH_FIXES.md) | Solutions for Next.js hydration issues | Developers |
| [**ui.md**](ui.md) | UI component documentation | Developers |

---

## 🏗️ Architecture Overview

The Mindful application is built with a modern tech stack:

```
┌─────────────────────────────────────────┐
│  React 19 + Next.js 16 (Frontend)       │
│  - 7 Planner Components                 │
│  - Auto-save with 2-second debounce    │
│  - localStorage backup                  │
└──────────────┬──────────────────────────┘
               │ REST API
┌──────────────▼──────────────────────────┐
│  Next.js API Routes (Backend)           │
│  - Authentication (NextAuth)             │
│  - Plans CRUD operations                │
│  - Row-level security                   │
└──────────────┬──────────────────────────┘
               │ SQL Queries
┌──────────────▼──────────────────────────┐
│  PostgreSQL (Database)                  │
│  - 10 normalized tables                 │
│  - 8 parallel query execution           │
│  - ~50ms total load time                │
└─────────────────────────────────────────┘
```

See [**ARCHITECTURE.md**](ARCHITECTURE.md) for detailed diagrams.

---

## 🗄️ Database Structure

The app uses PostgreSQL with a normalized schema:

- **2 Core Tables:** `users`, `daily_plans`
- **7 Detail Tables:** `deep_work_zones`, `quick_wins`, `make_it_happen`, `recharge_zones`, `little_joys`, `reflections_today`, `focus_tomorrow`
- **10 Total Tables** with proper foreign keys and constraints

See [**DATABASE_SCHEMA_COMPLETE.md**](DATABASE_SCHEMA_COMPLETE.md) for full details.

---

## 📡 API Endpoints

### Authentication
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User logout
- `GET /auth/session` - Get current session

### Plans
- `GET /api/plans/[date]` - Retrieve plan for date
- `PATCH /api/plans/[date]` - Update plan for date

See [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md) for request/response examples.

---

## 🔐 Security Features

- ✅ Email/password authentication with SHA256 hashing
- ✅ JWT sessions in HTTP-only cookies
- ✅ CSRF protection via NextAuth
- ✅ Row-level security (users access only their own data)
- ✅ Type-safe with TypeScript
- ✅ Input validation on all API endpoints

---

## 🚀 Key Features

### Daily Planning
- Deep Work Zone - Focused work sessions
- Quick Wins - Achievable daily goals
- Make It Happen - Main objective
- Recharge Zone - Rest activities
- Little Joys - Small happy moments
- Reflection for Today - End-of-day notes
- Focus for Tomorrow - Tomorrow's priorities

### Technical Features
- 🔐 Secure user authentication
- 💾 Auto-save (2-second debounce)
- 🔄 Offline support with localStorage
- 📊 View any date in history
- 🎨 Responsive TailwindCSS design
- ⚡ Optimized with 8 parallel queries

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | React | 19 |
| Framework | Next.js | 16 |
| Language | TypeScript | 5.6 |
| Styling | TailwindCSS | 3.4 |
| Auth | NextAuth.js | 4.24 |
| Database | PostgreSQL | 16+ |
| DB Client | pg | 8.11 |
| Build Tool | Turbopack | Latest |

---

## 📱 Quick Commands

```bash
# Installation
npm install

# Development
npm run dev

# Build for production
npm run build
npm start

# Type checking
npx tsc --noEmit
```

---

## ❓ Common Questions

**Q: Where is my data stored?**
A: In PostgreSQL database. See [DATA_GUIDE.md](DATA_GUIDE.md) for details.

**Q: How do I set up the development environment?**
A: Follow [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step instructions.

**Q: How do I deploy to production?**
A: See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel + Neon setup.

**Q: What are the API endpoints?**
A: Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference.

**Q: How does auto-save work?**
A: Components debounce changes for 2 seconds, then PATCH to API. See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 📞 Support & Troubleshooting

- **Setup issues**: See [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
- **Database issues**: Check [POSTGRES_SETUP.md](POSTGRES_SETUP.md)
- **API issues**: Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) error handling
- **Development issues**: Consult [development.md](development.md)

---

## 🎓 Learning Path

If you're new to the project, follow this path:

1. **[README.md](README.md)** - Understand what the app does (5 min)
2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Install and run locally (15 min)
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Learn how it works (15 min)
4. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Understand the API (10 min)
5. **[DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md)** - Learn the data model (10 min)
6. **[development.md](development.md)** - Start contributing (ongoing)

---

## 📝 Document Maintenance

**Last Updated:** December 12, 2025

**Active Documentation:**
- ✅ README.md - Updated with current features
- ✅ SETUP_GUIDE.md - Newly created with comprehensive setup steps
- ✅ ARCHITECTURE.md - Updated for PostgreSQL architecture
- ✅ API_DOCUMENTATION.md - Newly created with all endpoints
- ✅ DATABASE_SCHEMA_COMPLETE.md - Current schema documentation
- ✅ DOCS_INDEX.md (this file) - Updated as central hub

**Maintained Documentation:**
- ✅ development.md - Development workflow
- ✅ requirement.md - Project requirements
- ✅ DATA_GUIDE.md - Data guide
- ✅ DATA_STORAGE.md - Storage details

---

**Made with ❤️ for clarity and developer experience**
