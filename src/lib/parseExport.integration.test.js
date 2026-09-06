import { describe, it, expect } from 'vitest';
import { parseEvernoteExport } from './parseExport.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Convert file system files to File objects for testing
 */
function fsFilesToFileObjects(rootPath) {
  const files = [];

  function walkDir(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativePath ? path.join(relativePath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        walkDir(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const file = new File([content], entry.name, {
          type: entry.name.endsWith('.html') ? 'text/html' : 'application/octet-stream'
        });
        file.webkitRelativePath = relPath;
        files.push(file);
      }
    });
  }

  walkDir(rootPath);
  return files;
}

describe('Evernote Export Parser - Integration Tests', () => {
  const realExportPath = '/Users/tanwz/Desktop/YA RN 2022';

  it('should be able to read the real export directory', () => {
    expect(fs.existsSync(realExportPath)).toBe(true);
  });

  it('should discover HTML files in real export', () => {
    const files = fsFilesToFileObjects(realExportPath);
    const htmlFiles = files.filter(f => f.name.endsWith('.html'));

    expect(htmlFiles.length).toBeGreaterThan(0);
    expect(htmlFiles.some(f => f.name === 'YA RN 1 Pastor How - 15522.html')).toBe(true);
  });

  it('should parse real Evernote export without errors', async () => {
    const files = fsFilesToFileObjects(realExportPath);

    const result = await parseEvernoteExport(files);

    // Should have parsed some notes
    expect(result.notes.length).toBeGreaterThan(0);

    // Should skip the index file
    expect(result.notes.every(n => n.filename !== 'Evernote_index.html')).toBe(true);

    // Should have discovered folder structure
    expect(result.folderStructure).toBeDefined();
    expect(result.folderStructure.name).toBe('Evernote Export');

    // Should have summary stats
    expect(result.summary).toBeDefined();
    expect(result.summary.totalNotes).toBe(result.notes.length);
  });

  it('should extract title and content from real notes', async () => {
    const files = fsFilesToFileObjects(realExportPath);
    const result = await parseEvernoteExport(files);

    const note = result.notes[0];

    // Should have extracted title
    expect(note.title).toBeDefined();
    expect(note.title.length).toBeGreaterThan(0);

    // Should have filename
    expect(note.filename).toBeDefined();
    expect(note.filename.endsWith('.html')).toBe(true);

    // Should have HTML content
    expect(note.html).toBeDefined();
    expect(note.html.length).toBeGreaterThan(0);
  });

  it('should clean up Evernote-specific markup in real notes', async () => {
    const files = fsFilesToFileObjects(realExportPath);
    const result = await parseEvernoteExport(files);

    const note = result.notes[0];

    // Should not contain Evernote classes
    expect(note.html).not.toContain('class="noteTitle"');
    expect(note.html).not.toContain('class="para"');
    expect(note.html).not.toContain('class="x3xxV"');

    // Should not contain Evernote attributes
    expect(note.html).not.toContain('data-resource-hash');
    expect(note.html).not.toContain('draggable="false"');
    expect(note.html).not.toContain('role="heading"');
  });

  it('should detect images in real notes', async () => {
    const files = fsFilesToFileObjects(realExportPath);
    const result = await parseEvernoteExport(files);

    // Real export might have images - verify structure is present
    result.notes.forEach(note => {
      expect(note).toHaveProperty('resourceCount');
      expect(typeof note.resourceCount).toBe('number');
      expect(note.resourceCount).toBeGreaterThanOrEqual(0);
    });
  });

  it('should produce valid output structure for real notes', async () => {
    const files = fsFilesToFileObjects(realExportPath);
    const result = await parseEvernoteExport(files);

    result.notes.forEach(note => {
      // Verify all required fields
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('filename');
      expect(note).toHaveProperty('html');
      expect(note).toHaveProperty('folderPath');
      expect(note).toHaveProperty('resourceCount');
      expect(note).toHaveProperty('parseWarnings');

      // Verify types
      expect(typeof note.title).toBe('string');
      expect(typeof note.filename).toBe('string');
      expect(typeof note.html).toBe('string');
      expect(typeof note.folderPath).toBe('string');
      expect(typeof note.resourceCount).toBe('number');
      expect(Array.isArray(note.parseWarnings)).toBe(true);
    });
  });
});
