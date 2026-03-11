# Wedding Invitation System

An elegant, mobile-first wedding invitation system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎨 Beautiful, responsive design with elegant typography
- 💌 Personalized invitation pages with unique links for each guest
- ⏱️ Live countdown timer to the wedding day
- 📸 Prenup photo carousel
- 📍 Venue information with Google Maps integration
- 👗 Dress code section with color palettes
- ✅ RSVP management system
- ❓ FAQ section
- 🔐 Admin dashboard with passcode protection
- 🌸 Decorative floral elements throughout

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for images)
- **Routing**: React Router v7
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon public key

### 4. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_PASSCODE=your-custom-admin-passcode
```

### 5. Set up the database

Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Create guests table
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT,
  phone TEXT,
  custom_message TEXT,
  plus_one_allowed BOOLEAN DEFAULT false,
  max_guests INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rsvps table
CREATE TABLE rsvps (
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

-- Create event_config table
CREATE TABLE event_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  couple_names TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  dress_code TEXT,
  dress_code_description TEXT,
  dress_code_colors JSONB,
  primary_color TEXT DEFAULT '#7A9173',
  accent_color TEXT DEFAULT '#C3968C',
  hero_image_url TEXT,
  hero_image_path TEXT,
  monogram_icon_url TEXT,
  monogram_icon_path TEXT,
  welcome_message TEXT,
  event_description TEXT,
  additional_info TEXT,
  universal_message TEXT,
  rsvp_deadline DATE NOT NULL,
  show_meal_preferences BOOLEAN DEFAULT true,
  show_dietary_restrictions BOOLEAN DEFAULT true,
  show_song_requests BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prenup_images table
CREATE TABLE prenup_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  image_path TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create venues table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_time TEXT,
  image_url TEXT,
  image_path TEXT,
  google_maps_link TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faqs table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dress_code_colors table
CREATE TABLE dress_code_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE prenup_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dress_code_colors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON guests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON event_config FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON prenup_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON venues FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON faqs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON dress_code_colors FOR SELECT USING (true);

-- Allow guests to read and insert their own RSVPs
CREATE POLICY "Enable read access for all users" ON rsvps FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON rsvps FOR UPDATE USING (true);
```

### 6. Set up Supabase Storage

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - `hero-images` (public)
   - `prenup-images` (public)
   - `venue-images` (public)
   - `monogram-icons` (public)

### 7. Run the development server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### 8. Access the admin dashboard

Navigate to `/admin` and use your configured passcode to access the admin dashboard.

**Secret Access**: On any guest invitation page, quickly click the heart/monogram icon 5 times to navigate to the admin login.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSCODE`
4. Deploy!

## Design System

### Color Palette

- **Background**: `#E5DDD3` (Light Beige)
- **Text**: `#5C4A47` (Deep Burgundy)
- **Primary**: `#7A9173` (Sage Green)
- **Secondary**: `#E5C9BC` (Soft Blush)
- **Accent**: `#C3968C` (Mauve)

### Typography

- **Headings**: Playfair Display (elegant serif)
- **Body**: Montserrat (clean sans-serif)
- **Special Text**: Cormorant Garamond (refined serif for italics)

## License

Private - For personal use only.
