# 📡 API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### POST /auth/signin
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": "abc123def456ghi",
    "email": "user@example.com",
    "name": "John Doe",
    "timezone": "America/New_York"
  }
}
```

**Errors:**
- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Missing email or password

---

### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Smith"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": "xyz789jkl012mno",
    "email": "newuser@example.com",
    "name": "Jane Smith",
    "timezone": "UTC"
  }
}
```

**Errors:**
- `400 Bad Request`: Email already exists or missing fields
- `400 Bad Request`: Password too weak
- `500 Internal Server Error`: Database error

---

### POST /auth/signout
Logout and destroy session.

**Request:**
```bash
POST /auth/signout
```

**Response (200 OK):**
```json
{
  "ok": true,
  "message": "Signed out successfully"
}
```

---

### GET /auth/session
Get current user's session and information.

**Response (200 OK):**
```json
{
  "user": {
    "id": "abc123def456ghi",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expires": "2025-12-19T12:34:56Z"
}
```

**Response (401 Unauthorized):**
```json
null
```

---

## Plans Endpoints

### GET /plans/[date]
Fetch a plan for a specific date.

**Query Parameters:**
- `date` (path parameter): Date in format `YYYY-MM-DD` (e.g., `2025-12-12`)
- `userId` (query parameter): User ID from session

**Request:**
```bash
GET /api/plans/2025-12-12?userId=abc123def456ghi
```

**Response (200 OK):**
```json
{
  "id": "plan_abc123",
  "userId": "abc123def456ghi",
  "planDate": "2025-12-12",
  "deep_work": [
    {
      "id": "dw_001",
      "planId": "plan_abc123",
      "title": "Write documentation",
      "timeEstimate": 120,
      "notes": "Complete API docs",
      "completed": false,
      "createdAt": "2025-12-12T09:00:00Z",
      "updatedAt": "2025-12-12T09:00:00Z"
    }
  ],
  "quick_wins": [
    {
      "id": "qw_001",
      "planId": "plan_abc123",
      "title": "Code review",
      "completed": true,
      "createdAt": "2025-12-12T10:30:00Z",
      "updatedAt": "2025-12-12T10:30:00Z"
    }
  ],
  "make_it_happen": {
    "id": "mih_001",
    "planId": "plan_abc123",
    "task": "Deploy to production",
    "completed": false,
    "createdAt": "2025-12-12T08:00:00Z",
    "updatedAt": "2025-12-12T08:00:00Z"
  },
  "recharge_zone": [
    {
      "id": "rz_001",
      "planId": "plan_abc123",
      "activityId": "Take a Walk",
      "customActivity": null,
      "completed": true,
      "completedAt": "2025-12-12T12:00:00Z",
      "createdAt": "2025-12-12T12:00:00Z",
      "updatedAt": "2025-12-12T12:00:00Z"
    }
  ],
  "little_joys": [
    "Coffee with a friend",
    "Completed a hard task"
  ],
  "reflection": "Good day overall. Learned about database optimization.",
  "focus_tomorrow": "Focus on testing and bug fixes",
  "createdAt": "2025-12-12T08:00:00Z",
  "updatedAt": "2025-12-12T15:30:00Z"
}
```

**Errors:**
- `400 Bad Request`: Missing userId or date
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Database error

**Notes:**
- If plan doesn't exist, it's automatically created
- Returns empty arrays for detail tables if no records exist
- Returns null for reflection/focus_tomorrow if not set

---

### PATCH /plans/[date]
Update/save a plan for a specific date.

**Query Parameters:**
- `date` (path parameter): Date in format `YYYY-MM-DD`
- `userId` (query parameter): User ID from session

**Request Body:**
```json
{
  "plan_date": "2025-12-12",
  "deep_work": [
    {
      "title": "Morning standup",
      "timeEstimate": 30,
      "notes": "Team meeting",
      "completed": false
    }
  ],
  "quick_wins": [
    {
      "title": "Reply to emails",
      "completed": true
    }
  ],
  "make_it_happen": {
    "task": "Design new UI",
    "completed": false
  },
  "recharge_zone": [
    {
      "activityId": "Meditate",
      "customActivity": null,
      "completed": true
    }
  ],
  "little_joys": [
    "Sunny weather",
    "Good lunch"
  ],
  "reflection": "Productive day",
  "focus_tomorrow": "Bug fixes"
}
```

**Response (200 OK):**
```json
{
  "id": "plan_abc123",
  "userId": "abc123def456ghi",
  "planDate": "2025-12-12",
  "deep_work": [...],
  "quick_wins": [...],
  "make_it_happen": {...},
  "recharge_zone": [...],
  "little_joys": [...],
  "reflection": "Productive day",
  "focus_tomorrow": "Bug fixes",
  "createdAt": "2025-12-12T08:00:00Z",
  "updatedAt": "2025-12-12T15:45:00Z"
}
```

**Errors:**
- `400 Bad Request`: Missing userId or date
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Database error

**Notes:**
- Creates plan if it doesn't exist
- Replaces all detail records (deletes old ones first)
- All detail items get auto-generated IDs
- timestamps are set server-side
- Returns complete updated plan

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message",
  "status": 400,
  "details": "Additional error details"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (not logged in) |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

- No rate limiting currently implemented
- Auto-save debounced to 2 seconds client-side
- Recommended: Max 1 PATCH request per 2 seconds

---

## Authentication

All plan endpoints (`/plans/*`) require:
1. User to be logged in (session cookie)
2. Valid `userId` query parameter matching session user

---

## Data Types

### DailyPlan Object
```typescript
{
  id: string;              // VARCHAR(25)
  userId: string;          // VARCHAR(25) 
  planDate: string;        // DATE (YYYY-MM-DD)
  deep_work: DeepWorkZone[];
  quick_wins: QuickWin[];
  make_it_happen: MakeItHappen | null;
  recharge_zone: RechargeZone[];
  little_joys: string[];           // Array of content strings
  reflection: string | null;
  focus_tomorrow: string | null;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

### DeepWorkZone
```typescript
{
  id: string;
  planId: string;
  title: string;
  timeEstimate: number | null;    // Minutes
  notes: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### QuickWin
```typescript
{
  id: string;
  planId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### MakeItHappen
```typescript
{
  id: string;
  planId: string;
  task: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### RechargeZone
```typescript
{
  id: string;
  planId: string;
  activityId: string | null;       // Predefined activity ID
  customActivity: string | null;    // Custom activity text
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## Examples

### Example: Create a new plan for today

```bash
curl -X PATCH http://localhost:3000/api/plans/2025-12-12?userId=abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "deep_work": [
      {
        "title": "Review code",
        "timeEstimate": 90,
        "completed": false
      }
    ],
    "quick_wins": [
      {"title": "Standup", "completed": true}
    ],
    "reflection": "Great progress today",
    "focus_tomorrow": "Testing and deployment"
  }'
```

### Example: Get plan for yesterday

```bash
curl http://localhost:3000/api/plans/2025-12-11?userId=abc123
```

---

**Last Updated:** December 12, 2025
