/**
 * Utility script to convert CSV files to translations.ts
 * Run this script with Node.js to update the translations.ts file
 * 
 * Usage: node csvToTranslations.js
 */

import fs from 'fs';
import path from 'path';

// Function to parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const translations = {};
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Parse CSV line (handles quoted entries with commas inside)
    const match = lines[i].match(/(?:^|,)("(?:[^"]+|"")*"|[^,]*)/g);
    if (!match || match.length < 3) continue;
    
    const key = match[0].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
    // Remove any extra leading/trailing quotes from the values
    let ko = match[1].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
    let en = match[2].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
    
    // Additional cleanup to remove any leading double quotes
    ko = ko.replace(/^"/, '');
    en = en.replace(/^"/, '');
    
    if (key && ko && en) {
      translations[key] = { KO: ko, EN: en };
    }
  }
  
  return translations;
}

// Function to merge multiple translation objects
function mergeTranslations(translationsArray) {
  return translationsArray.reduce((result, current) => {
    return { ...result, ...current };
  }, {});
}

// Function to generate TypeScript file
function generateTSFile(translations) {
  const categories = {
    nav: [],
    guide: [],
    crypto: [],
    data: [],
    community: [],
    ranking: [],
    auth: [],
    footer: [],
    main: [],
    userInfo: [],
    chat: [],
    alert: [],
    trading: [],
    demoGuide: [],
    miningGuide: [],
    swapGuide: [],
    gateio: [],
    tradingModal: [],
    marginModal: [],
    leverageModal: [],
    limitCloseBtn: [],
    marketCloseBtn: [],
    bulkCloseBtn: [],
    alert: [],
    usdtTrans: [],
    analysis: [],
    news: [],
    board: [],
    boardAlert: [],
    top100: [],
    hallOfFame: [],
    market: [],
    myInfo: [],
    myItem: [],
    myUsdt: [],
    myBugs: [],
    myWallet: [],
    common: [],
    placeholder: []
  };
  
  // Group keys by category
  Object.keys(translations).forEach(key => {
    const category = key.split('.')[0];
    if (categories[category]) {
      categories[category].push(key);
    } else {
      categories.common.push(key);
    }
  });
  
  let output = `export type Language = 'KO' | 'EN';\n\n`;
  output += `export interface TranslationDictionary {\n`;
  output += `  [key: string]: {\n`;
  output += `    KO: string;\n`;
  output += `    EN: string;\n`;
  output += `  };\n`;
  output += `}\n\n`;
  output += `const translations: TranslationDictionary = {\n`;
  
  // Output translations by category
  Object.keys(categories).forEach(category => {
    if (categories[category].length === 0) return;
    
    output += `  // ${category} related translations\n`;
    categories[category].forEach(key => {
      output += `  '${key}': {\n`;
      output += `    KO: '${translations[key].KO.replace(/'/g, "\\'")}',\n`;
      output += `    EN: '${translations[key].EN.replace(/'/g, "\\'")}'\n`;
      output += `  },\n`;
    });
    output += '\n';
  });
  
  output += `};\n\n`;
  output += `export default translations;`;
  
  return output;
}

// Main function
async function main() {
  try {
    // Get the directory of the current script using import.meta.url
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    // On Windows, remove the leading slash
    const normalizedDir = process.platform === 'win32' 
      ? currentDir.substring(1) 
      : currentDir;
    
    const csvFiles = [
      path.join(normalizedDir, 'translations.csv'),
      path.join(normalizedDir, 'translations2.csv'),
      path.join(normalizedDir, 'translations3.csv'),
      path.join(normalizedDir, 'translations4.csv'),
      path.join(normalizedDir, 'translations5.csv'),
      path.join(normalizedDir, 'translations6.csv'),
      path.join(normalizedDir, 'translations7.csv'),
      path.join(normalizedDir, 'translations8.csv')
    ];
    
    const translationsArray = csvFiles.map(file => {
      try {
        return parseCSV(file);
      } catch (err) {
        console.error(`Error parsing ${file}:`, err);
        return {};
      }
    });
    
    const mergedTranslations = mergeTranslations(translationsArray);
    const tsContent = generateTSFile(mergedTranslations);
    
    fs.writeFileSync(path.join(normalizedDir, 'translations.ts'), tsContent);
    console.log('Successfully generated translations.ts');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 