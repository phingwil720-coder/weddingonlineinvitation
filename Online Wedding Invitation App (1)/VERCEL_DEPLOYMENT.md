# Vercel Deployment Guide

## ⚠️ IMPORTANT: Hardcoded Keys Removed

The hardcoded Supabase keys have been **removed** from the codebase. You MUST configure environment variables in Vercel for the app to work.

---

## 🚀 Deployment Steps

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Wedding invitation system ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)

### 3. Configure Environment Variables in Vercel

**CRITICAL:** Add these environment variables in your Vercel project settings:

#### Navigate to: Project Settings → Environment Variables

Add the following variables:

| Variable Name | Value | Where to Find It |
|--------------|-------|------------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Project Settings → API |

#### Steps to Add Variables:
1. In Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add `VITE_SUPABASE_URL`:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environments: Select all (Production, Preview, Development)
3. Add `VITE_SUPABASE_ANON_KEY`:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...` (your key)
   - Environments: Select all (Production, Preview, Development)
4. Click **Save**

### 4. Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click **Redeploy**

---

## 🔑 Finding Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Project Settings** (gear icon in sidebar)
4. Click on **API** in the left menu
5. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon public** key → Use for `VITE_SUPABASE_ANON_KEY`

---

## 📋 Supabase Setup Checklist

Make sure your Supabase project has:

- ✅ All database tables created (use `DATABASE_SCHEMA.sql`)
- ✅ Storage buckets configured:
  - `hero-images` (public)
  - `prenup-images` (public)
  - `venue-images` (public)
  - `monogram-icons` (public)
- ✅ Storage policies set up (use `SUPABASE_STORAGE_SETUP.sql`)
- ✅ RLS policies configured (if needed)

---

## 🧪 Testing Your Deployment

After deployment:

1. Visit your Vercel URL (e.g., `your-app.vercel.app`)
2. You should see the setup page (if first time)
3. Go to `/admin` and log in with passcode: `2026`
4. Configure your event details
5. Add guests
6. Test guest invitation pages

---

## 🔒 Security Notes

- ✅ **Supabase anon key is safe to expose** - It's designed to be public
- ✅ **Row Level Security (RLS)** should be enabled on sensitive tables
- ✅ **Admin passcode** is set to `2026` (you can change this in the admin dashboard)
- ⚠️ **Never commit `.env` files** to GitHub (already added to `.gitignore`)

---

## 🐛 Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify the variable names match exactly (case-sensitive)
- Make sure you selected all environments when adding variables

### App Shows "Configure Supabase" Error
- Environment variables are not set or incorrect
- Redeploy after adding environment variables
- Check Vercel logs for specific error messages

### Images Not Uploading
- Verify Supabase Storage buckets exist
- Check storage policies are set up correctly
- Ensure bucket names match exactly

---

## 📱 Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown by Vercel

---

## 🎉 You're Done!

Your wedding invitation system is now live! Share the admin link with your parents and guest invitation links with your guests.

**Admin URL**: `https://your-app.vercel.app/admin`  
**Guest URL Format**: `https://your-app.vercel.app/invitation/guest-slug`
