/**
 * Phase 1: HTML parser & folder structure discovery
 * Pure JS module that parses Evernote HTML exports and extracts note content
 */

/**
 * Recursively discover folder structure and HTML files from a FileList or array of File objects
 * @param {FileList | File[]} files - Files from drag-drop or folder picker
 * @returns {Promise<{folderStructure: Object, notes: Array, failedFiles: Array}>}
 */
export async function parseEvernoteExport(files) {
  const fileArray = Array.from(files);

  // Build a hierarchical folder structure from file paths
  const folderStructure = buildFolderTree(fileArray);

  // Separate HTML files from attachment files
  const htmlFiles = fileArray.filter(f => f.name.endsWith('.html'));
  const filesByPath = buildFileMap(fileArray);

  // Parse each HTML file
  const notes = [];
  const failedFiles = [];

  for (const htmlFile of htmlFiles) {
    try {
      // Skip index files (Evernote_index.html)
      if (htmlFile.name === 'Evernote_index.html') continue;

      const htmlContent = await readFileAsText(htmlFile);
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

      // Extract title from filename (remove .html extension)
      const titleFromFile = htmlFile.name.replace('.html', '');
      const titleElement = doc.querySelector('title');
      const title = titleElement?.textContent || titleFromFile;

      // Extract folder path from file path
      const folderPath = extractFolderPath(htmlFile.webkitRelativePath || htmlFile.name);

      // Extract body content
      const bodyElement = doc.body;
      if (!bodyElement || !bodyElement.innerHTML.trim()) {
        failedFiles.push({
          filename: htmlFile.name,
          reason: 'No <body> element found or body is empty'
        });
        continue;
      }

      // Find all images and convert to data URIs
      const imgElements = bodyElement.querySelectorAll('img');
      const imageConversions = [];
      let resourceCount = 0;

      for (const img of imgElements) {
        const src = img.getAttribute('src');
        if (!src) continue;

        // Find the referenced attachment file
        const attachmentFile = findAttachmentFile(src, fileArray, htmlFile.webkitRelativePath);

        if (attachmentFile) {
          try {
            const dataUri = await fileToDataUri(attachmentFile);
            imageConversions.push({ img, src, dataUri });
            resourceCount++;
          } catch (e) {
            // Leave the image as-is if conversion fails
          }
        }
      }

      // Clone body to avoid modifying original
      const bodyClone = bodyElement.cloneNode(true);

      // Apply image conversions to clone
      const clonedImgs = bodyClone.querySelectorAll('img');
      imageConversions.forEach(({ src, dataUri }, idx) => {
        if (clonedImgs[idx]) {
          clonedImgs[idx].setAttribute('src', dataUri);
        }
      });

      // Clean up Evernote-specific classes and styles
      cleanupEvernoteMarkup(bodyClone);

      // Extract and convert checkboxes
      convertCheckboxes(bodyClone);

      // Get the cleaned HTML
      const html = bodyClone.innerHTML;

      notes.push({
        title,
        filename: htmlFile.name,
        html,
        folderPath,
        resourceCount,
        parseWarnings: []
      });
    } catch (error) {
      failedFiles.push({
        filename: htmlFile.name,
        reason: error.message
      });
    }
  }

  return {
    folderStructure,
    notes,
    failedFiles,
    summary: {
      totalNotes: notes.length,
      totalResources: notes.reduce((sum, n) => sum + n.resourceCount, 0),
      failedFiles: failedFiles.length
    }
  };
}

/**
 * Build a hierarchical folder structure from file paths
 */
function buildFolderTree(files) {
  const root = {
    name: 'Evernote Export',
    type: 'folder',
    children: []
  };

  const pathMap = new Map();
  pathMap.set('', root);

  // Extract unique folder paths
  const folderPaths = new Set();
  files.forEach(file => {
    const path = extractFolderPath(file.webkitRelativePath || file.name);
    if (path) {
      folderPaths.add(path);
    }
  });

  // Sort paths to ensure parent folders are created before children
  const sortedPaths = Array.from(folderPaths).sort();

  sortedPaths.forEach(path => {
    const parts = path.split('/').filter(Boolean);
    let currentPath = '';

    parts.forEach((part, idx) => {
      const prevPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const parent = pathMap.get(prevPath);
        const folderNode = {
          name: part,
          type: 'folder',
          path: currentPath,
          children: []
        };
        parent.children.push(folderNode);
        pathMap.set(currentPath, folderNode);
      }
    });
  });

  // Count files per folder
  files.forEach(file => {
    if (!file.name.endsWith('.html') || file.name === 'Evernote_index.html') return;

    const path = extractFolderPath(file.webkitRelativePath || file.name);
    const folderNode = pathMap.get(path || '');
    if (folderNode) {
      folderNode.fileCount = (folderNode.fileCount || 0) + 1;
    }
  });

  return root;
}

