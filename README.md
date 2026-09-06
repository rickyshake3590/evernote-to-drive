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

## Usage

1. **Export from Evernote:** Export your notes as HTML from Evernote's desktop app
2. **Upload:** Drop the folder here or select it manually
3. **Review:** Check parsed notes and folder structure
4. **Connect Google Drive:** Sign in and select destination folder
5. **Upload:** All notes convert to DOCX and upload to your chosen location

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
- Check the password in `config.js`
- Default: `byeevernote`

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
