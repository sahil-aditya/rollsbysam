const fs = require('fs');
const path = require('path');

// Updated paths to be relative to the repository's root
const shopDirPath = path.join(__dirname, 'Shop');
const outputFilePath = path.join(__dirname, 'shop.json');
const baseURL = 'https://sahil-aditya.github.io/Creative_Gallery/';

async function generateShopJson() {
  const shopJson = [];

  try {
    const presetFolders = fs.readdirSync(shopDirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folderName of presetFolders) {
      const folderPath = path.join(shopDirPath, folderName);
      const files = fs.readdirSync(folderPath);

      // Find images (case-insensitive)
      const images = files
        .filter(file => /\.(jpeg|jpg|png|gif)$/i.test(file))
        .sort((a, b) => {
          // Sorts images by number (e.g., Image1.jpg, Image2.jpg)
          const numA = parseInt(a.match(/(\d+)/)?.[1] || 0);
          const numB = parseInt(b.match(/(\d+)/)?.[1] || 0);
          return numA - numB;
        });

      if (images.length === 0) {
        console.warn(`Skipping folder "${folderName}" as no images were found.`);
        continue;
      }

      // Construct URLs
      const encodedFolderName = encodeURIComponent(folderName);
      const thumbnailPath = path.join('Shop', folderName, images[0]).replace(/\\/g, '/');
      const thumbnailURL = `${baseURL}${thumbnailPath}`;

      const imageURLs = images.map(imageName => {
        const imagePath = path.join('Shop', folderName, imageName).replace(/\\/g, '/');
        return `${baseURL}${imagePath}`;
      });

      // Check for file existence before adding to JSON
      const descriptionFile = path.join(folderPath, 'Description.txt');
      const priceFile = path.join(folderPath, 'price.txt');
      const buyLinkFile = path.join(folderPath, 'buy.txt');

      const descriptionURL = fs.existsSync(descriptionFile) ? `${baseURL}${path.join('Shop', folderName, 'Description.txt').replace(/\\/g, '/')}` : null;
      const priceURL = fs.existsSync(priceFile) ? `${baseURL}${path.join('Shop', folderName, 'price.txt').replace(/\\/g, '/')}` : null;
      const buyLinkURL = fs.existsSync(buyLinkFile) ? `${baseURL}${path.join('Shop', folderName, 'buy.txt').replace(/\\/g, '/')}` : null;

      const product = {
        name: folderName,
        thumbnail: thumbnailURL,
        images: imageURLs,
        descriptionPath: descriptionURL,
        price: priceURL,
        buyLinkPath: buyLinkURL, // Add the buy.txt path here
      };

      shopJson.push(product);
    }

    fs.writeFileSync(outputFilePath, JSON.stringify(shopJson, null, 2));
    console.log('Successfully generated shop.json!');

  } catch (error) {
    console.error('Error generating shop.json:', error);
    process.exit(1);
  }
}

generateShopJson();
