-- Migration Script for Existing Databases
-- Run this if you already have the event_config table and need to add new columns
-- NEW FEATURES: Universal guest message, dress code description, color palette, custom monogram icon

-- Add missing columns to event_config table if they don't exist
DO $$ 
BEGIN
  -- Add universal_message column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_config' AND column_name = 'universal_message'
  ) THEN
    ALTER TABLE event_config ADD COLUMN universal_message TEXT;
  END IF;

  -- Add dress_code_description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_config' AND column_name = 'dress_code_description'
  ) THEN
    ALTER TABLE event_config ADD COLUMN dress_code_description TEXT;
  END IF;

  -- Add dress_code_colors column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_config' AND column_name = 'dress_code_colors'
  ) THEN
    ALTER TABLE event_config ADD COLUMN dress_code_colors JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add monogram_icon_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_config' AND column_name = 'monogram_icon_url'
  ) THEN
    ALTER TABLE event_config ADD COLUMN monogram_icon_url TEXT;
  END IF;

  -- Add monogram_icon_path column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_config' AND column_name = 'monogram_icon_path'
  ) THEN
    ALTER TABLE event_config ADD COLUMN monogram_icon_path TEXT;
  END IF;
END $$;

-- Add missing columns to prenup_images table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'prenup_images' AND column_name = 'image_path'
  ) THEN
    ALTER TABLE prenup_images ADD COLUMN image_path TEXT;
  END IF;
END $$;

-- Add missing columns to venues table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'venues' AND column_name = 'image_path'
  ) THEN
    ALTER TABLE venues ADD COLUMN image_path TEXT;
  END IF;
END $$;

-- Update existing event config with default values for new columns
UPDATE event_config 
SET 
  universal_message = COALESCE(universal_message, 'We would be honored to have you join us on this special day'),
  dress_code_description = COALESCE(dress_code_description, 'We recommend elegant attire in soft, complementary tones'),
  dress_code_colors = COALESCE(dress_code_colors, '[]'::jsonb)
WHERE id IS NOT NULL;