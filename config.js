/**
 * Configuration loader for Evernote to Google Docs migration tool
 *
 * This file allows you to set credentials via window globals instead of environment variables.
 * Modify the values below with your own credentials before deploying.
 *
 * DO NOT commit this file with real credentials to version control.
 * Keep it in .gitignore when using real credentials.
 */

// Application password for access control
// Change this to your desired password
window.__APP_PASSWORD = 'byeevernote';

// Google OAuth 2.0 Client ID
// Get this from: https://console.cloud.google.com/
// Instructions:
// 1. Go to Google Cloud Console
// 2. Create a new project or select existing one
// 3. Enable Google Drive API
// 4. Create OAuth 2.0 Web credentials
// 5. Add authorized redirect URIs (your GitHub Pages URL, localhost:5173 for dev)
// 6. Copy the Client ID here
window.__GOOGLE_CLIENT_ID = '346028058051-elmqlvgkhjo94jt4a0hsb7res3dlcnm0.apps.googleusercontent.com';
