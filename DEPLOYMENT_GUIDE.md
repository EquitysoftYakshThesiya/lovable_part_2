# Supabase Function Deployment Guide

## 🔐 Security First - Environment Variables

**IMPORTANT**: Never commit API keys to git! Always set them as environment variables in the Supabase Dashboard.

## Required Environment Variables

Set these in your Supabase Dashboard under:
`Project Settings → Edge Functions → Environment Variables`

1. **RESEND_API_KEY**
   - Get from: https://resend.com/api-keys
   - Format: `re_xxxxxxxxxx`

2. **OPENAI_API_KEY** 
   - Get from: https://platform.openai.com/api-keys
   - Format: `sk-proj-xxxxxxxxxx`

## Deployment Commands

```bash
# Login to Supabase
npx supabase login

# Deploy function
npx supabase functions deploy send-confirmation --project-ref YOUR_PROJECT_ID

# Or deploy to specific project
npx supabase functions deploy send-confirmation --project-ref retstrxkoqtmwjyoqiqv
```

## Testing

After setting environment variables, test your function at:
`https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-confirmation`

## Local Development

1. Copy `supabase/.env.local.template` to `supabase/.env.local`
2. Add your actual API keys to `.env.local`
3. Never commit `.env.local` to git (it's in .gitignore)