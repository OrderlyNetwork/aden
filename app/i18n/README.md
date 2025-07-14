# Anttalk Multilingual System

This directory contains the multilingual translation system for the Anttalk application. The system allows the application to be displayed in multiple languages (currently Korean and English).

## How it Works

The system is built around a React context that provides translations to the entire application:

1. **TranslationContext**: The central context that manages the current language and provides translation functions.
2. **translations.ts**: Contains all translation key-value pairs.
3. **exportTranslations.ts**: Utility to export/import translations from CSV for easy editing.

## How to Use

### Basic Usage

Import the `useTranslation` hook in your component:

```tsx
import { useTranslation } from "../i18n/TranslationContext";

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('your.translation.key')}</h1>
      <p>Current language: {language}</p>
      <button onClick={() => setLanguage('KO')}>Switch to Korean</button>
    </div>
  );
}
```

### Adding New Translations

Add new translations to the `translations.ts` file:

```typescript
// In translations.ts
const translations: TranslationDictionary = {
  // ... existing translations
  
  'your.new.key': {
    KO: '한국어 번역',
    EN: 'English translation'
  }
};
```

### Managing Translations with CSV

You can export the translations to a CSV file for easier editing:

```bash
# Run the export script
npx ts-node -r esbuild-register app/i18n/exportTranslations.ts
```

After editing the CSV, you can import it back:

```typescript
import { importTranslationsFromCSV } from './i18n/exportTranslations';

// In a build script or utility
importTranslationsFromCSV('./path/to/updated-translations.csv');
```

## Translation Keys

Translation keys are organized by categories to make them easier to manage:

- `nav.*`: Navigation items
- `guide.*`: Guide-related texts
- `crypto.*`: Cryptocurrency-related texts
- `data.*`: Data and analysis texts
- `community.*`: Community section texts
- `ranking.*`: Ranking section texts
- `auth.*`: Authentication-related texts
- `footer.*`: Footer section texts
- `main.*`: Main page texts
- `userInfo.*`: User information section texts
- `chat.*`: Chat-related texts
- `alert.*`: Alert and notification texts
- `trading.*`: Trading-related texts
- `placeholder.*`: Form placeholders

## Best Practices

1. Use descriptive key names that indicate where and how the translation is used.
2. Keep translations organized by category.
3. Check if a translation key exists before adding a new one.
4. Try to reuse existing translations when possible.
5. Keep translations short and concise.
6. Consider context when translating. 