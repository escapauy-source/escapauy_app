import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables. Check .env file.");
    // Prevent crash, but app won't work fully
}


let supabaseInstance;

try {
    if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith("http")) {
        throw new Error("Invalid Supabase configuration");
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
    console.error("Supabase Client Init Error:", error);
    // Create a minimal dummy client to prevent crash, but operations will fail
    supabaseInstance = createClient("https://placeholder.supabase.co", "placeholder") as any;
}

export const supabase = supabaseInstance;

