# Silver Anniversary Wedding Invitation System 💒

A beautiful, mobile-first online wedding invitation system with admin dashboard, built for your parents' 25th anniversary celebration.

## 🌟 Features

### Guest Invitation Page
1. **Hero Section** - Full-screen couple photo with guest name prominently displayed
2. **Live Countdown Timer** - Real-time countdown to the wedding date
3. **Prenup Photo Carousel** - Elegant slideshow of couple's photos
4. **Personalized Message** - Custom message for each guest (with universal fallback)
5. **Venue Carousel** - Beautiful venue images with Google Maps integration
6. **Dress Code Display** - With color palette suggestions
7. **RSVP Form** - Comprehensive RSVP collection with guest management
8. **FAQs Section** - Accordion-style frequently asked questions

### Admin Dashboard (Passcode: "2026")
1. **Guest Management** - Add, edit, delete guests with personalized messages
2. **Content Manager**:
   - Upload prenup photos for carousel
   - Add multiple venues with images and Google Maps links
   - Manage dress code colors
   - Create and edit FAQs
3. **Event Settings**:
   - Event details (date, time, venue)
   - Universal guest message
   - Dress code with description
   - Hero image configuration
   - Color scheme customization
4. **RSVP Tracking** - Real-time dashboard with attendance statistics

### Special Features
- **Secret Admin Access**: Click the heart icon 5 times quickly on any invitation page
- **Mobile-First Design**: Optimized for mobile devices with elegant typography
- **Beautiful Aesthetics**: Using Playfair Display, Montserrat, and Cormorant Garamond fonts
- **Hidden Scrollbars**: Seamless app-like experience

## 🚀 Setup Instructions

### 1. Database Setup

**For NEW databases (first time setup):**
1. Go to your Supabase project SQL Editor
2. Run the SQL commands from `DATABASE_SCHEMA.sql`
3. This will create all necessary tables with all columns

**For EXISTING databases (updating from old version):**
1. Go to your Supabase project SQL Editor
2. Run the SQL commands from `DATABASE_MIGRATION.sql`
3. This will safely add the new columns without affecting existing data

Tables created/updated:
- `event_config` - Event configuration
- `guests` - Guest list
- `rsvps` - RSVP responses
- `prenup_images` - Photo carousel
- `venues` - Venue information
- `faqs` - Frequently asked questions

### 2. Storage Setup

1. Go to your Supabase project SQL Editor
2. Run the SQL commands from `SUPABASE_STORAGE_SETUP.sql`
3. This creates the `wedding-images` storage bucket with proper policies
4. Images will be automatically uploaded through the admin interface

### 3. Environment Configuration

The system is already configured with hardcoded Supabase keys in `/src/lib/supabase.ts`.

To use your own Supabase instance:
1. Update `supabaseUrl` and `supabaseAnonKey` in `/src/lib/supabase.ts`
2. Or create a `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### 4. Initial Configuration

1. Access admin dashboard at `/admin`
2. Login with passcode: `2026`

3. **Settings Tab** - Configure event details:
   - Couple names
   - Event date and time
   - Venue details (main venue shown in hero)
   - Universal guest message
   - Dress code with description
   - Primary and accent colors
   - **Hero Image**: Upload couple photo directly (recommended: 1920x1080px landscape)
   - **Custom Monogram**: Upload your own monogram icon (recommended: square PNG with transparent background)

4. **Content Tab** - Add content:
   - **Prenup Photos**: Upload multiple photos for the carousel (portrait 3:4 ratio)
   - **Venues**: Add venues with photos, times, and Google Maps links
   - **Dress Code Colors**: Add color palette suggestions with visual swatches
   - **FAQs**: Create frequently asked questions

5. **Guests Tab** - Manage guests:
   - Add guests with personalized messages
   - Configure plus-one settings
   - Copy and share unique invitation links

### 5. Deployment

Deploy to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use Vercel GitHub integration for automatic deployments.

## 📱 Usage

### For Admins
1. Visit `/admin` or click heart icon 5 times on any guest page
2. Login with passcode: `2026`
3. Manage guests, content, and settings from the dashboard
4. Copy invitation links and send to guests

### For Guests
1. Receive personalized invitation link (e.g., `/john-doe`)
2. View beautiful invitation with their name
3. Explore countdown, photos, and venue information
4. Submit RSVP response

## 🎨 Customization

### Colors
- Primary Color: Used for headings and main elements
- Accent Color: Used for decorative elements
- Update in Settings → Design tab

### Typography
Fonts are configured in `/src/styles/fonts.css`:
- **Playfair Display**: Elegant serif for headings
- **Montserrat**: Clean sans-serif for body text
- **Cormorant Garamond**: Script-style decorative elements

### Images
- **Hero Image**: Couple photo for invitation header
- **Prenup Images**: Carousel photos (portrait 3:4 ratio recommended)
- **Venue Images**: Venue photos (landscape 4:3 ratio recommended)

**All images are uploaded directly through the admin interface** to Supabase Storage:
- Maximum file size: 10MB per image
- Supported formats: JPEG, PNG, WebP, GIF
- Images are automatically optimized and stored securely
- No need for external image hosting services

### External Image URLs (Optional)
If you prefer to use external URLs (e.g., from Unsplash), you can manually enter them in the database. Sample Unsplash URL:
```
https://images.unsplash.com/photo-1768900044120-650653953a6a?w=1920
```

## 📊 Database Structure

### Tables
1. **event_config**: Event settings and configuration
2. **guests**: Guest list with unique slugs
3. **rsvps**: RSVP responses linked to guests
4. **prenup_images**: Photo carousel images
5. **venues**: Multiple venue support
6. **faqs**: Frequently asked questions

## 🔒 Security

- Admin access protected by passcode (stored in localStorage)
- Supabase Row Level Security (RLS) recommended
- Guest data isolated by unique slug
- No sensitive PII should be collected (per Figma Make guidelines)

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Supabase** - Database and backend
- **React Router** - Routing
- **react-slick** - Carousels
- **Radix UI** - Accessible components

## 📞 Support

For issues or questions:
1. Check database schema is properly set up
2. Verify Supabase connection
3. Ensure all tables have proper permissions
4. Check browser console for errors

## 🎉 Celebrating 25 Years!

This system was built with love to celebrate your parents' silver anniversary. May their next 25 years be just as beautiful! 💍✨