# Troubleshooting Guide

## Common Issues and Solutions

### ❌ Error: Column does not exist

**Error Message:**
```
ERROR: column "dress_code_description" of relation "event_config" does not exist
```

**Solution:**
You have an existing database. Run the migration script:
1. Go to Supabase SQL Editor
2. Run all commands from `DATABASE_MIGRATION.sql`
3. Refresh your application

---

### ❌ Image Upload Fails

**Possible Causes:**
1. Storage bucket not created
2. Storage policies not set up
3. File size too large (max 10MB)
4. Invalid file format

**Solution:**
1. Run `SUPABASE_STORAGE_SETUP.sql` in Supabase SQL Editor
2. Check file size (must be < 10MB)
3. Use supported formats: JPEG, PNG, WebP, GIF
4. Check browser console for specific error

---

### ❌ "Invitation Not Found"

**Possible Causes:**
1. Guest slug doesn't exist in database
2. URL is incorrect

**Solution:**
1. Check the guest was created in admin dashboard
2. Verify the URL matches the guest's slug exactly
3. Guest slugs are auto-generated from names (e.g., "John Doe" → "john-doe")

---

### ❌ Admin Login Doesn't Work

**Solution:**
1. The passcode is: `2026` (hardcoded)
2. To change it, edit `/src/app/components/admin-login.tsx`
3. Clear browser localStorage and try again
4. Try using incognito/private browsing mode

---

### ❌ Carousel/Slideshow Not Working

**Possible Causes:**
1. No images uploaded yet
2. CSS not loading

**Solution:**
1. Upload at least 1 image in Content tab
2. Check that `slick-carousel` is installed (should be in package.json)
3. Verify `/src/styles/index.css` imports slick CSS files

---

### ❌ Database Connection Error

**Error Message:**
```
Failed to load data
```

**Solution:**
1. Check Supabase URL and Anon Key in `/src/lib/supabase.ts`
2. Verify your Supabase project is active
3. Check internet connection
4. Verify all tables exist (run `DATABASE_SCHEMA.sql` or `DATABASE_MIGRATION.sql`)

---

### ❌ Storage Permission Denied

**Error Message:**
```
new row violates row-level security policy
```

**Solution:**
1. Run `SUPABASE_STORAGE_SETUP.sql` to set up storage policies
2. Or manually add policies in Supabase Dashboard:
   - Go to Storage → wedding-images → Policies
   - Add policy for SELECT (read)
   - Add policy for INSERT (upload)
   - Add policy for DELETE (remove)

---

### ❌ Images Not Displaying on Guest Page

**Possible Causes:**
1. Image URLs are broken
2. Storage bucket is private
3. Images were deleted from storage

**Solution:**
1. Check if images show in admin dashboard preview
2. Verify storage bucket is set to **public** (check `SUPABASE_STORAGE_SETUP.sql`)
3. Re-upload images through admin interface
4. Check browser console for 404 errors

---

### ❌ RSVP Not Saving

**Possible Causes:**
1. Database table missing
2. Guest ID mismatch
3. Network error

**Solution:**
1. Verify `rsvps` table exists
2. Check browser console for error details
3. Ensure guest was properly loaded (check Network tab)
4. Verify Supabase credentials are correct

---

## Setup Checklist

Use this checklist to ensure everything is configured:

- [ ] Run `DATABASE_SCHEMA.sql` or `DATABASE_MIGRATION.sql`
- [ ] Run `SUPABASE_STORAGE_SETUP.sql`
- [ ] Update Supabase credentials in `/src/lib/supabase.ts` (if using your own)
- [ ] Access `/admin` successfully
- [ ] Upload a test hero image in Settings tab
- [ ] Upload a test prenup photo in Content tab
- [ ] Add a test guest in Guests tab
- [ ] Visit guest invitation page (e.g., `/test-guest`)
- [ ] Submit a test RSVP

---

## Getting Help

If you're still experiencing issues:

1. **Check Browser Console**: Press F12 and look for red error messages
2. **Check Network Tab**: Look for failed API requests (should all go to Supabase)
3. **Check Supabase Logs**: Go to Supabase Dashboard → Logs
4. **Verify Tables**: Go to Supabase Dashboard → Table Editor and ensure all tables exist

### Required Tables:
- event_config
- guests
- rsvps
- prenup_images
- venues
- faqs

### Required Storage Bucket:
- wedding-images (must be public)

---

## Quick Fixes

### Reset Admin Login
```javascript
// Run in browser console
localStorage.removeItem('admin_authenticated');
```

### Check Supabase Connection
```javascript
// Run in browser console
console.log(window.location.origin);
// Should show your app URL
```

### Verify Storage Bucket
1. Go to Supabase Dashboard
2. Click Storage
3. Find "wedding-images" bucket
4. Ensure it's set to **Public**

---

## Performance Tips

1. **Image Optimization**: Use compressed images (TinyPNG, ImageOptim)
2. **Recommended Sizes**:
   - Hero image: 1920x1080px (landscape)
   - Prenup photos: 900x1200px (portrait)
   - Venue photos: 1200x900px (landscape)
3. **Format**: Use WebP for smaller file sizes (falls back to JPEG/PNG)

---

## Migration from URL-based to Storage-based

If you previously used URL inputs and want to migrate:

1. Download your existing images from URLs
2. Delete old image URLs from database
3. Re-upload images through admin Content tab
4. System will automatically use storage paths

---

Still stuck? Check the `/WEDDING_INVITATION_README.md` for detailed setup instructions.
