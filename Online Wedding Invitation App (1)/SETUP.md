# Silver Anniversary Wedding Invitation Setup Guide

## Overview
This is a complete wedding invitation management system for your parents' 25th anniversary celebration. It includes an admin dashboard for managing guests and tracking RSVPs, plus personalized invitation pages for each guest.

## Features
- ✅ Admin dashboard to add/edit/delete guests
- ✅ Unique invitation link for each guest
- ✅ Personalized messages per guest
- ✅ RSVP tracking (attending/declined/pending)
- ✅ Plus-one support with configurable max guests
- ✅ Guest can update their RSVP
- ✅ Real-time statistics dashboard
- ✅ Copy invitation links with one click

## Supabase Database Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to finish setting up

### 2. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

```sql
-- Create guests table
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT,
  phone TEXT,
  custom_message TEXT,
  plus_one_allowed BOOLEAN DEFAULT false,
  max_guests INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rsvps table
CREATE TABLE rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 0,
  guest_names TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_guests_slug ON guests(slug);
CREATE INDEX idx_rsvps_guest_id ON rsvps(guest_id);

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is for friends/family)
-- For production, you may want to add authentication

-- Allow anyone to read guests (needed for invitation pages)
CREATE POLICY "Allow public read access to guests" ON guests
  FOR SELECT USING (true);

-- Allow anyone to insert/update guests (for admin dashboard)
-- In production, you'd want to add authentication here
CREATE POLICY "Allow public insert access to guests" ON guests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to guests" ON guests
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to guests" ON guests
  FOR DELETE USING (true);

-- Allow anyone to read RSVPs (for admin dashboard)
CREATE POLICY "Allow public read access to rsvps" ON rsvps
  FOR SELECT USING (true);

-- Allow anyone to insert RSVPs (for guest submission)
CREATE POLICY "Allow public insert access to rsvps" ON rsvps
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update RSVPs (so guests can change their response)
CREATE POLICY "Allow public update access to rsvps" ON rsvps
  FOR UPDATE USING (true);
```

### 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
3. Copy your **anon/public key** (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 4. Configure Environment Variables

#### Option A: Using .env file (Recommended for local development)
1. Create a `.env` file in the root directory
2. Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Option B: Hardcode in the file (Quick setup)
1. Open `/src/lib/supabase.ts`
2. Replace the placeholder values:
```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Click "Deploy"

### 3. Custom Domain (Optional)
1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `PhingWil2026.vercel.app` or `celebration.yourdomain.com`)

## How to Use

### Admin Dashboard
1. Go to `your-domain.com/admin`
2. Click "Add Guest" to create new invitations
3. Fill in guest details:
   - **Name**: Guest's full name
   - **URL Slug**: Unique identifier for their invitation link (auto-generated from name)
   - **Email/Phone**: Optional contact information
   - **Personal Message**: Custom message for this guest
   - **Plus One**: Allow guest to bring additional people
   - **Max Guests**: Maximum number of people they can bring
4. Click "Create Guest"
5. Use the copy button to copy their unique invitation link
6. Send the link to your guest via email, text, or any messaging platform

### Guest Invitation Pages
- Each guest gets a unique URL: `your-domain.com/GuestName`
- They can view their personalized invitation
- They can RSVP with:
  - Attendance confirmation (yes/no)
  - Number of guests attending
  - Names of additional guests
  - Personal message
- They can update their RSVP anytime by visiting the same link

### Tracking RSVPs
- View all RSVPs in the admin dashboard
- See statistics: Total guests, Confirmed, Declined, Pending, Total Attending
- View detailed RSVP information for each guest
- Recent responses are shown at the bottom

## Customization

### Event Details
Edit the event details in `/src/app/components/guest-invitation.tsx`:
- Date: Line with "Saturday, March 15, 2026"
- Time: Line with "6:00 PM - 11:00 PM"
- Venue: Lines with venue name and address
- Contact email: Line with "celebration@example.com"

### Colors & Styling
The app uses a purple/pink gradient theme. To change colors:
- Edit gradient backgrounds in the component files
- Modify Tailwind color classes (e.g., `bg-purple-600` to `bg-blue-600`)

### Default Message
Edit the default invitation message in `/src/app/components/guest-invitation.tsx` around line 155.

## Security Notes

⚠️ **Important**: This setup uses public access policies for simplicity. For a production system handling sensitive data:
1. Implement proper authentication (Supabase Auth)
2. Add admin-only policies for the guests table
3. Restrict RSVP updates to the specific guest
4. Use environment variables (never commit .env to git)
5. Consider adding rate limiting

This current setup is appropriate for a private family/friends event where the invitation links are the "security" mechanism.

## Support

For issues or questions:
1. Check Supabase dashboard for error logs
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Ensure database tables were created successfully

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Router**: React Router DOM
- **UI Components**: Radix UI, Shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Notifications**: Sonner (toast notifications)
