# Security Best Practices & Guidelines

## Overview

This document outlines critical security considerations and best practices for the Mindful Planner application. Following these guidelines will help protect user data, prevent common vulnerabilities, and maintain a secure application.

---

## 🔐 Authentication & Authorization

### Current State
- Using NextAuth.js with CredentialsProvider
- JWT session strategy
- **⚠️ CRITICAL**: Currently using SHA256 for password hashing

### Required Improvements

#### 1. Password Hashing
**PRIORITY: CRITICAL**

```typescript
// ❌ CURRENT (INSECURE):
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// ✅ REQUIRED (SECURE):
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}
```

**Why bcrypt?**
- Adaptive: Can increase cost factor as hardware improves
- Built-in salting: Each hash is unique
- Resistant to rainbow table attacks
- Industry standard for password storage

#### 2. Password Requirements

Implement strong password policies:
- Minimum 12 characters (currently 6)
- Require mix of uppercase, lowercase, numbers, and special characters
- Check against common password lists
- Implement password strength indicator on signup

```typescript
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) errors.push('Password must be at least 12 characters');
    if (!/[a-z]/.test(password)) errors.push('Must contain lowercase letter');
    if (!/[A-Z]/.test(password)) errors.push('Must contain uppercase letter');
    if (!/\d/.test(password)) errors.push('Must contain number');
    if (!/[@$!%*?&]/.test(password)) errors.push('Must contain special character');
    
    return { valid: errors.length === 0, errors };
}
```

#### 3. Session Security

- Set secure session expiration (currently: 30 days)
- Implement session rotation on privilege escalation
- Add session invalidation on password change
- Consider implementing refresh tokens

```typescript
// In NextAuth config:
session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours instead of 30 days
    updateAge: 60 * 60, // Update session every hour
},
jwt: {
    maxAge: 24 * 60 * 60,
},
```

#### 4. Multi-Factor Authentication (MFA)

**Recommended for future implementation:**
- TOTP (Time-based One-Time Password)
- SMS verification
- Email verification codes
- Backup codes

---

## 🔑 Environment Variables & Secrets

### Critical Secrets

#### 1. NEXTAUTH_SECRET
```bash
# Generate secure secret:
openssl rand -base64 32

# Must be different for each environment
# NEVER commit to version control
# Rotate periodically (every 90 days recommended)
```

#### 2. DATABASE_URL
```bash
# Structure:
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Production requirements:
# - Use strong database password (32+ characters)
# - Enable SSL/TLS (sslmode=require)
# - Use connection pooling
# - Restrict database user permissions
```

#### 3. Environment Variable Security

**.env.local** (NEVER commit):
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
```

**.gitignore** (verify):
```gitignore
.env
.env.local
.env*.local
.env.production
```

**Vercel/Production:**
- Use environment variable encryption
- Enable secret scanning
- Use different secrets per environment
- Implement secret rotation policy

---

## 🛡️ Database Security

### SQL Injection Prevention

**Current State: GOOD** - Using parameterized queries

```typescript
// ✅ SECURE - Parameterized query
await query('SELECT * FROM users WHERE email = $1', [email]);

// ❌ NEVER DO THIS - String concatenation
await query(`SELECT * FROM users WHERE email = '${email}'`);
```

### Database Access Control

#### 1. Principle of Least Privilege

```sql
-- Create application-specific user (not superuser)
CREATE USER mindful_app WITH PASSWORD 'strong_password';

-- Grant only necessary permissions
GRANT SELECT, INSERT, UPDATE ON users TO mindful_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON memories TO mindful_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO mindful_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON plans TO mindful_app;

-- Revoke unnecessary permissions
REVOKE CREATE ON SCHEMA public FROM mindful_app;
REVOKE ALL ON DATABASE mindful_prod FROM PUBLIC;
```

#### 2. Connection Security

```typescript
// Production configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true, // Verify SSL certificates
        ca: process.env.DATABASE_CA_CERT, // Certificate authority
    },
    max: 20, // Maximum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
```

#### 3. Data Encryption

- **At Rest**: Enable PostgreSQL transparent data encryption
- **In Transit**: Always use SSL/TLS connections
- **Sensitive Fields**: Consider encrypting PII (email, phone, etc.)

---

## 🌐 API Security

### 1. Authentication Middleware

**Protect all API routes:**

```typescript
// api/memories/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 });
    }
    
    // Continue with authorized logic
}
```

### 2. Rate Limiting

**Prevent brute force and DoS attacks:**

```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

