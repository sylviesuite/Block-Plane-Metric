#!/bin/bash

TYPE_NAME=$1
echo "🔍 Searching for $TYPE_NAME definition..."
TYPE_PATH=$(grep -rEl "export type\s+$TYPE_NAME\b" src/types | head -n 1)

if [[ -n "$TYPE_PATH" ]]; then
  echo "✅ Found $TYPE_NAME in: $TYPE_PATH"

  INDEX_FILE="src/types/index.ts"

  if grep -q "$TYPE_NAME" "$INDEX_FILE"; then
    echo "ℹ️ $TYPE_NAME is already exported in index.ts"
  else
    echo "+ Adding export to index.ts..."
    echo "export type { $TYPE_NAME } from './$(basename "$TYPE_PATH" .ts)';" >> "$INDEX_FILE"
    echo "☑️ Done. $TYPE_NAME now exported from index.ts"
  fi
else
  echo "❌ $TYPE_NAME not found in src/types. Please define it or check for typos."
fi
