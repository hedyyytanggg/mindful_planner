# Password Migration Guide: SHA256 → bcrypt

## Overview

This guide explains how the automatic password migration from SHA256 to bcrypt works for existing users.

---

## 🔄 How Migration Works

### Automatic Migration on Login

The migration happens **automatically and transparently** when a user logs in:

1. **User attempts login** with their email and password
2. **System detects** the password hash is SHA256 (64 hex characters)
3. **Verifies password** using legacy SHA256 method
4. **Re-hashes password** using bcrypt with 12 salt rounds
5. **Updates database** with new bcrypt hash
6. **User logs in successfully** - no interruption

### Migration Flow Diagram

```
User Login
    ↓
Fetch user from database
    ↓
Check password hash format
    ↓
┌─────────────────────────┬──────────────────────┐
│                         │                      │
│  Is SHA256?             │  Is bcrypt?          │
│  (64 hex chars)         │  (starts with $2)    │
│                         │                      │
├─────────────────────────┤                      │
│                         │                      │
│  1. Verify with SHA256  │  Verify with bcrypt  │
│  2. Re-hash with bcrypt │                      │
│  3. Update database     │                      │
│  4. Allow login         │  Allow login         │
│                         │                      │
└─────────────────────────┴──────────────────────┘
```

---

## 📋 Implementation Details

### Files Modified

1. **[app/api/auth/[...nextauth]/route.ts](../app/api/auth/[...nextauth]/route.ts)**
   - Added SHA256 detection function
   - Added legacy SHA256 verification
   - Added migration logic

2. **[src/lib/dbHelpers.ts](../src/lib/dbHelpers.ts)**
   - Added `updateUserPassword()` function

### Key Functions

#### SHA256 Detection
```typescript
function isSHA256Hash(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash);
}
```

#### Legacy Verification
```typescript
function verifySHA256Password(password: string, hash: string): boolean {
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
    return sha256Hash === hash;
}
```

#### Migration Function
```typescript
async function migratePasswordToBcrypt(
    userId: string,
    email: string,
    password: string
): Promise<void> {
    const newHash = await hashPassword(password); // bcrypt
    await updateUserPassword(userId, newHash);
}
```

---

## ✅ Testing Migration

### Option 1: Verify Existing Users

Check if you have any users with SHA256 passwords:

```bash
node scripts/test-password-migration.js verify
```

This will:
- Query database for users with 64-character passwords (SHA256)
- Display how many users need migration
- Show sample user emails (first few)

### Option 2: Full Migration Test

Test the migration process end-to-end:

```bash
node scripts/test-password-migration.js test
```

This will:
- Create a test user with SHA256 password
- Prompt you to login manually
- Verify the password was migrated to bcrypt
- Clean up test user

### Option 3: Manual Test

1. **Identify a test user** with SHA256 password
2. **Login** at http://localhost:3000/login
3. **Check server logs** for migration messages:
   ```
   🔍 Detected SHA256 password for user test@example.com
   🔄 Migrating password for user test@example.com from SHA256 to bcrypt
   ✅ Password migration successful for user test@example.com
   ```
4. **Verify database** - password hash should now start with `$2a$` or `$2b$`

---

## 🔍 Monitoring Migration

### Database Query to Check Progress

```sql
-- Count users by password hash type
SELECT 
    CASE 
        WHEN LENGTH(password) = 64 AND password ~ '^[a-f0-9]+$' THEN 'SHA256'
        WHEN password ~ '^\$2[aby]\$' THEN 'bcrypt'
        ELSE 'unknown'
    END as hash_type,
    COUNT(*) as user_count
FROM users
GROUP BY hash_type;
```

### Check Specific User

```sql
-- Check a specific user's password hash
SELECT 
    email,
    LENGTH(password) as hash_length,
    SUBSTRING(password, 1, 10) as hash_preview,
    CASE 
        WHEN LENGTH(password) = 64 THEN 'SHA256 (needs migration)'
        WHEN password ~ '^\$2' THEN 'bcrypt (migrated)'
        ELSE 'unknown'
    END as status,
    updatedAt
FROM users 
WHERE email = 'user@example.com';
```

### Server Logs

Watch for these log messages during login:

```bash
# Success messages
🔍 Detected SHA256 password for user email@example.com
🔄 Migrating password for user email@example.com from SHA256 to bcrypt
✅ Password migration successful for user email@example.com

# Warning (migration failed but login allowed)
⚠️ Password migration failed, but allowing login: <error>
```

---

## 🛡️ Security Considerations

### Why Keep SHA256 Functions?