type RateLimitOptions = {
    interval: number; // Time window in ms
    uniqueTokenPerInterval: number; // Max unique tokens
};

export function rateLimit(options: RateLimitOptions) {
    const tokenCache = new LRUCache({
        max: options.uniqueTokenPerInterval || 500,
        ttl: options.interval || 60000,
    });

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, [1]);
                    resolve();
                } else {
                    tokenCount[0] += 1;
                    if (tokenCount[0] > limit) {
                        reject(new Error('Rate limit exceeded'));
                    } else {
                        tokenCache.set(token, tokenCount);
                        resolve();
                    }
                }
            }),
    };
}

// Usage in API routes:
const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    try {
        await limiter.check(10, ip); // 10 requests per minute
    } catch {
        return new Response('Too many requests', { status: 429 });
    }
    
    // Continue with logic
}
```

**Recommended Limits:**
- Login attempts: 5 per 15 minutes
- Signup: 3 per hour per IP
- API calls: 100 per minute per user
- Password reset: 3 per hour per email

### 3. Input Validation

**Use Zod for schema validation:**

```typescript
import { z } from 'zod';

const memorySchema = z.object({
    content: z.string().min(1).max(5000),
    category: z.enum(['gratitude', 'achievement', 'insight']),
    date: z.string().datetime(),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });
    
    try {
        const body = await req.json();
        const validated = memorySchema.parse(body); // Throws if invalid
        
        // Use validated data
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(JSON.stringify(error.errors), { status: 400 });
        }
        return new Response('Invalid input', { status: 400 });
    }
}
```

### 4. CORS Configuration

```typescript
// next.config.ts
const nextConfig = {
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL || 'http://localhost:3000' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ];
    },
};
```

---

## 🚫 Common Vulnerabilities Prevention

### 1. Cross-Site Scripting (XSS)

**Next.js automatically escapes content**, but be careful with:

```typescript
// ❌ DANGEROUS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE - Let React handle escaping
<div>{userContent}</div>

// If HTML is necessary, sanitize first:
import DOMPurify from 'isomorphic-dompurify';

<div dangerouslySetInnerHTML={{ 
    __html: DOMPurify.sanitize(userContent) 
}} />
```

### 2. Cross-Site Request Forgery (CSRF)

**Next.js API routes are protected** by default, but ensure:
- Use NextAuth's built-in CSRF protection
- Verify origin headers for sensitive operations
- Use SameSite cookies

```typescript
// NextAuth automatically includes CSRF tokens
// Ensure cookies are set securely:
cookies: {
    sessionToken: {
        name: `next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
        },
    },
},
```

### 3. Clickjacking Prevention

```typescript
// next.config.ts
async headers() {
    return [
        {
            source: '/:path*',
            headers: [
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        },
    ];
},
```

### 4. Content Security Policy (CSP)

```typescript
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

// Add to headers
{ key: 'Content-Security-Policy', value: cspHeader.replace(/\s{2,}/g, ' ').trim() }
```

---

## 📡 HTTPS & Transport Security

### 1. Force HTTPS

**Production only:**
- Enable HTTPS on hosting platform (Vercel does this automatically)
- Redirect HTTP to HTTPS
- Use HSTS header

```typescript
// next.config.ts
async headers() {
    return [
        {
            source: '/:path*',
            headers: [
                {
                    key: 'Strict-Transport-Security',
                    value: 'max-age=63072000; includeSubDomains; preload'
                },
            ],
        },
    ];
},
```

### 2. Secure Cookies

```typescript
// In NextAuth config
cookies: {
    sessionToken: {
        name: `__Secure-next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true, // HTTPS only
        },
    },
},
```

---

## 🔍 Logging & Monitoring

### 1. Security Logging

**Log security events:**
- Failed login attempts
- Successful logins
- Password changes
- Account creation
- API errors
- Rate limit violations

```typescript
// lib/securityLogger.ts
export function logSecurityEvent(event: {
    type: 'login_success' | 'login_failure' | 'signup' | 'password_change';
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
}) {
    const timestamp = new Date().toISOString();
    console.log('[SECURITY]', timestamp, event);
    
    // In production, send to monitoring service:
    // - Datadog
    // - Sentry
    // - CloudWatch
}
```

### 2. Error Handling

**Never expose sensitive information in errors:**

```typescript
// ❌ BAD - Exposes database structure
catch (error) {
    return new Response(error.message, { status: 500 });
}

