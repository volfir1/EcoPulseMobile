const fs = require('fs');
const path = require('path');

// Path to the settings.gradle.kts file in the React Native Gradle plugin
const filePath = path.join(__dirname, 'node_modules', '@react-native', 'gradle-plugin', 'settings.gradle.kts');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove or comment out the Java toolchain configuration
  content = content.replace(
    /java\s*{\s*toolchain\s*{\s*languageVersion\.set\(JavaLanguageVersion\.of\(\d+\)\)\s*}\s*}/g, 
    '// Java toolchain configuration removed to avoid conflicts\n'
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Successfully patched settings.gradle.kts');
} else {
  console.error('Could not find settings.gradle.kts file');
}