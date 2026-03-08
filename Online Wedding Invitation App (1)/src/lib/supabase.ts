import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
// TEMPORARY: Hardcoded for Vercel deployment testing
// TODO: Move back to environment variables once working
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'postgresql://postgres:Happy@wil&pia720@db.zalvkvhvzaekbplxqpii.supabase.co:5432/postgres';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphbHZrdmh2emFla2JwbHhxcGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MDQ5MjAsImV4cCI6MjA4NjI4MDkyMH0.dB6mSo2odgyChRHZTZIYkuXHIWR-7VIzdvMhsKMp1NE';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const configured = supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'postgresql://postgres:Happy@wil&pia720@db.zalvkvhvzaekbplxqpii.supabase.co:5432/postgres' && 
         supabaseUrl.startsWith('http');
  
  return configured;
};

// Only create client if properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any; // Will be handled by setup check
