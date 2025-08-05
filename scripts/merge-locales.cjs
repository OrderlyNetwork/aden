// scripts/merge-locales.cjs
// Usage: node scripts/merge-locales.cjs
// Merges node_modules/@orderly.network/i18n/dist/locales/{en,ko}.json into public/locales/{en,ko}.json
// Keeps custom keys from public, but updates/overwrites with node_modules values

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'ko'];
const SRC_BASE = path.join(__dirname, '../node_modules/@orderly.network/i18n/dist/locales');
const DEST_BASE = path.join(__dirname, '../public/locales');

// Only add keys from source (new) that do not exist in target (old), do not overwrite existing values
function mergeDeepAddOnly(target, source) {
    // Iterate over each key in source
    for (const key of Object.keys(source)) {
        // If target does not have this key, add it
        if (!(key in target)) {
            target[key] = source[key];
            // If both are objects (and not arrays), recursively merge child objects
        } else if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])
        ) {
            mergeDeepAddOnly(target[key], source[key]);
        }
        // If target already has this key and it's not an object, keep the original value in target
    }
    return target;
}

for (const locale of LOCALES) {
    const srcFile = path.join(SRC_BASE, `${locale}.json`);
    const destFile = path.join(DEST_BASE, `${locale}.json`);

    if (!fs.existsSync(srcFile)) {
        console.warn(`[merge-locales] Source file not found: ${srcFile}`);
        continue;
    }

    let srcJson = {};
    let destJson = {};
    try {
        srcJson = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
    } catch (e) {
        console.error(`[merge-locales] Failed to parse source: ${srcFile}`);
        continue;
    }
    if (fs.existsSync(destFile)) {
        try {
            destJson = JSON.parse(fs.readFileSync(destFile, 'utf8'));
        } catch (e) {
            console.warn(`[merge-locales] Failed to parse dest: ${destFile}, will overwrite.`);
        }
    }

    // Only add new keys from node_modules, do not overwrite existing keys in public
    // mergeDeepAddOnly(target, source): use target as base, only add missing keys from source
    const merged = mergeDeepAddOnly({ ...destJson }, srcJson);
    fs.writeFileSync(destFile, JSON.stringify(merged, null, 2), 'utf8');
    console.log(`[merge-locales] Added new keys from ${srcFile} -> ${destFile}`);
}
