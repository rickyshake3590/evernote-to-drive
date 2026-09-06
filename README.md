# Evernote to Google Docs Migration Tool

A secure, privacy-first web application that migrates Evernote notes to Google Docs while preserving all formatting, structure, and hierarchy.

## Features

✨ **Core Functionality**
- Parse Evernote HTML exports while preserving structure (headings, bullets, nested lists, formatting)
- Validate and review notes before migration
- Map Evernote folder hierarchy to Google Drive
- Generate DOCX files with native formatting (bullets, numbers, nested lists)
- Upload directly to Google Drive using OAuth 2.0
- Real-time progress tracking

🔒 **Security**
- Client-side processing — all processing happens in your browser
- OAuth 2.0 authentication — no passwords stored
- Password-protected access to the application
- No server storage — your data stays yours

🎨 **Design**
- Warm, approachable UI with Evernote → Google Docs hero animation
- Responsive design (mobile, tablet, desktop)
- Dark/light mode support
- Plain-language error messages

## Quick Start

### 1. Get Your Credentials

**Application Password:**
- Choose a secure password for login access (default: `byeevernote` for local development)

**Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Drive API**
4. Go to "Credentials" → Create **OAuth 2.0 Web Application**
5. Add authorized redirect URIs:
   - `http://localhost:5173` (local development)
   - Your GitHub Pages URL: `https://yourusername.github.io/evernote-to-drive/`
6. Copy your **Client ID**

### 2. Deploy to GitHub Pages

#### Option A: Secure Deployment with GitHub Secrets (Recommended)

1. Fork or clone this repository
2. Go to Settings → Secrets and variables → Actions
3. Create two new secrets:
   - `APP_PASSWORD` = your chosen password
   - `GOOGLE_CLIENT_ID` = your Google Client ID (get from Google Cloud Console)
4. Push to main branch:
   ```bash
   git add .
   git commit -m "Configure for deployment"
   git push origin main
   ```
5. GitHub Actions will automatically:
   - Inject your real secrets into the build
   - Deploy to GitHub Pages
   - Keep your repository public with placeholder values (no exposed secrets!)
6. Your app will be live at: `https://yourusername.github.io/evernote-to-drive/`

> **Why this approach?** Your real credentials stay private in GitHub Secrets while your code stays public in the repository. The GitHub Actions workflow automatically replaces placeholders with real values during deployment.

#### Option B: Local Development

```bash
# 1. Edit config.js with your credentials
nano config.js
# Set: window.__APP_PASSWORD = 'your-password'
#      window.__GOOGLE_CLIENT_ID = 'your-client-id'

# 2. Install and run
npm install
npm run dev

# 3. Open http://localhost:5173
```

### 3. Use the Application

1. **Export from Evernote:** Export your notes as HTML from Evernote's desktop app
2. **Login:** Enter your application password
3. **Upload:** Drop the folder here or select it manually
4. **Review:** Check parsed notes and folder structure
5. **Connect Google Drive:** Sign in and select destination folder
6. **Upload:** All notes convert to DOCX and upload to your chosen location

## Privacy & Security Notes

- ✅ All processing happens in your browser (client-side)
- ✅ Your data is never stored on our servers
- ✅ Google authentication uses OAuth 2.0 (industry standard)
- ✅ Application password controls access (not a user password)
- ⚠️ Ensure your `config.js` or `.env` files are never committed with real credentials

## Architecture

- **Frontend:** Vanilla JavaScript (no build dependencies required for single-file deployment)
- **APIs:** Google Drive API v3, Google Docs API
- **Format:** Single HTML file with embedded CSS and JavaScript
- **No framework:** Pure vanilla JS for maximum compatibility and minimal dependencies

## Troubleshooting

**"Incorrect password"**
- Check the password in `config.js` or ask the developer

**"Couldn't load folders"**
- Verify your Google Client ID is correct
- Check that authorized URIs include your deployment URL
- Ensure Google Drive API is enabled in Cloud Console

**"Upload failed"**
- Check your Google Drive storage quota
- Verify the destination folder exists and is accessible
- Try uploading fewer notes at once

## License

Private project — for personal use

## Questions?

This is a standalone migration tool with no backend. All issues are likely configuration-related. Refer to:
- [Google Cloud Console](https://console.cloud.google.com/) for OAuth setup
- Browser DevTools Console for error messages
- The error messages in the app (they're plain-language)

---

**Built with ❤️ for migrating notes with care**
