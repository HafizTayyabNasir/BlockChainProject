#!/bin/bash
set -e

# Build tictactoe app
cd artifacts/tictactoe
pnpm run build

# Create output directory at root level for Vercel
mkdir -p ../../.output/dist
cp -r dist/* ../../.output/dist/

echo "Build completed. Output ready at .output/dist"
