#!/bin/bash
set -e

# Build tictactoe app
pnpm --filter @workspace/tictactoe run build

# Move dist folder to public
mkdir -p public
mv artifacts/tictactoe/dist/* public/

echo "Build completed successfully. Output at public/"

