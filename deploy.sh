#!/bin/bash

cd /home/khalidh/royal-safari-tours-next || exit

echo "🚀 Deploying royal-safari-tours-next..."

git pull origin main

echo "📦 Building frontend..."
cd frontend
npm ci
rm -rf .next
npm run build
cd ..

echo "📦 Building backend..."
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
cd ..

pm2 restart royal-safari-frontend royal-safari-backend

echo "✅ Deployment complete"