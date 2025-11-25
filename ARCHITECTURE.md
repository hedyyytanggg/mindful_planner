# Data Flow Architecture

## Current MVP Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   MINDFUL DAILY PLANNER MVP                 │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   React Components   │
│  (Planner Page)      │
│  - DeepWorkZone      │
│  - QuickWins         │
│  - LittleJoys        │
│  - Reflection        │
│  - etc...            │
└──────────────┬───────┘
               │
               │ setState() 
               │ (auto-triggers save)
               ↓
        ┌──────────────┐
        │  Component   │
        │    State     │
        │  (In Memory) │
        └──────────────┘
               │
               │ useEffect 
               │ (on state change)
               ↓
     ┌──────────────────────┐
     │  savePlanForDate()    │
     │  savePlanForDate()    │
     │  JSON.stringify()     │
     └──────┬───────────────┘
            │
            ↓
┌────────────────────────────────────────┐
│    Browser Local Storage (5-10 MB)     │
│                                        │
│  plan_2025-11-25 → { JSON object }    │
│  plan_2025-11-24 → { JSON object }    │
│  plan_2025-11-23 → { JSON object }    │
│  app_settings    → { JSON object }    │
│                                        │
│  💾 Persists until cache cleared       │
└────────────────────────────────────────┘
```

## Data Save Flow

```
User Action              Auto-Save Trigger
    │                          │
    ├─ Add Task ──────────────┐│
    ├─ Edit Task ──────────────││
    ├─ Mark Complete ────────┐ ││
    ├─ Delete Task ────────┐ │ ││
    ├─ Change Settings ──┐ │ │ ││
    └─ Switch Date ────┐ │ │ │ ││
                       │ │ │ │ ││
                       ↓ ↓ ↓ ↓ ↓↓
                    useEffect Hook
                         │
                         ↓
                   setState Updates
                         │
                         ↓
                  savePlanForDate()
                         │
                         ↓
                JSON.stringify(state)
                         │
                         ↓
         localStorage.setItem(`plan_${date}`, json)
                         │
                         ↓
                    ✅ SAVED
```

## Data Load Flow

```
Page Initialization
        │
        ├─ Component Mounts
        │
        ├─ useEffect runs once
        │
        ├─ Set currentDate = today
        │
        ├─ loadPlanForDate(today)
        │       │
        │       ├─ localStorage.getItem(`plan_${date}`)
        │       │
        │       ├─ IF found:
        │       │   └─ JSON.parse() → setDeepWork, setQuickWins, etc.
        │       │
        │       └─ IF not found:
        │           └─ Initialize empty arrays
        │
        ├─ Render UI with loaded data
        │
        └─ Ready for user input
```

## Date Navigation Flow

```
User clicks "Prev" button
        │
        ├─ goToPreviousDay()
        │
        ├─ calculateNewDate()
        │
        ├─ handleDateChange(newDate)
        │       │
        │       ├─ savePlanForDate(currentDate)  ← Save current before switching
        │       │
        │       ├─ setCurrentDate(newDate)       ← Update date state
        │       │
        │       └─ loadPlanForDate(newDate)      ← Load new date's plan
        │
        └─ UI re-renders with new date's data
```

## Component State to Storage Mapping

```
React Component State                  localStorage Key
────────────────────────────────────────────────────────
deepWork: DeepWorkItem[]       ┐
quickWins: QuickWinItem[]      │
makeItHappen: Item | null      │
recharge: RechargeItem | null  ├─→ plan_2025-11-25
littleJoys: string[]           │
reflection: string | null      │
focusTomorrow: string | null   ┘

settings: {                            
  timezone: string,            ┐
  theme: string,               │
  notifications: boolean,      ├─→ app_settings
  emailDigest: boolean,        │
  dailyReminder: boolean,      │
  reminderTime: string         ┘
}
```

## Future: Database Architecture (Phase 2)

```
┌──────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  React Frontend  │
│  (Browser)       │
└────────┬─────────┘
         │ HTTP/REST
         ↓
┌────────────────────────────────────────┐
│      Next.js API Routes                │
│  /app/api/plans/route.ts               │
│  /app/api/zones/route.ts               │
│  /app/api/settings/route.ts            │
└────────┬─────────────────────────────┘
         │ Prisma ORM
         ↓
┌────────────────────────────────────────┐
│      PostgreSQL Database               │
│  Tables:                               │
│  - users                               │
│  - daily_plans                         │
│  - deep_work_zones                     │
│  - quick_wins                          │
│  - recharge_zones                      │
│  - little_joys                         │
│  - reflections_today                   │
│  - focus_tomorrow                      │
│  - sessions                            │
└────────────────────────────────────────┘
```

## Data Persistence Comparison

```
CURRENT (MVP)                FUTURE (Production)
──────────────────────────────────────────────────
Browser Local Storage    →    PostgreSQL Database
  5-10 MB limit         →    Unlimited
  Single browser        →    Multi-device sync
  No backup             →    Automatic backup
  No authentication     →    User accounts
  Session-based         →    Permanent
  JSON files            →    Structured tables
  Fast reads            →    Optimized queries
  No sharing            →    Team collaboration
```

## Storage Timeline

```
MVP Phase (Now)
├─ localStorage ✓
├─ JSON export ✓
├─ Auto-save ✓
└─ Per-date storage ✓

Phase 2: Database Integration
├─ API endpoints → /api/plans
├─ PostgreSQL setup → DATABASE_URL configured
├─ User authentication → NextAuth.js
├─ Cloud backup → Automatic
└─ Multi-device sync → Enabled

Phase 3: Advanced Features
├─ Team collaboration → Shared plans
├─ Advanced analytics → Trend analysis
├─ Mobile app → Native support
└─ Offline mode → Service Worker
```

---

**Key Insight:** 
Your data is safely stored in browser localStorage with automatic saving. When ready, 
we'll migrate to PostgreSQL without losing any existing data - just need to add API layer!
