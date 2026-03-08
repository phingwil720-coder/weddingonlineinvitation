# Custom Monogram Icon Feature 🎨

## Overview
You can now upload your own custom monogram icon to replace the default heart icon on guest invitation pages!

## What It Does
- Replaces the heart icon button at the top of each guest invitation
- Maintains the same functionality (click 5 times to access admin)
- Keeps the same size and positioning as the original heart
- Falls back to heart icon if no monogram is uploaded

## How to Upload Your Monogram

### Step 1: Prepare Your Image
**Recommended Specifications:**
- Format: PNG with transparent background
- Dimensions: Square (e.g., 512x512px or 1024x1024px)
- File size: Under 10MB
- Style: Simple, elegant monogram or logo

**Example Monogram Ideas:**
- Combined initials (e.g., "J&J")
- Custom wedding logo
- Elegant script monogram
- Family crest or emblem
- Simple icon representing the couple

### Step 2: Upload Through Admin
1. Go to `/admin` (or click heart 5 times on any guest page)
2. Login with passcode: `2026`
3. Navigate to **Settings** tab
4. Click **Design** sub-tab
5. Find the **"Custom Monogram Icon"** section
6. Click **"Upload Monogram"** button
7. Select your prepared image file
8. Wait for upload to complete
9. Click **"Save Settings"** at the bottom

### Step 3: Verify
1. Visit any guest invitation page
2. Look at the top of the hero section
3. Your custom monogram should now appear instead of the heart
4. Test the admin access by clicking it 5 times quickly

## Technical Details

### Storage
- Images are uploaded to Supabase Storage bucket: `wedding-images/monogram/`
- Stored with unique filename to prevent conflicts
- Public URL is saved to database for display

### Database Fields
- `monogram_icon_url`: Public URL of the uploaded image
- `monogram_icon_path`: Storage path for deletion/management

### Display Specs
The monogram is displayed as:
```jsx
<img 
  src={monogram_url} 
  alt="Monogram" 
  className="h-8 w-8 object-contain"
/>
```

This means:
- 32px × 32px display size (h-8 w-8)
- Object-fit: contain (maintains aspect ratio)
- Appears in a 56px × 56px circular button (w-14 h-14)

## Best Practices

### Design Tips
✅ **DO:**
- Use simple, recognizable designs
- Ensure good contrast for visibility
- Test on both light and dark backgrounds
- Use vector-based designs when possible
- Keep details minimal (small display size)

❌ **DON'T:**
- Use overly complex designs with fine details
- Use non-transparent backgrounds (unless intentional)
- Upload extremely large files (slows down page load)
- Use low-resolution images (will appear blurry)

### Color Considerations
Since the button has a white background with rounded corners:
- Dark/colored monograms work best
- The image will be visible against white
- Consider your primary color for consistency

## Troubleshooting

### Monogram Not Showing
1. Check if image uploaded successfully (look for green success toast)
2. Verify you clicked "Save Settings" after upload
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
4. Check browser console for errors
5. Verify image URL in database

### Monogram Looks Distorted
- Ensure you uploaded a square image
- Use higher resolution (512px or larger)
- Check that the original file isn't corrupted

### Upload Failed
- Check file size (must be under 10MB)
- Verify file format (JPEG, PNG, WebP, GIF only)
- Ensure storage bucket policies are set up (run `SUPABASE_STORAGE_SETUP.sql`)
- Check Supabase storage quota

## Removing the Monogram

To go back to the default heart icon:
1. Delete the monogram image in Supabase Storage
2. Or manually clear the `monogram_icon_url` field in the database
3. Save settings to apply changes

## Example Use Cases

### Classic Monogram
- Combined initials in elegant script font
- Simple and timeless
- Example: "J&J" or "JM"

### Modern Logo
- Custom wedding logo
- Abstract design representing the couple
- Minimalist icon

### Symbolic Icon
- Meaningful symbol (e.g., infinity sign, rings)
- Cultural or religious symbol
- Family emblem

## Summary

The custom monogram feature adds a personal touch to your wedding invitations while maintaining the hidden admin access functionality. Upload your monogram through the admin dashboard Settings → Design tab, and it will immediately appear on all guest invitation pages!

**Pro Tip:** Consider hiring a designer on Fiverr or Canva to create a professional monogram if you don't have design skills. Search for "wedding monogram" or "couple initials logo."
