const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "images");
const outputFile = path.join(__dirname, "images.json");
const baseUrl = "https://sahil-aditya.github.io/Creative_Gallery/images";

// Get all files in images directory
const files = fs.readdirSync(imagesDir);

// Filter before/after images
const beforeFiles = files.filter(f => f.startsWith("before"));
const afterFiles = files.filter(f => f.startsWith("after"));

// Sort numerically (so before2 < before10)
const sortByNumber = (a, b) => {
  const numA = parseInt(a.match(/\d+/)?.[0] || 0);
  const numB = parseInt(b.match(/\d+/)?.[0] || 0);
  return numA - numB;
};

beforeFiles.sort(sortByNumber);
afterFiles.sort(sortByNumber);

// Pair before/after by number
const result = beforeFiles.map(before => {
  const num = before.match(/\d+/)?.[0];
  const after = afterFiles.find(a => a.includes(num));
  return {
    before: `${baseUrl}/${before}`,
    after: after ? `${baseUrl}/${after}` : null,
  };
}).filter(item => item.after !== null);

// Write JSON file (pretty format)
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2) + "\n");

console.log("✅ images.json updated!");
