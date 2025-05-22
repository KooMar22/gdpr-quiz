import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase config missing. Check the env variables.");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗");
  
  if (import.meta.env.DEV) {
    throw new Error("Missing Supabase environment variables. Please check your .env file.");
  }
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, 
  },
  db: {
    schema: "public"
  }
});

export default supabase;