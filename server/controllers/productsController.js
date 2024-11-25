const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Supermarket = require("../models/supermarkets");
const matchedProductsFilePath = path.join(
  __dirname,
  "../products/matchedProducts.json"
);
const matchedProducts = JSON.parse(
  fs.readFileSync(matchedProductsFilePath, "utf8")
);

exports.calculatePrices = async (req, res) => {
  const { cartItems } = req.body; // Assume cartItems is an array of objects with _id and quantity

  try {
    const cartMap = cartItems.reduce((map, item) => {
      map[item._id] = item.quantity || 1;
      return map;
    }, {});

    const totalPrices = {};
    matchedProducts.forEach((product) => {
      const productIdsInCart = product._ids.filter((id) => cartMap[id]);
      if (productIdsInCart.length > 0) {
        const totalQuantity = productIdsInCart.reduce(
          (total, id) => total + cartMap[id],
          0
        );

        product.supermarkets.forEach((supermarket) => {
          const supermarketId = supermarket.supermarket_id;
          const price =
            parseFloat(supermarket.price) ||
            parseFloat(supermarket.price_per_kg) ||
            0;

          if (!totalPrices[supermarketId]) {
            totalPrices[supermarketId] = { totalPrice: 0, productCount: 0 };
          }

          totalPrices[supermarketId].totalPrice += price * totalQuantity;
          totalPrices[supermarketId].productCount += 1;
        });
      }
    });

    res.json(totalPrices);
  } catch (error) {
    console.error("Error calculating prices:", error);
    res.status(500).json({ message: "Error calculating prices", error });
  }
};

exports.getSupermarketsByIds = async (req, res) => {
  const { supermarketIds } = req.body;
  try {
    const validSupermarketIds = supermarketIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validSupermarketIds.length !== supermarketIds.length) {
      return res
        .status(400)
        .json({ message: "Invalid supermarket IDs provided." });
    }

    const supermarkets = await Supermarket.find({
      _id: { $in: validSupermarketIds },
    });
    res.json(supermarkets);
  } catch (error) {
    console.error("Error fetching supermarkets by IDs:", error);
    res
      .status(500)
      .json({ message: "Error fetching supermarkets by IDs", error });
  }
};
const getMatchedProducts = () => {
  const filePath = path.join(__dirname, "../products/matchedProducts.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};
exports.getCartDetails = async (req, res) => {
  const { cartItems } = req.body;

  try {
    const validProductIds = cartItems
      .map((item) => mongoose.Types.ObjectId.isValid(item._id) && item._id)
      .filter(Boolean);
    if (validProductIds.length !== cartItems.length) {
      return res.status(400).json({ message: "Invalid product IDs provided." });
    }

    const products = await Product.find({ _id: { $in: validProductIds } });
    res.json(products);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ message: "Error fetching cart details", error });
  }
};
exports.getProductsByIds = async (req, res) => {
  const { productIds } = req.body;
  console.log("Received product IDs:", productIds);

  try {
    const validProductIds = productIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validProductIds.length !== productIds.length) {
      console.error(
        "Invalid product IDs found:",
        productIds.filter((id) => !mongoose.Types.ObjectId.isValid(id))
      );
      return res.status(400).json({ message: "Invalid product IDs provided." });
    }

    const products = await Product.find({ _id: { $in: validProductIds } });
    console.log("Fetched products count:", products.length);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    res.status(500).json({ message: "Error fetching products by IDs", error });
  }
};

exports.getRandomProducts = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../products/matchedProducts.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const products = JSON.parse(fileContents);

    // Select random products
    const randomProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, 15);

    res.json(randomProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random products", error });
  }
};

exports.searchProducts = async (req, res) => {
  const { query } = req.body;
  console.log("Search query received:", query); // Log the received query
  try {
    const matchedProductsFilePath = path.join(
      __dirname,
      "../products/matchedProducts.json"
    );
    const matchedProducts = JSON.parse(
      fs.readFileSync(matchedProductsFilePath, "utf8")
    );

    const results = matchedProducts.filter((product) =>
      product.product_name.includes(query)
    );

    console.log("Search results:", results); // Log the search results
    res.json(results);
  } catch (error) {
    console.error("Error searching products:", error); // Log the error details
    res.status(500).json({ message: "Error searching products", error });
  }
};
