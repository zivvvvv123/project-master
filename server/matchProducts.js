const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/Products");

// Load products from a JSON file
const loadProducts = (filePath) => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent);
};

// Save products to a JSON file
const saveProducts = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Normalize product names for comparison
const normalizeName = (name) => {
  return name.replace(/\s+/g, "").toLowerCase();
};

// Process products to find matches and calculate the cheapest prices
const processProducts = (products) => {
  const matchedProducts = {};

  products.forEach((product) => {
    const normalizedName = normalizeName(product.product_name);
    if (!matchedProducts[normalizedName]) {
      matchedProducts[normalizedName] = {
        _ids: [product._id],
        product_name: product.product_name,
        unit: product.unit,
        quantity: product.quantity,
        brand: product.brand,
        image_url: product.image_url || "",
        supermarkets: [],
        cheapest_price: null,
        cheapest_price_per_kg: null,
      };
    } else {
      matchedProducts[normalizedName]._ids.push(product._id);
    }

    if (!matchedProducts[normalizedName].image_url && product.image_url) {
      matchedProducts[normalizedName].image_url = product.image_url;
    }

    // Ensure each supermarket ID is unique in the supermarkets array
    if (
      !matchedProducts[normalizedName].supermarkets.some(
        (s) => s.supermarket_id === product.supermarket_id
      )
    ) {
      matchedProducts[normalizedName].supermarkets.push({
        supermarket_id: product.supermarket_id,
        price: product.price,
        price_per_kg: product.price_per_kg,
      });
    }

    const price = parseFloat(product.price);
    if (!isNaN(price)) {
      if (
        matchedProducts[normalizedName].cheapest_price === null ||
        price < matchedProducts[normalizedName].cheapest_price
      ) {
        matchedProducts[normalizedName].cheapest_price = price;
      }
    }

    const pricePerKg = parseFloat(product.price_per_kg);
    if (!isNaN(pricePerKg)) {
      if (
        matchedProducts[normalizedName].cheapest_price_per_kg === null ||
        pricePerKg < matchedProducts[normalizedName].cheapest_price_per_kg
      ) {
        matchedProducts[normalizedName].cheapest_price_per_kg = pricePerKg;
      }
    }
  });

  return Object.values(matchedProducts).map((product) => ({
    ...product,
    matches: product.supermarkets.length,
  }));
};

// Main function to process products and save matched products
const main = () => {
  try {
    const productsFilePath = path.join(__dirname, "products", "products.json");
    const processedProductsFilePath = path.join(
      __dirname,
      "products",
      "matchedProducts.json"
    );

    const products = loadProducts(productsFilePath);
    const processedProducts = processProducts(products);
    saveProducts(processedProductsFilePath, processedProducts);

    // No console logging as per the requirement
  } catch (error) {
    // Handle errors appropriately
  }
};

main();
