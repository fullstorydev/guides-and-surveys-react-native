/**
 * Yarn's node-modules linker does not reliably symlink the root workspace into
 * example/node_modules (workspace:* / link:../ both no-op for the root package).
 * Expo and RN autolinking need that path so the package resolves by name —
 * same as a published install under node_modules/@fullstory/...
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const linkPath = path.join(
  root,
  'example/node_modules/@fullstory/guides-and-surveys-react-native'
);

fs.mkdirSync(path.dirname(linkPath), { recursive: true });

try {
  const stat = fs.lstatSync(linkPath);
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    fs.rmSync(linkPath, { recursive: true, force: true });
  }
} catch {
  // nothing to remove
}

fs.symlinkSync(root, linkPath, 'dir');
console.log(`Linked ${linkPath} -> ${root}`);
