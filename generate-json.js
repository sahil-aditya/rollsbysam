const fs = require('fs');
const path = require('path');

const shopDir = 'Shop';
const shopJsonPath = 'shop.json';

const products = [];

// Read all subdirectories in the 'Shop' directory
const productFolders = fs.readdirSync(shopDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

// Process each product folder
productFolders.forEach(folder => {
  const folderPath = path.join(shopDir, folder);
  const imagesDir = path.join(folderPath, 'images');

  // Check if the images directory exists
  if (!fs.existsSync(imagesDir)) {
    console.warn(`Warning: 'images' directory not found in ${folder}`);
    return; // Skip this folder
  }

  // Get all images in the 'images' folder
  const images = fs.readdirSync(imagesDir)
    .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join(imagesDir, file).replace(/\\/g, '/'));

  // Define paths for description, price, and buy link files, but only if they exist
  const
    
