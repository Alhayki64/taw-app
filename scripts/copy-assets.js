const fs = require('fs');
const path = require('path');

// Files at the root that must be copied into dist/ for production
const filesToCopy = [
  'config.js',
  'dynamic-badges.js',
  'fallback-illustrations.js',
  'i18n.js',
  'index.css',
  'live-data.js',
  'points.js',
  'supabaseClient.js',
  'sw.js',
  'manifest.json',
  'taw-logo.png',
  'default_avatar.png',
  'fallback-education.png',
  'fallback-elderly.png',
  'fallback-environment.png',
];

const distDir = path.join(__dirname, '..', 'dist');

filesToCopy.forEach(file => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} → dist/${file}`);
  } else {
    console.warn(`⚠ Skipped ${file} (not found)`);
  }
});

// Copy js/ module directory
const jsSrc = path.join(__dirname, '..', 'js');
const jsDest = path.join(distDir, 'js');
if (fs.existsSync(jsSrc)) {
  if (!fs.existsSync(jsDest)) fs.mkdirSync(jsDest, { recursive: true });
  fs.readdirSync(jsSrc).forEach(file => {
    fs.copyFileSync(path.join(jsSrc, file), path.join(jsDest, file));
    console.log(`✓ Copied js/${file} → dist/js/${file}`);
  });
}

console.log('\n✅ Asset copy complete.');
