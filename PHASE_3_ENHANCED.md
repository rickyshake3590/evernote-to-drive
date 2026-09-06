# Phase 3 Enhanced — Folder Mapping & Google Drive Selection

## Overview

**Phase 3 has been significantly enhanced** to combine folder structure mapping with direct Google Drive folder selection in a single, integrated interface. Users can now:
1. Map their Evernote folders to custom destination names
2. Sign in to their Google account
3. Browse and select a destination folder on Google Drive
4. All in one seamless experience

## Key Updates

### 1. **Google Sign-In Integration**
**Location:** Top of Phase 3 interface

**Features:**
- Google Sign-In button for easy authentication
- Shows current sign-in status with user email
- Status indicator: "●Not signed in" → "✓ Signed in as user@gmail.com"
- One-click sign-in for convenience

**User Experience:**
- Click Google Sign-In button
- Authenticate with Google account
- Button updates to show "Signed in as..."
- Drive folder browser automatically becomes available

### 2. **Folder Mapping Section** (Left Column)
- Shows source Evernote folder structure
- Editable destination folder names
- Same as original Phase 3 (no changes)
- Maps where each folder will go in Drive

### 3. **Google Drive Folder Browser** (Right Column)
**New Section: "Select Google Drive Destination Folder"**

**Features:**
- Only appears after user signs in
- Shows folder hierarchy from Google Drive
- Maximum 3 levels deep (prevents too much nesting)
- Only shows folder names (not files)
- Breadcrumb navigation showing current location
- Right arrow (►) indicates navigable folders
- Click to drill down into subfolders
- Click current folder name to select that location

**Navigation Pattern:**
```
📂 My Drive (Root)
├─ My Projects ►
├─ Archive ►
└─ Templates ►
```

Click "My Projects ►" to open:
```
📂 My Drive > My Projects
├─ 2024 Project A ►
├─ 2024 Project B ►
└─ Archived ►
```

### 4. **Selected Folder Display**
After selecting a destination:
- Shows "Selected Destination" label
- Displays full folder path (e.g., "My Drive > My Projects > 2024 Project A")
- Green highlight indicating confirmed selection
- User can change selection anytime by clicking other folders

### 5. **Migration Summary**
Shows what will be created:
- Total Folders to Create
- Total Notes to Upload
- Total Resources to Embed

### 6. **Important Design Decision: No Create Folder**
**Intentional Limitation:**
- ❌ No "New Folder" button in the app
- ❌ Cannot create folders through the migration app
- ✅ Users must create folders manually in Google Drive

**Why:**
- Forces users to think about folder structure before migration
- Prevents accidental folder creation
- Ensures destination folders already exist (less error-prone)
- Users own their folder organization decision

**User Flow:**
1. Think about desired folder structure
2. Open Google Drive in another window
3. Create folders as needed
4. Return to migration app
5. Use folder browser to select created folder

### 7. **Action Buttons**
- **← Back** - Return to Phase 2, can start mapping over
- **Proceed to Phase 4 →** - Continue to upload (only enabled if folder selected)

**Validation:**
- "Proceed" button checks that a Drive folder has been selected
- Shows alert if user tries to proceed without selecting destination
- Ensures required information is complete

## User Journey

### Complete Phase 3 Workflow

**Step 1: Review Folder Mapping**
```
Left column shows Evernote structure
Right column shows customizable destination names
Edit any destination names as needed
```

**Step 2: Open Google Drive in New Tab/Window**
```
Navigate to Google Drive
Create your desired folder structure
(This is NOT done in the app)
```

**Step 3: Sign Into App**
```
Click "Sign in with Google" button
Authenticate with Google account
See "Signed in as your-email@gmail.com"
```

**Step 4: Browse Drive Folders**
```
Right section shows Google Drive folders
Max 3 levels deep for usability
Click folder names with ► to navigate
Select final destination folder
```

**Step 5: Confirm & Proceed**
```
Review migration summary
Confirm folder mapping is correct
Confirm destination folder is selected
Click "Proceed to Phase 4 →"
```

## Technical Implementation

### Google Sign-In
- Uses Google Identity Services library
- PKCE flow (No client secret exposed)
- `drive.file` scope (least privilege)
- Callback updates UI when authenticated

### Drive Folder Browsing
- Calls Google Drive API v3
- Lists only folders (mimeType: `application/vnd.google-apps.folder`)
- Limits recursion to 3 levels
- Does NOT show files
- Does NOT provide create folder functionality

### State Management
```javascript
selectedDriveFolderId = "folder_id_from_drive"
selectedDriveFolderPath = "My Drive > Projects > 2024"
folderMapping = { "Cooking": "Cooking", ... }
```

### Validation
- Checks that folder has been selected before proceeding
- Prevents accidental skip of folder selection
- Clear error message if missing

## UX Improvements

| Aspect | Previous | Enhanced |
|--------|----------|----------|
| **Auth** | Phase 4 | Phase 3 (earlier) |
| **Drive Selection** | Separate phase | Integrated here |
| **Folder Limit** | Unlimited nesting | Max 3 levels |
| **File List** | Shows files too | Only folders |
| **Create Folder** | Via app | Manual in Drive |
| **Validation** | None | Required selection |

## Important Notes

### Google OAuth Setup Required
To enable real Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Web Application)
5. Set authorized JavaScript origins to your app's domain
6. Set authorized redirect URIs
7. Copy Client ID
8. **In index.html, replace:**
   ```javascript
   client_id: 'YOUR_GOOGLE_CLIENT_ID_HERE'
   ```
   with your actual Client ID

### Current Demo Mode
- Google Sign-In button shows but may not authenticate fully
- Folder browser shows mock interface
- Production needs actual OAuth Client ID
- Core UI/UX flow is complete and testable

## Phase Flow After Phase 3

**Phase 4 (Next):**
- Will handle actual upload initiation
- Uses selected folder ID from Phase 3
- Uses folder mapping from Phase 3
- Creates folder structure on Drive
- Uploads all notes

**Phase 5:**
- Upload execution with progress tracking
- Error handling and retries

**Phase 6:**
- Polish and optimizations

## Files Modified

**index.html:**
- Added Google Sign-In script tag
- Added Google Drive folder browser CSS
- Added Drive sign-in section HTML
- Added folder browser UI section
- Added Google auth state variables
- Added `initializeGoogleSignIn()` function
- Added `handleSignInResponse()` function
- Added `loadDriveFolders()` function
- Added `selectDriveFolder()` function
- Added `resetDriveBrowse()` function
- Updated `displayMappingUI()` to show Drive section

## Summary

Phase 3 now provides **complete folder customization and Drive destination selection** in one integrated interface:

✅ Map Evernote folders to custom names
✅ Sign in to Google account
✅ Browse Google Drive folders (max 3 levels)
✅ Select destination folder for migration
✅ Validation ensuring folder is selected
✅ No ability to create folders (intentional)
✅ Clear summary of what will be created

**Phase 3 Ready:** All folder mapping and Drive selection in one step

**Next:** Phase 4 - Upload Execution
