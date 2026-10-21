import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const notionContentDir = path.join(rootDir, 'notion-content');
const outputDir = path.join(rootDir, 'src', 'data');
const outputFile = path.join(outputDir, 'content.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Ensure public/assets directory exists and syncs assets
const publicDir = path.join(rootDir, 'public');
const publicAssetsDir = path.join(publicDir, 'assets');
const sourceAssetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(publicAssetsDir)) {
  try {
    fs.symlinkSync(path.relative(publicDir, sourceAssetsDir), publicAssetsDir, 'junction');
  } catch {
    fs.cpSync(sourceAssetsDir, publicAssetsDir, { recursive: true });
  }
}

const platforms = [];
const writeups = [];

function formatDate(val) {
  if (!val) return '2026-10-20';
  if (val instanceof Date) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(val).slice(0, 10);
}

if (fs.existsSync(notionContentDir)) {
  const platformDirs = fs.readdirSync(notionContentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'));

  for (const platDir of platformDirs) {
    const platformName = platDir.name;
    const platPath = path.join(notionContentDir, platformName);
    
    let platformDesc = `Comprehensive challenge documentation for ${platformName} cybersecurity challenges.`;
    const descriptionsBySlug = {};

    const readmePath = path.join(platPath, 'README.md');
    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf-8');
      const descMatch = readmeContent.match(/<p class="platform-overview-desc">(.*?)<\/p>/s);
      if (descMatch && descMatch[1]) {
        platformDesc = descMatch[1].replace(/walkthroughs and methodology documentation/i, 'documentation').trim();
      }

      // Parse writeup descriptions from rows
      const rowRegex = /<a href="([^"]+)\/" class="writeup-row__title">.*?<\/a>\s*<p class="writeup-row__desc">(.*?)<\/p>/gs;
      let match;
      while ((match = rowRegex.exec(readmeContent)) !== null) {
        const slug = match[1].trim();
        const desc = match[2].trim();
        descriptionsBySlug[slug] = desc;
      }
    }

    const files = fs.readdirSync(platPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md') && dirent.name !== 'README.md');

    const platformWriteups = [];

    for (const file of files) {
      const fullPath = path.join(platPath, file.name);
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      const { data, content } = matter(rawContent);
      const slug = file.name.replace(/\.md$/, '');

      // Normalize image paths in markdown (e.g. ../assets/ -> assets/)
      const normalizedContent = content.replace(/\.\.\/assets\//g, 'assets/');

      let desc = descriptionsBySlug[slug] || data.description || '';
      if (!desc) {
        const plainText = content
          .replace(/#+ .*/g, '')
          .replace(/<[^>]+>/g, '')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .replace(/!!!.*/g, '')
          .replace(/\n+/g, ' ')
          .trim();
        desc = plainText.slice(0, 140) + (plainText.length > 140 ? '...' : '');
      }

      // Parse tags (optional, e.g. ["week03"] or "week03")
      let tags = [];
      if (Array.isArray(data.tags)) {
        tags = data.tags.map(t => String(t).trim()).filter(Boolean);
      } else if (typeof data.tags === 'string' && data.tags.trim()) {
        try {
          const parsed = JSON.parse(data.tags);
          if (Array.isArray(parsed)) tags = parsed.map(t => String(t).trim()).filter(Boolean);
          else tags = [data.tags.trim()];
        } catch {
          tags = data.tags.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);
        }
      } else if (typeof data.tag === 'string' && data.tag.trim()) {
        tags = data.tag.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);
      }

      const item = {
        id: data.notion_id || slug,
        slug,
        title: data.title || slug,
        date: formatDate(data.date),
        platform: data.platform || platformName,
        category: data.category || 'Web Exploitation',
        difficulty: data.difficulty || 'Easy',
        tags,
        description: desc,
        content: normalizedContent,
      };

      writeups.push(item);
      platformWriteups.push(item);
    }

    platforms.push({
      name: platformName,
      slug: platformName.toLowerCase(),
      description: platformDesc,
      count: platformWriteups.length,
    });
  }
}

// Only include platforms that actually have writeups from Notion
const validPlatforms = platforms.filter(p => p.count > 0);

const outputData = {
  platforms: validPlatforms,
  writeups,
};

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf-8');
console.log(`Successfully generated content: ${validPlatforms.length} platforms, ${writeups.length} writeups.`);


