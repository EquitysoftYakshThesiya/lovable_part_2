# Send Confirmation Email Function

This Supabase Edge Function sends personalized confirmation emails to users who sign up for the lead capture form.

## Setup

1. **Environment Variables**: Create a `.env.local` file in the `supabase/` directory with the following variables:

```env
RESEND_API_KEY=your_actual_resend_api_key
OPENAI_API_KEY=your_actual_openai_api_key
```

2. **Get API Keys**:
   - **Resend API Key**: Sign up at [resend.com](https://resend.com) and get your API key
   - **OpenAI API Key**: Sign up at [platform.openai.com](https://platform.openai.com) and get your API key

3. **Deploy the function**:
```bash
supabase functions deploy send-confirmation
```

## Features

- Sends personalized welcome emails using AI-generated content
- Falls back to generic content if OpenAI API is not configured
- Includes proper error handling and validation
- CORS-enabled for web applications

## Testing

You can test the function locally:
```bash
supabase functions serve send-confirmation
```

Then make a POST request to `http://localhost:54321/functions/v1/send-confirmation` with:
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "industry": "technology"
}
```