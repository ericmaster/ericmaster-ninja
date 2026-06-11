#!/bin/bash
set -e

echo "🚀 Starting deployment to production..."

echo "📦 Building the static site..."
npm run build

echo "☁️ Deploying to Cloudflare Workers..."
npx wrangler deploy

echo "✅ Deployment complete!"
