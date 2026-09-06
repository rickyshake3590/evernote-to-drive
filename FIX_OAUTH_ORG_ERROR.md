# Fix: OAuth 403 - Organization Restriction Error

## Problem

When you try to sign in, you get:
```
Error 403: org_internal
evernote-to-drive is restricted to users within its organization
```

## Root Cause

Your OAuth app is configured as **"Internal"** in Google Cloud Console. This restricts access to only:
- Users within your organization (if using Google Workspace)
- Explicitly added test users

## Solution: Change to External

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project: `Evernote-to-Drive-Migration`
3. Go to **APIs & Services** → **OAuth consent screen** (left sidebar)

### Step 2: Edit OAuth Consent Screen
1. Click the **EDIT APP** button
2. On the "App information" tab, look for **"User type"**
3. **Change from "Internal" to "External"**
4. Click **"SAVE AND CONTINUE"**

### Step 3: Add Scopes
1. On "Scopes" tab, click **"ADD OR REMOVE SCOPES"**
2. Search for `drive.file`
3. Select **"https://www.googleapis.com/auth/drive.file"**
4. Click **"UPDATE"**
5. Click **"SAVE AND CONTINUE"**

### Step 4: Test Users (Optional)
- If you want to limit who can sign in during development, add test users
- Otherwise, skip this

### Step 5: Review and Finish
1. Review your settings
2. Click **"SAVE AND CONTINUE"** on any remaining screens
3. You're done!

### Step 6: Test Sign-In
1. Go back to your app
2. Refresh the page (Ctrl+R or Cmd+R)
3. Try signing in again
4. **Should work now!** ✅

## What Each Setting Does

| Setting | Internal | External |
|---------|----------|----------|
| **Who can use** | Organization members only | Anyone with Google account |
| **Requires verification** | No | Yes (for production) |
| **Best for** | Internal testing | Public/production use |

## Timeline for Changes

- **Immediate:** You can sign in right away after changing to "External"
- **Production:** Google may ask you to verify the app (takes 1-5 days)
- For this development phase: You're fine to proceed

## Verification for Production

When you deploy to production, Google will ask you to:
1. Provide app privacy policy (link)
2. Show how your app uses Drive
3. Verify your domain ownership
4. This is automatic - they'll email you when ready

For now (development), you don't need to worry about this.

## Quick Checklist

- [ ] Go to OAuth consent screen in Google Cloud Console
- [ ] Change User Type from "Internal" to "External"
- [ ] Add `drive.file` scope
- [ ] Save all changes
- [ ] Refresh your app
- [ ] Try signing in again

## Still Getting Error?

If it still doesn't work after 5 minutes:
1. Clear browser cache (Ctrl+Shift+Del)
2. Try incognito/private window
3. Try different browser
4. Wait 5-10 minutes (Google takes time to propagate changes)

## Need More Help?

- [OAuth Consent Screen Documentation](https://support.google.com/cloud/answer/10311615)
- [Drive API Setup Guide](https://developers.google.com/drive/api/quickstart/python)

---

**After these changes, Google Sign-In will work and you can test the full folder selection flow in Phase 3!**
