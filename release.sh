#!/bin/bash
# Usage: ./release.sh 1.5.0

set -e

if [ -z "$1" ]; then
  echo "Usage: ./release.sh <version>"
  echo "Example: ./release.sh 1.5.0"
  exit 1
fi

VERSION=$1

echo "Bumping version to $VERSION..."

# Update all package versions
jq ".version = \"$VERSION\"" packages/models/package.json > tmp.json && mv tmp.json packages/models/package.json
jq ".version = \"$VERSION\"" packages/common/package.json > tmp.json && mv tmp.json packages/common/package.json
jq ".version = \"$VERSION\"" packages/browser/package.json > tmp.json && mv tmp.json packages/browser/package.json
jq ".version = \"$VERSION\"" packages/node/package.json > tmp.json && mv tmp.json packages/node/package.json

# Update dependencies
jq ".dependencies[\"@sanduc/ocr-common\"] = \"^$VERSION\"" packages/browser/package.json > tmp.json && mv tmp.json packages/browser/package.json
jq ".dependencies[\"@sanduc/ocr-models\"] = \"^$VERSION\"" packages/browser/package.json > tmp.json && mv tmp.json packages/browser/package.json
jq ".dependencies[\"@sanduc/ocr-common\"] = \"^$VERSION\"" packages/node/package.json > tmp.json && mv tmp.json packages/node/package.json
jq ".dependencies[\"@sanduc/ocr-models\"] = \"^$VERSION\"" packages/node/package.json > tmp.json && mv tmp.json packages/node/package.json

echo "✓ Version bumped to $VERSION"

# Commit and tag (avoid symlink)
git add packages/models/package.json packages/common/package.json packages/browser/package.json packages/node/package.json
git commit -m "Release v$VERSION"
git tag "v$VERSION"

echo ""
echo "✓ Ready to release!"
echo "Run: git push && git push --tags"
