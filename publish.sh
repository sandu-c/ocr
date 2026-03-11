#!/bin/bash
set -e

# Build all packages
cd packages/common && rm -rf build && bun run tsc --project tsconfig.build.json --skipLibCheck && bun run tsc-alias --project tsconfig.build.json && cd ../..
cd packages/browser && rm -rf build && bun run tsc --project tsconfig.build.json --skipLibCheck && bun run tsc-alias --project tsconfig.build.json && cd ../..
cd packages/node && rm -rf build && bun run tsc --project tsconfig.build.json --skipLibCheck && bun run tsc-alias --project tsconfig.build.json && cd ../..

# Publish with builds
cd packages/common && cp ../../README.md . && npm publish --access public --ignore-scripts && cd ../..
cd packages/browser && cp ../../README.md . && npm publish --access public --ignore-scripts && cd ../..
cd packages/node && cp ../../README.md . && npm publish --access public --ignore-scripts && cd ../..

echo "Done!"
