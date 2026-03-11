#!/bin/bash
set -e

echo "🔧 Installing dependencies..."
bun install

echo "📦 Building common package..."
cd packages/common
bun run tsc --project tsconfig.build.json
bun run tsc-alias --project tsconfig.build.json

echo "🌐 Building browser package..."
cd ../browser
bun run tsc --project tsconfig.build.json
bun run tsc-alias --project tsconfig.build.json

echo "🖥️  Building node package..."
cd ../node
bun run tsc --project tsconfig.build.json
bun run tsc-alias --project tsconfig.build.json

cd ../..

echo "✅ Build complete!"
