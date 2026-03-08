-- Wedding Invitation System Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Event Configuration Table
CREATE TABLE IF NOT EXISTS event_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_names TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Wedding',
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  dress_code TEXT,
  dress_code_description TEXT,
  dress_code_colors JSONB DEFAULT '[]'::jsonb,
  primary_color TEXT NOT NULL DEFAULT '#334155',
  accent_color TEXT NOT NULL DEFAULT '#94a3b8',
  hero_image_url TEXT,
  monogram_icon_url TEXT,
  monogram_icon_path TEXT,
  welcome_message TEXT,
  universal_message TEXT,
  event_description TEXT,
  additional_info TEXT,
  rsvp_deadline DATE NOT NULL,
  show_meal_preferences BOOLEAN DEFAULT true,
  show_dietary_restrictions BOOLEAN DEFAULT true,
  show_song_requests BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guests Table
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  custom_message TEXT,
  plus_one_allowed BOOLEAN DEFAULT false,
  max_guests INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs Table
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 1,
  guest_names TEXT,
  message TEXT,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  song_request TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prenup Images Table (Photo Carousel)
CREATE TABLE IF NOT EXISTS prenup_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  image_path TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venues Table (Multiple venues support)
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_time TEXT,
  image_url TEXT,
  image_path TEXT,
  google_maps_link TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guests_slug ON guests(slug);
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_prenup_images_order ON prenup_images(order_index);
CREATE INDEX IF NOT EXISTS idx_venues_order ON venues(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);

-- Insert default event config if none exists
INSERT INTO event_config (
  couple_names,
  event_type,
  event_date,
  event_time,
  venue_name,
  venue_address,
  dress_code,
  dress_code_description,
  welcome_message,
  universal_message,
  event_description,
  rsvp_deadline
) 
SELECT 
  'John & Jane',
  'Silver Anniversary Celebration',
  '2026-12-31',
  '6:00 PM',
  'Grand Ballroom',
  '123 Main Street, City, State 12345',
  'Semi-Formal',
  'We recommend elegant attire in soft, complementary tones',
  'Join us for a celebration of love and 25 years together',
  'We would be honored to have you join us on this special day',
  'Please join us as we celebrate our silver anniversary',
  '2026-12-01'
WHERE NOT EXISTS (SELECT 1 FROM event_config LIMIT 1);

-- Sample FAQ entries
INSERT INTO faqs (question, answer, order_index) VALUES
('What time should I arrive?', 'Please arrive at least 15 minutes before the ceremony begins to find your seat.', 1),
('Is there parking available?', 'Yes, complimentary parking is available at the venue.', 2),
('Can I bring a plus one?', 'Please check your invitation - if you are able to bring a guest, it will be indicated there.', 3),
('Will there be food and drinks?', 'Yes, a full dinner reception will follow the ceremony, along with cocktails and refreshments.', 4)
ON CONFLICT DO NOTHING;