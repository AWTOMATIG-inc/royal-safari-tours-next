#!/bin/bash

cd /home/khalidh/royal-safari-tours-next || exit

echo "🚀 Deploying royal-safari-tours-next..."

git pull origin main

echo "📁 Ensuring Media Uploads Directory..."
sudo mkdir -p /var/www/royal-safari-media
sudo chown -R www-data:www-data /var/www/royal-safari-media
sudo chmod -R 775 /var/www/royal-safari-media

# Symlink backend uploads to /var/www/royal-safari-media
mkdir -p /home/khalidh/royal-safari-tours-next/backend/uploads
sudo mount --bind /var/www/royal-safari-media /home/khalidh/royal-safari-tours-next/backend/uploads 2>/dev/null || true

echo "📦 Building Express Backend..."
cd backend
npm ci
npx prisma generate
npx prisma db push
npm run build
cd ..

echo "📦 Building Next.js Frontend..."
cd frontend
npm ci
rm -rf .next
npm run build
cd ..

echo "🔄 Restarting PM2 Services & Nginx..."
pm2 restart royal-safari-frontend royal-safari-backend
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment complete! Media pipeline & Unified PostgreSQL active."