// ✅ GOOD - Generic error message
catch (error) {
    console.error('Database error:', error); // Log for debugging
    return new Response('An error occurred', { status: 500 }); // Generic to user
}
```

### 3. Monitoring Tools

**Recommended:**
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Request monitoring
- **Datadog**: Infrastructure monitoring
- **Uptime Robot**: Availability monitoring

---

## 📦 Dependency Security

### 1. Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### 2. Automated Security

**GitHub Dependabot:**
- Enable in repository settings
- Automatically creates PRs for security updates
- Review and merge promptly

### 3. Minimal Dependencies

- Only install necessary packages
- Review package before installation
- Check package reputation (downloads, maintenance)
- Avoid packages with known vulnerabilities

---

## 🗄️ Data Privacy & Compliance

### 1. GDPR Compliance

**User Rights:**
- Right to access: Export user data API
- Right to deletion: Account deletion endpoint
- Right to rectification: Profile update functionality
- Data portability: JSON export format

```typescript
// api/user/export/route.ts
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new Response('Unauthorized', { status: 401 });
    
    const userData = {
        profile: await getUserProfile(session.user.email),
        memories: await getUserMemories(session.user.email),
        projects: await getUserProjects(session.user.email),
        plans: await getUserPlans(session.user.email),
    };
    
    return new Response(JSON.stringify(userData), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename="user-data.json"',
        },
    });
}
```

### 2. Data Retention

**Define and implement policies:**
- How long to keep user data
- Soft delete vs hard delete
- Backup retention periods
- Audit log retention

### 3. Privacy Policy

- Keep updated and accessible
- Clearly explain data collection
- Detail data usage and sharing
- Include contact information

---

## 🚀 Deployment Security

### 1. Pre-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] NEXTAUTH_SECRET is production-ready
- [ ] Database uses SSL/TLS
- [ ] HTTPS is enabled
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Error logging configured
- [ ] Dependency audit passed
- [ ] Password hashing uses bcrypt
- [ ] CSP headers configured

### 2. Environment Separation

**Never mix environments:**
- Development: localhost, test database
- Staging: staging.domain.com, staging database
- Production: domain.com, production database

### 3. CI/CD Security

```yaml
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit
      - run: npm run lint
```

---

## 📋 Security Checklist

### Immediate (Critical)

- [ ] **Replace SHA256 with bcrypt for password hashing**
- [ ] Generate strong NEXTAUTH_SECRET for production
- [ ] Enable SSL for database connections
- [ ] Implement rate limiting on auth endpoints
- [ ] Add security headers (CSP, HSTS, X-Frame-Options)
- [ ] Verify .env files are in .gitignore

### Short Term (High Priority)

- [ ] Implement stronger password requirements
- [ ] Add input validation with Zod on all API routes
- [ ] Set up error monitoring (Sentry)
- [ ] Reduce session maxAge to 24 hours
- [ ] Add security event logging
- [ ] Implement rate limiting on all API endpoints
- [ ] Add account lockout after failed login attempts

### Medium Term

- [ ] Implement email verification on signup
- [ ] Add password reset functionality
- [ ] Create user data export endpoint (GDPR)
- [ ] Implement account deletion
- [ ] Add two-factor authentication
- [ ] Set up automated dependency scanning
- [ ] Create incident response plan

### Long Term

- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Bug bounty program
- [ ] Security training for team
- [ ] Compliance certifications (SOC 2, ISO 27001)

---

## 🆘 Incident Response

### If Security Breach Occurs:

1. **Immediately**: 
   - Rotate all secrets (database passwords, NEXTAUTH_SECRET)
   - Review access logs
   - Disable compromised accounts

2. **Within 24 hours**:
   - Assess scope of breach
   - Notify affected users
   - Document incident

3. **Within 72 hours**:
   - Report to authorities if required (GDPR)
   - Implement fixes
   - Conduct post-mortem

### Emergency Contacts

- Security team email: security@yourdomain.com
- Incident response team: (configure based on your team)

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)

---

## 📝 Document Maintenance

**Last Updated**: December 17, 2024  
**Review Schedule**: Quarterly  
**Owner**: Development Team

This document should be reviewed and updated regularly as the application evolves and new security best practices emerge.