The legacy SHA256 functions are kept **temporarily** for migration only:
- Only used when SHA256 hash is detected
- Not used for new user signups
- Not used for already-migrated users
- Can be removed once all users are migrated

### Migration Safety

- ✅ **Non-disruptive**: Users don't need to reset passwords
- ✅ **Automatic**: Happens on next login
- ✅ **Graceful failure**: If migration fails, user can still login
- ✅ **Logged**: All migrations are logged for monitoring
- ✅ **One-time**: Each user migrated only once

### Error Handling

If migration fails (e.g., database error):
```typescript
try {
    await migratePasswordToBcrypt(user.id, user.email, credentials.password);
} catch (migrationError) {
    console.error('⚠️ Password migration failed, but allowing login:', migrationError);
    // User can still login - migration will retry on next login
}
```

---

## 📊 Migration Timeline

### Immediate (Now)
- ✅ Migration code deployed
- ✅ New signups use bcrypt
- ✅ Existing users can login (triggers migration)

### Short Term (1-4 weeks)
- Monitor migration progress
- Check logs for migration errors
- Verify most active users have migrated

### Medium Term (1-3 months)
- Review unmigrated users
- Consider email notification for inactive users
- Plan timeline for removing SHA256 code

### Long Term (3+ months)
- Once 100% migration complete:
  - Remove SHA256 legacy functions
  - Remove migration logic
  - Keep only bcrypt verification

---

## 🚨 Troubleshooting

### Issue: User can't login

**Possible causes:**
1. Password is already bcrypt but user forgot password
2. Database connection failed during migration
3. User entered wrong password

**Solution:**
- Check database for user's password hash format
- Check server logs for errors
- Implement password reset functionality

### Issue: Migration not happening

**Check:**
1. Is development server running?
2. Are database credentials correct?
3. Are there errors in server logs?
4. Is user actually logging in?

**Debug:**
```bash
# Check database
psql $DATABASE_URL -c "SELECT email, LENGTH(password) FROM users WHERE email = 'test@example.com';"

# Check server logs
# Look for: "🔍 Detected SHA256 password"
```

### Issue: Migration successful but user can't login next time

**Cause:** Password was migrated but bcrypt verification failing

**Solution:**
- Check bcrypt installation: `npm list bcrypt`
- Verify bcrypt types: `npm list @types/bcrypt`
- Restart development server
- Check for bcrypt compatibility issues

---

## 🔧 Manual Migration (Alternative)

If you prefer to migrate all users at once instead of on-demand:

```javascript
// scripts/migrate-all-passwords.js
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

async function migrateAllPasswords() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Get all users with SHA256 passwords
    const result = await pool.query(`
        SELECT id, email, password 
        FROM users 
        WHERE LENGTH(password) = 64
    `);
    
    console.log(`Found ${result.rows.length} users to migrate`);
    
    for (const user of result.rows) {
        // Note: We don't have the plaintext password!
        // This approach requires users to reset their passwords
        console.log(`⚠️  Cannot migrate ${user.email} without plaintext password`);
    }
    
    await pool.end();
}
```

**Note:** You cannot directly convert SHA256 to bcrypt without the original password. The on-demand migration during login is the best approach.

---

## 📝 Best Practices

### 1. Monitor Migration Progress

Set up monitoring to track:
- Number of users with SHA256 passwords
- Migration success rate
- Migration errors

### 2. Communicate with Users

Consider:
- In-app notification about security upgrade
- Email to inactive users (optional)
- Privacy policy update (already done)

### 3. Keep Migration Temporary

- Plan to remove SHA256 code after migration complete
- Document when to remove legacy code
- Set calendar reminder to review in 3 months

### 4. Test Thoroughly

Before production:
- Test with real SHA256 passwords
- Test migration failure scenarios
- Test concurrent logins
- Verify database updates

---

## 📚 Additional Resources

- [SECURITY.md](../SECURITY.md) - Complete security documentation
- [SECURITY_IMPLEMENTATION_SUMMARY.md](../SECURITY_IMPLEMENTATION_SUMMARY.md) - Implementation details
- [bcrypt documentation](https://github.com/kelektiv/node.bcrypt.js)
- [NextAuth.js documentation](https://next-auth.js.org/)

---

## ✅ Checklist

- [x] Migration code implemented
- [x] Password update function added
- [x] SHA256 detection working
- [x] Test script created
- [x] Documentation written
- [ ] Test with real SHA256 user
- [ ] Deploy to production
- [ ] Monitor migration progress
- [ ] Remove SHA256 code after 100% migration

---

**Last Updated:** December 17, 2025  
**Status:** ✅ Migration Ready
