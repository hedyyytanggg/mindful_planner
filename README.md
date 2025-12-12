# 🧠 Mindful - Daily Planner & Productivity App

A modern web application for daily planning, goal tracking, and mindful productivity. Built with **Next.js 16**, **React 19**, **PostgreSQL**, and **TypeScript**.

## ✨ Features

### Daily Planning
- **Deep Work Zone** - Schedule focused, uninterrupted work sessions
- **Quick Wins** - List achievable goals for the day
- **Make It Happen** - Track main objective/priority
- **Recharge Zone** - Plan activities to recharge and rest
- **Little Joys** - Capture small moments of happiness
- **Reflection for Today** - End-of-day reflection and notes
- **Focus for Tomorrow** - Plan priorities for next day

### User Features
- 🔐 Secure authentication with email/password (SHA256 hashing)
- 📱 Responsive design for desktop and mobile
- 💾 Auto-save with 2-second debounce
- 🔄 Offline support with localStorage backup
- 📊 View plans for any date
- 🎨 Clean, modern TailwindCSS interface

### Technical Highlights
- PostgreSQL database with normalized schema (10 tables)
- REST API with proper error handling
- Type-safe with TypeScript
- Row-level security (users access only their data)
- 8 parallel database queries for optimal performance (~50ms load time)
- NextAuth.js for session management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindful.git
   cd mindful
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/mindful
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Initialize the database**
   ```bash
   createdb mindful
   psql -d mindful -f prisma/init.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md).

---

## 📁 Project Structure

```
mindful/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (auth, plans)
│   ├── planner/           # Main planner page
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── src/
│   ├── components/        # React components
│   │   ├── Common/        # Shared components (Button, Input, etc.)
│   │   └── Planner/       # Planner-specific components
│   └── lib/               # Database & utilities
├── prisma/                # Database schema & migrations
├── public/                # Static files
└── package.json           # Dependencies
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19 |
| **Framework** | Next.js | 16 |
| **Language** | TypeScript | 5.6 |
| **Styling** | TailwindCSS | 3.4 |
| **Auth** | NextAuth.js | 4.24 |
| **Database** | PostgreSQL | 16+ |
| **Client** | pg | 8.11 |
| **Build** | Turbopack | Latest |

---

## 🗄️ Database Schema

The application uses PostgreSQL with a normalized schema:

**Master Table:**
- `users` - User accounts with authentication
- `daily_plans` - Daily planning records

**Detail Tables (1-to-many with daily_plans):**
- `deep_work_zones` - Focused work sessions
- `quick_wins` - Quick wins/tasks
- `make_it_happen` - Main objective
- `recharge_zones` - Rest activities
- `little_joys` - Small happy moments
- `reflections_today` - Daily reflections
- `focus_tomorrow` - Tomorrow's priorities

All tables use string IDs (VARCHAR(25)) generated client-side for immediate UI response.

For complete schema details, see [DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md).

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints
- `POST /auth/signin` - User login
- `POST /auth/signup` - User registration
- `POST /auth/signout` - User logout
- `GET /auth/session` - Get current session

### Plans Endpoints
- `GET /api/plans/[date]` - Get plan for date (YYYY-MM-DD)
- `PATCH /api/plans/[date]` - Update plan for date

For complete API documentation with examples, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 🔄 Data Flow

### Saving Plan Data
```
User edits component → Local state updates → 2-second debounce → PATCH /api/plans/[date]
    → Data normalized to 7 tables → Response with complete plan → UI updates
```

### Loading Plan Data
```
User navigates to /planner → GET /api/plans/[date] → 8 parallel database queries
    → Data assembled into nested structure → React state updates → Components render
    → Total time: ~50ms
```

---

## 🔐 Authentication

- **Method**: Email/password with SHA256 hashing
- **Sessions**: JWT tokens stored in HTTP-only cookies
- **Protection**: CSRF protection via NextAuth
- **Security**: Row-level security (users access only their own data)

Protected route: `/planner` (redirects to `/login` if not authenticated)

---

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Step-by-step installation and configuration
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow diagrams
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[DATABASE_SCHEMA_COMPLETE.md](DATABASE_SCHEMA_COMPLETE.md)** - Detailed database schema
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - Documentation index

---

## 💻 Development

### Run Development Server
```bash
npm run dev
```
Server runs at http://localhost:3000 with hot reload enabled.

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_URL` (your production domain)
   - `NEXTAUTH_SECRET` (generate a new secure secret)

4. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running: `brew services start postgresql@16`
- Check `DATABASE_URL` in `.env.local`

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

**Build TypeScript Errors**
```bash
# Run type check to see all errors
npx tsc --noEmit
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting tips.

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For questions or issues:
- Check the [documentation](DOCS_INDEX.md)
- Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Open an issue on GitHub

---

**Made with ❤️ for mindful productivity**

Last Updated: December 12, 2025
