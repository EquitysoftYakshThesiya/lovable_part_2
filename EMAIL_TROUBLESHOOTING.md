# 📧 Email Not Receiving - Troubleshooting Guide

## 🔍 Step-by-Step Debugging

### 1. **Test the Function**
Open `test-email-function.html` in your browser to test the function directly.

### 2. **Check Environment Variables**
Go to: https://supabase.com/dashboard/project/retstrxkoqtmwjyoqiqv/settings/functions

Verify these variables are set:
- ✅ `RESEND_API_KEY` (starts with `re_`)
- ✅ `OPENAI_API_KEY` (starts with `sk-proj-`)

### 3. **Common Issues & Solutions**

#### 🚨 **Environment Variables Not Set**
- **Symptom**: Function returns 500 error about "Email service not configured"
- **Solution**: Set `RESEND_API_KEY` in Supabase Dashboard

#### 🚨 **Invalid Resend API Key**
- **Symptom**: Function fails with authentication error
- **Solution**: 
  1. Go to https://resend.com/api-keys
  2. Create new API key
  3. Update in Supabase Dashboard

#### 🚨 **Email Domain Not Verified**
- **Symptom**: Emails send but never arrive
- **Solution**: 
  1. In Resend Dashboard, verify your sending domain
  2. Or use the default `onboarding@resend.dev` (for testing only)

#### 🚨 **Emails Going to Spam**
- **Symptom**: Function succeeds but email not in inbox
- **Solution**: 
  1. Check spam/junk folder
  2. Add sender to contacts
  3. Use verified domain in production

#### 🚨 **Rate Limiting**
- **Symptom**: First few emails work, then stop
- **Solution**: Check Resend usage limits

### 4. **Function URL**
Your function URL: `https://retstrxkoqtmwjyoqiqv.supabase.co/functions/v1/send-confirmation`

### 5. **Test Request Format**
```json
{
  "name": "Test User",
  "email": "your-email@example.com",
  "industry": "Technology"
}
```

### 6. **Check Function Logs**
1. Go to Supabase Dashboard
2. Navigate to Edge Functions → send-confirmation
3. Check the Logs tab for error messages

## 🛠️ Quick Fixes

1. **Redeploy Function**: `npx supabase functions deploy send-confirmation --project-ref retstrxkoqtmwjyoqiqv`
2. **Test with curl**:
```bash
curl -X POST https://retstrxkoqtmwjyoqiqv.supabase.co/functions/v1/send-confirmation \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"your-email@example.com","industry":"Technology"}'
```

## 📞 Still Not Working?
1. Use the test HTML file to get detailed error messages
2. Check the browser console for additional errors
3. Verify all environment variables are correctly set
4. Try with a different email address