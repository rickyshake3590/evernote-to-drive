# Google OAuth 2.0 Setup Instructions

## Why You're Getting the Error

The error `Error 401: invalid_client` means the app doesn't have a valid Google Client ID. This is expected - you need to create OAuth credentials in Google Cloud Console.

## Step-by-Step Setup

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create or Select a Project
1. Click the project dropdown at the top
2. Click **"NEW PROJECT"**
3. Enter project name: `Evernote-to-Drive-Migration`
4. Click **"CREATE"**
5. Wait for project to be created (1-2 minutes)

### Step 3: Enable Google Drive API
1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"**
3. Search for `Google Drive API`
4. Click on "Google Drive API"
5. Click **"ENABLE"**
6. Wait for it to be enabled

### Step 4: Create OAuth 2.0 Credentials
1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth client ID"**
4. If prompted, click **"Configure Consent Screen"** first:
   - Select "External" (unless you're a Google Workspace admin)
   - Click **"CREATE"**
   - Fill in required fields:
     - **App name:** `Evernote to Drive Migration`
     - **User support email:** Your email
     - **Developer contact:** Your email
   - Click **"SAVE AND CONTINUE"**
   - Skip "Scopes" (click "SAVE AND CONTINUE")
   - Skip "Test users" (click "SAVE AND CONTINUE")
   - Review and click **"BACK TO DASHBOARD"**

5. Back to Credentials, click **"+ CREATE CREDENTIALS"** again
6. Select **"OAuth client ID"**
7. Application type: **"Web application"**
8. Name: `Evernote Migration App`

### Step 5: Configure OAuth Client
1. Under "Authorized JavaScript origins", click **"+ ADD URI"**
2. Add your application URL:
   - For local testing: `http://localhost:5173`
   - For production: `https://yourdomain.com`

3. Under "Authorized redirect URIs", click **"+ ADD URI"**
4. Add:
   - For local: `http://localhost:5173/`
   - For production: `https://yourdomain.com/`

5. Click **"CREATE"**

### Step 6: Copy Your Client ID
1. A modal will appear with your credentials
2. **Copy the "Client ID"** (looks like: `123456789-abcdefghijk.apps.googleusercontent.com`)
3. Keep this safe - don't commit it to public repos

### Step 7: Add Client ID to Your App

**In `index.html`**, find this line (around line 763):
```javascript
client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE',
```

Replace `'YOUR_GOOGLE_CLIENT_ID_HERE'` with your actual Client ID:
```javascript
client_id: '123456789-abcdefghijk.apps.googleusercontent.com',
```

**Save the file.** The browser should auto-refresh.

### Step 8: Test Google Sign-In

1. Open your app: `http://localhost:5173`
2. Go through Phase 1 & 2
3. Reach Phase 3 (Folder Mapping)
4. You should now see the **Google Sign-In button** (no error)
5. Click it and authenticate with your Google account
6. After sign-in, the folder browser should appear

## Troubleshooting

### Still Getting OAuth Error?

**Possible causes:**
- Client ID hasn't been saved in the code
- Localhost hasn't been added to authorized origins
- OAuth app needs time to activate (try refreshing after 5 minutes)

**Solutions:**
1. Double-check Client ID is correct in code
2. Verify `http://localhost:5173` is in "Authorized JavaScript origins"
3. Clear browser cache (`Ctrl+Shift+Del`)
4. Try incognito/private window
5. Wait 5 minutes and retry (sometimes OAuth takes time to activate)

### Blank Sign-In Button?

**Possible cause:** Google API script didn't load

**Solution:**
1. Check browser console for errors (F12 → Console)
2. Verify internet connection
3. Try different browser

## Scopes Used

The app requests only what's needed:
- `drive.file` scope - Only access files/folders the app creates or user picks
- No `drive` scope - We don't need full Drive access
- This keeps the OAuth flow simple and safe

## Security Notes

✅ **Safe practices:**
- Client ID is in frontend code (this is OK for web apps)
- We use PKCE flow (more secure)
- `drive.file` scope limits access
- No sensitive data stored

❌ **Never do:**
- Don't share this Client ID publicly
- Don't commit to GitHub with real ID
- Don't use in production without HTTPS

## For Production Deployment

When deploying to production (not localhost):

1. Update authorized origins/URIs to your production domain
2. Move Client ID to environment variables (don't hardcode)
3. Set up HTTPS (required for production OAuth)
4. Request verification from Google (Drive API access)
5. Consider a backend server for better security

## Quick Reference

| Item | Value |
|------|-------|
| **Project Name** | Evernote-to-Drive-Migration |
| **OAuth Client Type** | Web application |
| **API Required** | Google Drive API v3 |
| **Scope** | drive.file |
| **Local Origin** | http://localhost:5173 |
| **Local Redirect** | http://localhost:5173/ |

## Need Help?

If you get stuck:
1. Check [Google Identity documentation](https://developers.google.com/identity/protocols/oauth2)
2. Review [Drive API documentation](https://developers.google.com/drive/api)
3. Check browser console (F12) for specific error messages

---

**After completing setup, the Google Sign-In button will work and you can test the full Phase 3 folder selection flow!**
