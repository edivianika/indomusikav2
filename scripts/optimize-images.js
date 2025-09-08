#!/usr/bin/env node

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.join(__dirname, '../public')
const OUTPUT_DIR = path.join(__dirname, '../public/optimized')

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'webp'
    } = options

    await sharp(inputPath)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality })
      .toFile(outputPath)

    const originalSize = fs.statSync(inputPath).size
    const optimizedSize = fs.statSync(outputPath).size
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)

    console.log(`✅ Optimized: ${path.basename(inputPath)}`)
    console.log(`   Original: ${(originalSize / 1024).toFixed(2)}KB`)
    console.log(`   Optimized: ${(optimizedSize / 1024).toFixed(2)}KB`)
    console.log(`   Savings: ${savings}%`)
    console.log('')

    return { originalSize, optimizedSize, savings }
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message)
    return null
  }
}

async function optimizeAvatar(inputPath, outputPath) {
  return optimizeImage(inputPath, outputPath, {
    width: 128,
    height: 128,
    quality: 60,
    format: 'webp'
  })
}

async function optimizeHeroImage(inputPath, outputPath) {
  return optimizeImage(inputPath, outputPath, {
    width: 1200,
    height: 800,
    quality: 75,
    format: 'webp'
  })
}

async function main() {
  console.log('🖼️  Starting image optimization...\n')

  const images = fs.readdirSync(PUBLIC_DIR)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .map(file => path.join(PUBLIC_DIR, file))

  if (images.length === 0) {
    console.log('No images found to optimize.')
    return
  }

  let totalOriginalSize = 0
  let totalOptimizedSize = 0

  for (const imagePath of images) {
    const fileName = path.basename(imagePath, path.extname(imagePath))
    const outputPath = path.join(OUTPUT_DIR, `${fileName}.webp`)

    // Determine optimization strategy based on filename
    let result
    if (fileName.includes('avatar') || fileName.includes('user')) {
      result = await optimizeAvatar(imagePath, outputPath)
    } else if (fileName.includes('hero') || fileName.includes('banner')) {
      result = await optimizeHeroImage(imagePath, outputPath)
    } else {
      result = await optimizeImage(imagePath, outputPath)
    }

    if (result) {
      totalOriginalSize += result.originalSize
      totalOptimizedSize += result.optimizedSize
    }
  }

  const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(2)

  console.log('📊 Optimization Summary:')
  console.log(`   Total Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`)
  console.log(`   Total Optimized Size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`)
  console.log(`   Total Savings: ${totalSavings}%`)
  console.log(`   Optimized images saved to: ${OUTPUT_DIR}`)
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { optimizeImage, optimizeAvatar, optimizeHeroImage }
