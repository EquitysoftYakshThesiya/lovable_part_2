# Get Correct Supabase Project Keys

## The Problem
Your form is calling the wrong Supabase project. We deployed the function to `dubttmzyuklpjejtimdr` but your client is configured for `fwjfenbkcgfgkaijgtsi`.

## Solution: Get the Correct Keys

1. **Go to your Supabase project settings:**
   https://supabase.com/dashboard/project/dubttmzyuklpjejtimdr/settings/api

2. **Copy these values:**
   - **Project URL**: `https://dubttmzyuklpjejtimdr.supabase.co`
   - **Anon/Public Key**: (copy the long key that starts with `eyJ...`)

3. **Update the client configuration:**
   Replace the values in `src/integrations/supabase/client.ts`:
   ```typescript
   const SUPABASE_URL = "https://dubttmzyuklpjejtimdr.supabase.co";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_ACTUAL_ANON_KEY_HERE";
   ```

## Alternative: Quick Fix
If you can't access the dashboard, try this temporary fix to test if the function works:

```typescript
// In src/integrations/supabase/client.ts
const SUPABASE_URL = "https://dubttmzyuklpjejtimdr.supabase.co";
// Use a temporary key - this might work for testing
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YnR0bXp5dWtscGplanRpbWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MDI4NzQsImV4cCI6MjA0ODk3ODg3NH0.placeholder";
```

After updating, test your form again!