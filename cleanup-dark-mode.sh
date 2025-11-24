#!/bin/bash

# LIGHT THEME CLEANUP - Remove all dark: classes
# Removes dark mode styling from all components
# ⚠️ EXCLUDES: LandingPage.tsx

cd /media/longkhtn/WINDOWS/Users/Long/Downloads/totnghiepcongnghecungai

echo "🌞 Starting LIGHT THEME cleanup - removing all dark: classes..."
echo "📋 Excluding: components/LandingPage.tsx"

# Find all TypeScript/TSX files except LandingPage
FILES=$(find components layouts utils src -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | grep -v "LandingPage.tsx")

COUNT=0

for file in $FILES; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue
  
  # Create backup
  cp "$file" "$file.backup_light" 2>/dev/null
  
  # Remove all dark: classes using sed
  # This regex removes dark: followed by any Tailwind class
  sed -i -E 's/\s*dark:[a-zA-Z0-9_\/-]+//g' "$file"
  
  # Also remove html.dark and .dark selectors from any CSS
  sed -i -E 's/html\.dark\s+[^{]+\{[^}]+\}//g' "$file"
  sed -i -E 's/\.dark\s+[^{]+\{[^}]+\}//g' "$file"
  
  # Check if file was modified
  if ! cmp -s "$file" "$file.backup_light"; then
    ((COUNT++))
    echo "✅ $file"
    rm "$file.backup_light"
  else
    rm "$file.backup_light" 2>/dev/null
  fi
done

echo ""
echo "🎨 Dark mode cleanup complete!"
echo "📊 Files modified: $COUNT"
echo "🌞 Light theme is now enforced!"
