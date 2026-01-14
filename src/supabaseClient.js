import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkigsozniabdpbfjenbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraWdzb3puaWFiZHBiZmpl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Esto ayuda con la seguridad y el tiempo
  }
});