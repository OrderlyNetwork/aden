#!/usr/bin/env tsx

import * as fs from "fs";
import * as crypto from "crypto";
import * as path from "path";

const LOCALES_DIR = "public/locales";
const PROVIDER_FILE = "app/components/orderlyProvider/index.tsx";

function calculateAllLocalesHash(): string {
  const hash = crypto.createHash("sha256");

  // Read main locale files
  const mainFiles = fs
    .readdirSync(LOCALES_DIR)
    .filter((file) => file.endsWith(".json"))
    .sort(); // Sort for consistent hashing

  for (const file of mainFiles) {
    const filePath = path.join(LOCALES_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");
    hash.update(file); // Include filename in hash
    hash.update(content);
  }

  // Read extended locale files if they exist
  const extendDir = path.join(LOCALES_DIR, "extend");
  if (fs.existsSync(extendDir)) {
    const extendFiles = fs
      .readdirSync(extendDir)
      .filter((file) => file.endsWith(".json"))
      .sort(); // Sort for consistent hashing

    for (const file of extendFiles) {
      const filePath = path.join(extendDir, file);
      const content = fs.readFileSync(filePath, "utf8");
      hash.update(`extend/${file}`); // Include full path in hash
      hash.update(content);
    }
  }

  return hash.digest("hex").substring(0, 8); // Use first 8 characters for shorter version
}

function updateProviderFile(
  providerFilePath: string,
  newVersion: string
): void {
  let content = fs.readFileSync(providerFilePath, "utf8");

  // Replace the version parameter in the fetch URLs
  // Pattern: ?v=1 or ?v=any_existing_version
  content = content.replace(/(\?v=)[a-zA-Z0-9]+/g, `$1${newVersion}`);

  fs.writeFileSync(providerFilePath, content, "utf8");
}

function main(): void {
  try {
    console.log("🔄 Calculating hash for all locale files...");

    // Calculate hash of all locale files
    const localesHash = calculateAllLocalesHash();
    console.log(`📝 Generated version hash: ${localesHash}`);

    // Update the provider file
    console.log("🔄 Updating OrderlyProvider component...");
    updateProviderFile(PROVIDER_FILE, localesHash);

    console.log("✅ Locale version updated successfully!");
    console.log(`📄 Version: ${localesHash}`);
  } catch (error) {
    console.error("❌ Error updating locale version:", error);
    process.exit(1);
  }
}

// Run the script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
