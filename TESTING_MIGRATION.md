# Testing the Password Migration

Follow these steps to see the migration in action:

## 🧪 Step-by-Step Test

### Step 1: Check Current Status
```bash
node scripts/test-password-migration.js verify
```

**Expected Output:**
```
🔍 Quick Migration Verification
================================

⚠️  Found 1 user(s) with potential SHA256 passwords:

   1. Email: huih1108@gmail.com
      Hash length: 64
      Hash starts: 228...

   These users will be automatically migrated on their next login.
```

---

### Step 2: Make Sure Dev Server is Running

In one terminal:
```bash
npm run dev
```

Wait for:
```
✓ Ready in XXXms
Local: http://localhost:3000
```

---

### Step 3: Login with Existing User

1. Open browser: http://localhost:3000/login
2. Enter credentials for: **huih1108@gmail.com**
3. Click "Sign In"

---

### Step 4: Watch the Server Console

You should see these messages in the terminal running `npm run dev`:

```
🔍 Detected SHA256 password for user huih1108@gmail.com
🔄 Migrating password for user huih1108@gmail.com from SHA256 to bcrypt
✅ Password migration successful for user huih1108@gmail.com
```

---

### Step 5: Verify Migration Completed

Run verification again:
```bash
node scripts/test-password-migration.js verify
```

**Expected Output After Migration:**
```
🔍 Quick Migration Verification
================================

✅ No SHA256 passwords found!
   All users have been migrated to bcrypt.
```

---

### Step 6: Check Database (Optional)

```bash
psql $DATABASE_URL
```

Then run:
```sql
SELECT 
    email,
    LENGTH(password) as hash_length,
    SUBSTRING(password, 1, 10) as hash_preview,
    CASE 
        WHEN LENGTH(password) = 64 THEN 'SHA256'
        WHEN password ~ '^\$2' THEN 'bcrypt ✅'
    END as hash_type
FROM users 
WHERE email = 'huih1108@gmail.com';
```

**Expected Result:**
```
        email         | hash_length | hash_preview | hash_type
----------------------+-------------+--------------+-----------
 huih1108@gmail.com   |          60 | $2b$12$abc  | bcrypt ✅
```

---

## 🎯 What You'll See

### Before Migration:
- Password hash: 64 hex characters (e.g., `228abc...`)
- Hash type: SHA256
- Verification: `node scripts/test-password-migration.js verify` shows 1 user

### During Migration:
- Server console shows migration messages
- User logs in successfully (no interruption)
- Database updated automatically

### After Migration:
- Password hash: ~60 characters starting with `$2a$` or `$2b$`
- Hash type: bcrypt
- Verification: `node scripts/test-password-migration.js verify` shows 0 users
- User can login normally with same password

---

## 🔍 Troubleshooting

### Migration Not Happening?

**Check 1: Is the hash actually SHA256?**
```bash
node scripts/test-password-migration.js verify
```

**Check 2: Is user logging in successfully?**
- If login fails with "Invalid email or password", the password might be wrong
- Migration only happens if password verification succeeds

**Check 3: Are there errors in console?**
Look for red error messages in the terminal running `npm run dev`

**Check 4: Database connection working?**
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## ✅ Success Criteria

After testing, you should have:
- [x] Verification shows 0 SHA256 passwords
- [x] User can login successfully  
- [x] Database shows bcrypt hash (starts with `$2`)
- [x] Server logs show migration messages
- [x] User experience unchanged (seamless)

---

## 📝 Notes

- **Non-destructive**: Original SHA256 hash is replaced only after successful verification
- **Automatic retry**: If migration fails, it will retry on next login
- **No user action needed**: Completely transparent to the user
- **Production ready**: Safe to deploy

---

**Ready to test?** Start with Step 1 above! 🚀
