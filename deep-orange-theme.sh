#!/bin/bash

# DEEP ORANGE ENERGY - Optimized Batch Theme Replacement Script
# Replaces old color classes with new orange-based theme
# ⚠️ EXCLUDES: LandingPage.tsx and node_modules

cd /media/longkhtn/WINDOWS/Users/Long/Downloads/totnghiepcongnghecungai

echo "🔥 Starting DEEP ORANGE ENERGY theme conversion..."
echo "📋 Excluding: components/LandingPage.tsx, node_modules, workers/node_modules"

# Find all TypeScript/TSX files EXCEPT LandingPage and node_modules
FILES=$(find components layouts utils src -type f \( -name "*.tsx" -o -name "*.ts" \) 2>/dev/null | grep -v "LandingPage.tsx")

TOTAL=0
COUNT=0

for file in $FILES; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue
  
  # Create backup
  cp "$file" "$file.backup_orange" 2>/dev/null
  
  # === Replace colors (silent mode) ===
  # Gradients
  sed -i -e 's/from-blue-500 to-purple-500/from-primary to-primary-hover/g' \
         -e 's/from-blue-600 to-purple-600/from-primary to-primary-hover/g' \
         -e 's/from-purple-500 to-pink-500/from-primary to-primary-hover/g' \
         -e 's/from-cyan-500 to-teal-500/from-primary to-primary-hover/g' \
         -e 's/from-primary to-accent/from-primary to-primary-hover/g' \
         -e 's/from-blue-50 via-indigo-50 to-purple-50/from-orange-50 via-orange-100 to-slate-100/g' \
         -e 's/from-cyan-50 via-teal-50 to-slate-50/from-orange-50 via-orange-100 to-slate-100/g' \
         -e 's/text-blue-[0-9]\{3\}/text-primary/g' \
         -e 's/text-cyan-[0-9]\{3\}/text-primary/g' \
         -e 's/text-purple-[0-9]\{3\}/text-primary/g' \
         -e 's/text-violet-[0-9]\{3\}/text-primary/g' \
         -e 's/text-accent/text-primary/g' \
         -e 's/bg-blue-[56][0-9]\{2\}/bg-primary/g' \
         -e 's/bg-cyan-[56][0-9]\{2\}/bg-primary/g' \
         -e 's/bg-purple-[56][0-9]\{2\}/bg-primary/g' \
         -e 's/bg-accent/bg-primary/g' \
         -e 's/hover:bg-blue-[67][0-9]\{2\}/hover:bg-primary-hover/g' \
         -e 's/hover:bg-cyan-[67][0-9]\{2\}/hover:bg-primary-hover/g' \
         -e 's/hover:bg-purple-[67][0-9]\{2\}/hover:bg-primary-hover/g' \
         -e 's/border-blue-[0-9]\{3\}/border-primary/g' \
         -e 's/border-cyan-[0-9]\{3\}/border-primary/g' \
         -e 's/border-purple-[0-9]\{3\}/border-orange-200/g' \
         -e 's/border-primary/border-primary/g' \
         -e 's/bg-blue-50/bg-orange-50/g' \
         -e 's/bg-blue-100/bg-orange-100/g' \
         -e 's/bg-cyan-50/bg-orange-50/g' \
         -e 's/bg-cyan-100/bg-orange-100/g' \
         -e 's/bg-purple-50/bg-orange-50/g' \
         -e 's/bg-purple-100/bg-orange-100/g' \
         -e 's/bg-teal-50/bg-orange-50/g' \
         -e 's/bg-teal-100/bg-orange-100/g' \
         -e 's/hover:bg-blue-100/hover:bg-orange-100/g' \
         -e 's/hover:bg-cyan-100/hover:bg-orange-100/g' \
         -e 's/hover:bg-purple-100/hover:bg-orange-100/g' \
         -e 's/border-blue-200/border-orange-200/g' \
         -e 's/border-cyan-200/border-orange-200/g' \
         -e 's/border-purple-200/border-orange-200/g' \
         -e 's/border-teal-200/border-orange-200/g' \
         -e 's/ring-blue-[0-9]\{3\}/ring-primary/g' \
         -e 's/ring-cyan-[0-9]\{3\}/ring-primary/g' \
         -e 's/focus:ring-blue-500/focus:ring-primary/g' \
         -e 's/focus:ring-cyan-500/focus:ring-primary/g' \
         -e 's/text-blue-800/text-orange-900/g' \
         -e 's/text-cyan-800/text-orange-900/g' \
         "$file"
  
  # Check if file was modified
  if ! cmp -s "$file" "$file.backup_orange"; then
    ((COUNT++))
    echo "✅ $file"
    # Remove backup
    rm "$file.backup_orange"
  else
    # No changes, remove backup
    rm "$file.backup_orange" 2>/dev/null
  fi
done

echo ""
echo "🎨 Theme conversion complete!"
echo "📊 Files modified: $COUNT"
echo "🔥 DEEP ORANGE ENERGY theme is now active!"
