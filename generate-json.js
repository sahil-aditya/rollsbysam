const fs = require('fs');
const path = require('path');

const shopDir = 'Shop'; // Assuming your products are in a directory named 'Shop'
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
    return;
  }

  // Get all images in the 'images' folder
  const images = fs.readdirSync(imagesDir)
    .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
    .map(file => path.join(imagesDir, file).replace(/\\/g, '/')); // Use forward slashes for URLs

  // Extract thumbnail and full-size images
  const thumbnail = images.find(img => img.includes('_thumb')) || images[0];
  const fullImages = images.filter(img => !img.includes('_thumb'));

  // Define paths for description, price, and buy link files
  const descriptionPath = path.join(folderPath, 'description.txt').replace(/\\/g, '/');
  const pricePath = path.join(folderPath, 'price.txt').replace(/\\/g, '/');
  const buyLinkPath = path.join(folderPath, 'buy.txt').replace(/\\/g, '/');

  // Create the product object
  products.push({
    id: folder.toLowerCase().replace(/\s+/g, '-'),
    name: folder.replace(/-/g, ' '),
    thumbnail: thumbnail,
    images: fullImages,
    descriptionPath: descriptionPath,
    price: pricePath,
    buyLinkPath: buyLinkPath, // Add the path for buy.txt
  });
});

// Write the JSON to file
fs.writeFileSync(shopJsonPath, JSON.stringify(products, null, 2));

console.log(`Successfully generated ${shopJsonPath} with ${products.length} products.`);

