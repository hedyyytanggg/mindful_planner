#!/bin/bash

echo "🔧 Setting up Forgot Password feature..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    echo "Loading from .env.local..."
    source .env.local
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set"
    echo "Please set it in .env.local or environment"
    exit 1
fi

echo "✅ Database URL found"
echo ""

# Run migration
echo "📝 Running database migration..."
psql "$DATABASE_URL" < scripts/add-password-reset-fields.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration successful!"
    echo ""
    echo "📧 Next steps:"
    echo "1. Get free Resend API key: https://resend.com/api-keys"
    echo "2. Add to .env.local: RESEND_API_KEY=re_..."
    echo "3. Add to .env.local: EMAIL_FROM=noreply@yourdomain.com"
    echo "4. Restart your dev server: npm run dev"
    echo "5. Test at: http://localhost:3000/login → Forgot password?"
    echo ""
    echo "📖 Full guide: FORGOT_PASSWORD_SETUP.md"
else
    echo ""
    echo "❌ Migration failed"
    echo "Check the error above for details"
    exit 1
fi
