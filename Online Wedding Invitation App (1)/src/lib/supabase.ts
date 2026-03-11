import { createClient } from "@supabase/supabase-js";

// Type definitions
export interface Guest {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  custom_message?: string;
  plus_one_allowed: boolean;
  max_guests: number;
  created_at?: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  attending: boolean;
  guest_count: number;
  message?: string;
  meal_preference?: string;
  dietary_restrictions?: string;
  song_request?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventConfig {
  id?: string;
  couple_names: string;
  event_type: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  dress_code: string;
  dress_code_colors?: DressCodeColor[];
  dress_code_description?: string;
  primary_color: string;
  accent_color: string;
  hero_image_url: string;
  monogram_icon_url?: string;
  monogram_icon_path?: string;
  welcome_message: string;
  event_description: string;
  additional_info: string;
  rsvp_deadline: string;
  show_meal_preferences: boolean;
  show_dietary_restrictions: boolean;
  show_song_requests: boolean;
  design_config?: any;
  created_at?: string;
  updated_at?: string;
}

export interface PrenupImage {
  id: string;
  image_url: string;
  image_path?: string;
  order_index: number;
  created_at?: string;
}

export interface Venue {
  id: string;
  venue_name: string;
  venue_address: string;
  venue_time?: string;
  image_url?: string;
  image_path?: string;
  google_maps_link?: string;
  order_index: number;
  created_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at?: string;
}

export interface DressCodeColor {
  name: string;
  color: string;
}

// Supabase project credentials
// Use the HTTP URL, not the postgres connection string
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const configured =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey.length > 20;

  return configured;
};

// Only create client if properly configured
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Will be handled by setup check