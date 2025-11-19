#!/bin/bash
# Husky Git Hooks Setup Script
# Run this script to initialize husky and setup pre-commit hooks

# Install husky
npm install husky --save-dev

# Initialize husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit 'npx lint-staged'

# Create pre-push hook
npx husky add .husky/pre-push 'npm run lint && npm test'

# Create commit-msg hook for conventional commits (optional)
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'

echo "✓ Husky hooks initialized successfully!"
echo ""
echo "Created hooks:"
echo "  - pre-commit: Runs lint-staged on staged files"
echo "  - pre-push: Runs linting and tests before push"
echo ""
echo "Next steps:"
echo "1. Update package.json with lint-staged configuration"
echo "2. Install commitlint if using commit-msg hook"
echo "3. Update .husky/commit-msg with your commitlint config"