/**
 * Extract folder path from file path
 */
function extractFolderPath(relativePath) {
  if (!relativePath) return '';
  const lastSlash = relativePath.lastIndexOf('/');
  return lastSlash > 0 ? relativePath.substring(0, lastSlash) : '';
}

/**
 * Build a map of all files by their paths for quick lookup
 */
function buildFileMap(files) {
  const map = new Map();
  files.forEach(file => {
    const path = file.webkitRelativePath || file.name;
    map.set(path, file);
  });
  return map;
}

/**
 * Find an attachment file referenced by an image src
 */
function findAttachmentFile(src, files, htmlFilePath) {
  // Handle relative paths like "../_files/image.jpg" or "folder/_files/image.jpg"
  // or "YA RN 1 Pastor How - 15522 files/image.jpg"

  const htmlFolder = extractFolderPath(htmlFilePath || '');

  // Try exact match first (for webkitRelativePath)
  for (const file of files) {
    const filePath = file.webkitRelativePath || file.name;
    if (filePath.endsWith(src) || filePath.endsWith(src.split('/').pop())) {
      return file;
    }
  }

  // Try relative to HTML file's folder
  if (htmlFolder && src.startsWith('../')) {
    const resolvedPath = htmlFolder.split('/').slice(0, -1).join('/') + '/' + src.substring(3);
    for (const file of files) {
      const filePath = file.webkitRelativePath || file.name;
      if (filePath === resolvedPath || filePath.endsWith(src.split('/').pop())) {
        return file;
      }
    }
  }

  // Try relative to same folder
  if (htmlFolder) {
    const folderRelativePath = htmlFolder + '/' + src;
    for (const file of files) {
      const filePath = file.webkitRelativePath || file.name;
      if (filePath === folderRelativePath) {
        return file;
      }
    }
  }

  // Try just the filename
  const filename = src.split('/').pop();
  for (const file of files) {
    if (file.name === filename) {
      return file;
    }
  }

  return null;
}

/**
 * Convert a File to a data URI
 */
function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Read a File as text
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Clean up Evernote-specific markup
 * Remove Evernote-specific classes and styles while preserving content
 */
function cleanupEvernoteMarkup(element) {
  // List of Evernote-specific classes to remove
  const evernoteClasses = [
    'noteTitle', 'para', 'UrtAp', 'peso', 'x3xxV',
    'highlight-color', 'en-note', 'en-note-style'
  ];

  // Remove Evernote-specific class names while preserving structure
  element.querySelectorAll('*').forEach(el => {
    const classList = Array.from(el.classList);
    classList.forEach(cls => {
      if (evernoteClasses.some(ecls => cls.includes(ecls)) || cls.startsWith('-en-')) {
        el.classList.remove(cls);
      }
    });

    // Remove Evernote-specific attributes
    el.removeAttribute('data-resource-hash');
    el.removeAttribute('draggable');
    el.removeAttribute('role');
    el.removeAttribute('aria-level');
  });

  // Clean up inline styles with Evernote color variables
  element.querySelectorAll('[style]').forEach(el => {
    let style = el.getAttribute('style');
    if (style) {
      // Remove Evernote-specific CSS variables
      style = style.replace(/--darkmode-color:[^;]*;?/g, '');
      style = style.replace(/--lightmode-color:[^;]*;?/g, '');
      style = style.trim();

      if (style) {
        el.setAttribute('style', style);
      } else {
        el.removeAttribute('style');
      }
    }
  });
}

/**
 * Convert Evernote checkboxes to HTML input checkboxes
 * Evernote uses specific class patterns for todos
 */
function convertCheckboxes(element) {
  // Look for common checkbox patterns in Evernote exports
  // Evernote typically represents checkboxes as divs or spans with specific classes

  element.querySelectorAll('[class*="checkbox"], [class*="todo"], input[type="checkbox"]').forEach(el => {
    if (el.tagName === 'INPUT' && el.type === 'checkbox') {
      // Already a checkbox, skip
      return;
    }

    // Convert other representations to proper checkboxes
    const isChecked = el.classList.contains('checked') ||
                     el.getAttribute('data-checked') === 'true' ||
                     el.textContent.includes('☑');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;
    checkbox.disabled = true;

    // Preserve any text content after the checkbox
    const text = el.textContent;
    el.replaceWith(checkbox);

    if (text && text.trim()) {
      const span = document.createElement('span');
      span.textContent = ' ' + text;
      checkbox.parentNode.insertBefore(span, checkbox.nextSibling);
    }
  });
}
