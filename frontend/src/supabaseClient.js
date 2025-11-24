import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tjurijxsdhhmjnkzpaoo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqdXJpanhzZGhobWpua3pwYW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjYyOTksImV4cCI6MjA3ODg0MjI5OX0.t6fx6r0uVjCguEiUKNSzguOjEHWGEOkRxX1fYgamZwY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

