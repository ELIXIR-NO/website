#!/bin/bash

# Check if directory argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

DIR="$1"

# Check if directory exists
if [ ! -d "$DIR" ]; then
  echo "Directory does not exist: $DIR"
  exit 1
fi

# Lines to add
prepend="layout: \"../../layouts/page.astro\"
variant: \"article\""

# Loop through all .mdx files in the directory
for file in "$DIR"/*.mdx; do
  # Skip if no files found
  [ -e "$file" ] || continue

  # Check if file contains front matter
  if grep -q '^---' "$file"; then
    # Check if lines are already present
    if ! grep -q 'layout: "../../layouts/page.astro"' "$file"; then
      # Insert lines after first ---
      awk -v prepend="$prepend" 'NR==1{print; print prepend; next}1' "$file" > tmpfile && mv tmpfile "$file"
      echo "Updated $file"
    else
      echo "Already contains layout/variant: $file"
    fi
  else
    echo "No front matter found in $file, skipping..."
  fi
done

