/**
 * Configuration loader for Evernote to Google Docs migration tool
 *
 * PRODUCTION (GitHub Pages with GitHub Secrets):
 * - Leave placeholders as-is
 * - Set real values in GitHub Secrets (APP_PASSWORD, GOOGLE_CLIENT_ID)
 * - GitHub Actions will inject them at deployment time
 *
 * LOCAL DEVELOPMENT:
 * - Replace placeholders below with your actual credentials
 * - DO NOT commit this file with real credentials to version control
 * - The placeholder values ensure accidental commits stay secure
 */

// Application password for access control
// Set via GitHub Secrets (APP_PASSWORD) in GitHub Actions for production
// For local dev: Replace 'byeevernote' with your password
window.__APP_PASSWORD = 'byeevernote';

// Google OAuth 2.0 Client ID
// Set via GitHub Secrets (GOOGLE_CLIENT_ID) in GitHub Actions for production
// For local dev: Replace '346028058051-elmqlvgkhjo94jt4a0hsb7res3dlcnm0.apps.googleusercontent.com' with your Client ID
//
// To get your Client ID:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project (or select existing one)
// 3. Enable "Google Drive API"
// 4. Go to Credentials → Create "OAuth 2.0 Web Application"
// 5. Add these authorized redirect URIs:
//    - http://localhost:5173 (for local development with npm run dev)
//    - https://yourusername.github.io/evernote-to-drive/ (for GitHub Pages)
// 6. Copy the Client ID and paste it below
window.__GOOGLE_CLIENT_ID = '346028058051-elmqlvgkhjo94jt4a0hsb7res3dlcnm0.apps.googleusercontent.com';
// Random
