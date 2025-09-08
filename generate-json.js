const fs = require('fs');
const path = require('path');

const shopDirPath = path.join(__dirname, 'Shop');
const outputFilePath = path.join(__dirname, 'shop.json');
const baseURL = 'https://sahil-aditya.github.io/Creative_Gallery/';

function findFileInsensitive(folderPath, fileName) {
  try {
    const files = fs.readdirSync(folderPath);
    const found = files.find(file => file.toLowerCase() === fileName.toLowerCase());
    return found ? path.join(folderPath, found) : null;
  } catch (error) {
    console.warn(`Could not read directory: ${folderPath}`);
    return null;
  }
}

async function generateShopJson() {
  const shopJson = [];

  try {
    const presetFolders = fs.readdirSync(shopDirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folderName of presetFolders) {
      const folderPath = path.join(shopDirPath, folderName);
      const files = fs.readdirSync(folderPath);

      const images = files
        .filter(file => /\.(jpeg|jpg|png|gif)$/i.test(file))
        .sort((a, b) => {
          const numA = parseInt(a.match(/(\d+)/)?.[1] || 0);
          const numB = parseInt(b.match(/(\d+)/)?.[1] || 0);
          return numA - numB;
        });

      if (images.length === 0) {
        console.warn(`Skipping folder "${folderName}" as no images were found.`);
        continue;
      }

      const descriptionFile = findFileInsensitive(folderPath, 'description.txt');
      const priceFile = findFileInsensitive(folderPath, 'price.txt');
      
      const descriptionURL = descriptionFile ? `${baseURL}${path.join('Shop', folderName, path.basename(descriptionFile)).replace(/\\/g, '/')}` : null;
      const priceURL = priceFile ? `${baseURL}${path.join('Shop', folderName, path.basename(priceFile)).replace(/\\/g, '/')}` : null;

      const thumbnailPath = path.join('Shop', folderName, images[0]).replace(/\\/g, '/');
      const thumbnailURL = `${baseURL}${thumbnailPath}`;

      const imageURLs = images.map(imageName => {
        const imagePath = path.join('Shop', folderName, imageName).replace(/\\/g, '/');
        return `${baseURL}${imagePath}`;
      });

      const product = {
        name: folderName,
        thumbnail: thumbnailURL,
        images: imageURLs,
        descriptionPath: descriptionURL,
        price: priceURL,
        buyLink: '', // Set buyLink to an empty string
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
