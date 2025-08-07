// Global Deno types for Supabase Edge Functions
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

// Resend module types
declare module "npm:resend@2.0.0" {
  export class Resend {
    constructor(apiKey: string);
    emails: {
      send(options: {
        from: string;
        to: string[];
        subject: string;
        html: string;
      }): Promise<{ data?: { id: string }; error?: any }>;
    };
  }
}

export {};