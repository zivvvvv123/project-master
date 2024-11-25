const fs = require("fs");
const path = require("path");

// Load products from JSON file
const productsFilePath = path.join(__dirname, "products", "products.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf8"));

// Process products to categorize them by matches
const processedProducts = products.map((product) => {
  const supermarkets = product.supermarkets || [];
  const matches = supermarkets.length;
  return { ...product, matches };
});

// Save the processed products to a new JSON file
const processedProductsFilePath = path.join(
  __dirname,
  "products",
  "processedProducts.json"
);
fs.writeFileSync(
  processedProductsFilePath,
  JSON.stringify(processedProducts, null, 2),
  "utf8"
);

console.log(
  `Processed ${processedProducts.length} products and saved to ${processedProductsFilePath}`
);
