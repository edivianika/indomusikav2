#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing bundle size...')

try {
  // Build the project
  console.log('📦 Building project...')
  execSync('npm run build', { stdio: 'inherit' })

  // Analyze bundle
  console.log('📊 Analyzing bundle...')
  execSync('npx @next/bundle-analyzer', { stdio: 'inherit' })

  console.log('✅ Bundle analysis complete!')
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message)
  process.exit(1)
}
