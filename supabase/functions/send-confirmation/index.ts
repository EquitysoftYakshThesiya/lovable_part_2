import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore - Deno std library
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore - npm package in Deno
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  name: string;
  email: string;
  industry: string;
}

const generatePersonalizedContent = async (name: string, industry: string): Promise<string> => {
  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured, using fallback content');
      return `Hi ${name}! 🚀 Welcome to our innovation community! We're thrilled to have someone from the ${industry} industry join us. Get ready to discover cutting-edge insights, connect with fellow innovators, and unlock new opportunities that will transform how you work. This is just the beginning of your innovation journey!`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at writing exciting, personalized welcome emails for an innovation community. Create super short, energetic content that gets people excited about revolutionizing their industry. Keep it under 150 words total.'
          },
          {
            role: 'user',
            content: `Create a personalized welcome email for ${name} who works in the ${industry} industry. Focus on how this innovation community will help them revolutionize their specific industry. Be enthusiastic and inspiring. Include industry-specific opportunities and innovations they could be part of.`
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data?.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return content;
  } catch (error) {
    console.error('Error generating personalized content:', error);
    // Fallback content
    return `Hi ${name}! 🚀 Welcome to our innovation community! We're thrilled to have someone from the ${industry} industry join us. Get ready to discover cutting-edge insights, connect with fellow innovators, and unlock new opportunities that will transform how you work. This is just the beginning of your innovation journey!`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log(`=== EMAIL FUNCTION v3.0: ${req.method} request ===`);
  console.log("Timestamp:", new Date().toISOString());

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);

    let parsedBody: ConfirmationEmailRequest;
    try {
      parsedBody = JSON.parse(requestBody);
      console.log("Parsed body:", parsedBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { name, email, industry } = parsedBody;
    console.log(`Processing: name=${name}, email=${email}, industry=${industry}`);

    // Validate required fields
    if (!name || !email || !industry) {
      console.log("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: name, email, and industry are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check environment variables
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    console.log("Environment check:");
    console.log("- Resend key exists:", !!resendKey);
    console.log("- Resend key starts with 're_':", resendKey?.startsWith('re_'));
    console.log("- OpenAI key exists:", !!openaiKey);
    console.log("- OpenAI key starts with 'sk-':", openaiKey?.startsWith('sk-'));

    if (!resendKey || resendKey === "invalid_key" || resendKey === "your_resend_api_key_here") {
      console.error("Resend API key not configured properly");
      return new Response(
        JSON.stringify({
          error: "Email service not configured. Please set RESEND_API_KEY environment variable.",
          success: false
        }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Resend
    // @ts-ignore - Deno global
    const resend = new Resend(resendKey);

    console.log(`Generating personalized email for ${name} from ${industry} industry`);

    // Generate personalized content using AI
    const personalizedContent = await generatePersonalizedContent(name, industry);
    console.log(`Generated content: ${personalizedContent.substring(0, 100)}...`);

    // Send email
    try {
      console.log("Attempting to send email via Resend...");

      const emailResponse = await resend.emails.send({
        from: "Innovation Community <noreply@resend.dev>",
        to: [email],
        subject: `Welcome to the Innovation Revolution, ${name}! 🚀`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">🚀 Welcome to the Innovation Revolution!</h1>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; margin-bottom: 30px;">
              <div style="font-size: 18px; line-height: 1.6;">
                ${personalizedContent.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>🎯 <strong>Exclusive insights</strong> tailored to ${industry}</li>
                <li>💡 <strong>Early access</strong> to industry-changing innovations</li>
                <li>🤝 <strong>Connect</strong> with ${industry} leaders and visionaries</li>
                <li>📈 <strong>Transform your approach</strong> to ${industry} challenges</li>
              </ul>
            </div>
            
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">
                Ready to revolutionize ${industry}?<br>
                <strong>The Innovation Community Team</strong>
              </p>
            </div>
          </div>
        `,
      });

      console.log("Email sent successfully:", emailResponse);
      console.log("Email ID:", emailResponse.data?.id);
      console.log("Sent to:", email);
      console.log("From:", "Innovation Community <noreply@resend.dev>");

      return new Response(
        JSON.stringify({
          success: true,
          message: "Email sent successfully!",
          emailId: emailResponse.data?.id,
          sentTo: email,
          sentFrom: "Innovation Community <noreply@resend.dev>",
          timestamp: new Date().toISOString(),
          checkSpamFolder: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );

    } catch (emailError: any) {
      console.error("Error sending email with Resend:", emailError);
      return new Response(
        JSON.stringify({
          error: `Failed to send email: ${emailError.message}`,
          success: false,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

  } catch (error: any) {
    console.error("=== FUNCTION ERROR ===", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);