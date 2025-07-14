import fs from 'fs';
import translations from './translations';

/**
 * Export translations to CSV file
 * This script can be run to generate a CSV file of all translations
 * Use: node -r esbuild-register exportTranslations.ts
 */
export function exportTranslationsToCSV(outputPath: string = './translations.csv'): void {
  try {
    // Create CSV header
    let csvContent = 'Key,Korean (KO),English (EN)\n';
    
    // Add each translation row
    Object.entries(translations).forEach(([key, values]) => {
      csvContent += `"${key}","${values.KO.replace(/"/g, '""')}","${values.EN.replace(/"/g, '""')}"\n`;
    });
    
    // Write to file
    fs.writeFileSync(outputPath, csvContent);
    console.log(`Translations exported to ${outputPath}`);
  } catch (error) {
    console.error('Error exporting translations:', error);
  }
}

// Auto-execute if this script is run directly
if (require.main === module) {
  exportTranslationsToCSV();
}

/**
 * Import translations from CSV
 * This allows for updating translations from an external file
 */
export function importTranslationsFromCSV(filePath: string): void {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // Parse CSV line (handles quoted entries with commas inside)
      const match = lines[i].match(/(?:^|,)("(?:[^"]+|"")*"|[^,]*)/g);
      if (!match || match.length < 3) continue;
      
      const key = match[0].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
      const ko = match[1].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
      const en = match[2].replace(/^,|^"|"$/g, '').replace(/""/g, '"').trim();
      
      if (key && translations[key]) {
        translations[key].KO = ko;
        translations[key].EN = en;
      }
    }
    
    console.log('Translations imported successfully');
  } catch (error) {
    console.error('Error importing translations:', error);
  }
} 