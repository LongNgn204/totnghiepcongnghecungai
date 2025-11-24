#!/bin/bash

# Script to batch replace old color classes with new cyan/teal theme
# Re-theme: Blue/Purple/Violet -> Cyan/Teal Science Lab Theme

cd /media/longkhtn/WINDOWS/Users/Long/Downloads/totnghiepcongnghecungai

# Find all TypeScript/TSX files
FILES=$(find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "./node_modules/*" -not -path "./.git/*")

echo "Batch replacing colors in all TS/TSX files..."

for file in $FILES; do
  # Skip if file doesn't exist
  [ ! -f "$file" ] && continue
  
  # Replace Tailwind color classes
  sed -i 's/from-blue-500 to-purple-500/from-primary to-accent/g' "$file"
  sed -i 's/from-blue-600 to-purple-600/from-primary to-accent/g' "$file"
  sed -i 's/from-purple-500 to-pink-500/from-primary to-accent/g' "$file"
  sed -i 's/from-blue-50 via-indigo-50 to-purple-50/from-cyan-50 via-teal-50 to-slate-50/g' "$file"
  
  # Replace specific blue classes
  sed -i 's/text-blue-500/text-primary/g' "$file"
  sed -i 's/text-blue-600/text-primary/g' "$file"
  sed -i 's/text-blue-700/text-primary/g' "$file"
  sed -i 's/bg-blue-500/bg-primary/g' "$file"
  sed -i 's/bg-blue-600/bg-primary/g' "$file"
  sed -i 's/hover:bg-blue-600/hover:bg-primary-hover/g' "$file"
  sed -i 's/hover:bg-blue-700/hover:bg-primary-hover/g' "$file"
  sed -i 's/border-blue-400/border-primary/g' "$file"
  sed -i 's/border-blue-500/border-primary/g' "$file"
  
  # Replace purple/violet classes
  sed -i 's/text-purple-500/text-accent/g' "$file"
  sed -i 's/text-purple-600/text-accent/g' "$file"
  sed -i 's/text-purple-700/text-accent/g' "$file"
  sed -i 's/text-violet-500/text-accent/g' "$file"
  sed -i 's/bg-purple-500/bg-accent/g' "$file"
  sed -i 's/bg-purple-600/bg-accent/g' "$file"
  sed -i 's/hover:bg-purple-600/hover:bg-accent/g' "$file"
  sed -i 's/hover:border-purple-500/hover:border-primary/g' "$file"
  sed -i 's/border-purple-500/border-primary/g' "$file"
  
  # Replace background classes (light versions)
  sed -i 's/bg-blue-50/bg-cyan-50/g' "$file"
  sed -i 's/bg-blue-100/bg-cyan-100/g' "$file"
  sed -i 's/hover:bg-blue-50/hover:bg-cyan-50/g' "$file"
  sed -i 's/hover:bg-blue-100/hover:bg-cyan-100/g' "$file"
  sed -i 's/bg-purple-50/bg-teal-50/g' "$file"
  sed -i 's/bg-purple-100/bg-teal-100/g' "$file"
  sed -i 's/hover:bg-purple-100/hover:bg-teal-100/g' "$file"
  
  # Replace border classes (light versions)
  sed -i 's/border-blue-200/border-cyan-200/g' "$file"
  sed -i 's/border-blue-300/border-cyan-300/g' "$file"
  sed -i 's/hover:border-blue-300/hover:border-cyan-300/g' "$file"
  sed -i 's/border-purple-200/border-teal-200/g' "$file"
  sed -i 's/border-purple-300/border-teal-300/g' "$file"
  
  # Replace focus ring classes
  sed -i 's/ring-blue-300/ring-cyan-300/g' "$file"
  sed -i 's/ring-blue-500/ring-primary/g' "$file"
  sed -i 's/focus:ring-blue-500/focus:ring-primary/g' "$file"
  
done

echo "Color replacement complete!"
echo "Files processed: $(echo $FILES | wc -w)"
