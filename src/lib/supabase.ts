import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bkigsozniabdpbfjenbc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraWdzb3puaWFiZHBiZmplbmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzkyMjAsImV4cCI6MjA4MjE1NTIyMH0.EHSIgLzmPh3bh-v_fv-j5jZ5O7nEbLjT2iwcp0Nbivw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
