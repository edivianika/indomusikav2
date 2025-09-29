#!/usr/bin/env node

/**
 * Script untuk clear cache di development
 * Usage: node scripts/clear-cache.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing development cache...');

// Clear Next.js cache
const nextCacheDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCacheDir)) {
  console.log('📁 Clearing .next cache...');
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
}

// Clear node_modules cache
const nodeModulesDir = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(nodeModulesDir)) {
  console.log('📦 Clearing node_modules cache...');
  // Don't remove node_modules, just log
  console.log('⚠️  node_modules detected - consider running: npm ci');
}

// Clear browser cache instructions
console.log('\n🌐 Browser Cache Clear Instructions:');
console.log('1. Open Developer Tools (F12)');
console.log('2. Right-click on refresh button');
console.log('3. Select "Empty Cache and Hard Reload"');
console.log('4. Or use Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)');

// Clear Service Worker cache instructions
console.log('\n⚙️  Service Worker Cache Clear:');
console.log('1. Open Developer Tools (F12)');
console.log('2. Go to Application tab');
console.log('3. Click "Storage" in left sidebar');
console.log('4. Click "Clear storage" button');
console.log('5. Or manually delete caches in "Cache Storage"');

console.log('\n✅ Cache clearing instructions provided!');
console.log('💡 For development, consider using: npm run dev:clear');
