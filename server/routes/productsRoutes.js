const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

router.post("/cartItems", productController.getProductsByIds);
router.post("/search", productController.searchProducts);
router.get("/randomProducts", productController.getRandomProducts);
router.post("/calculatePrices", productController.calculatePrices);
router.post("/getSupermarketsByIds", productController.getSupermarketsByIds); // Correctly reference the function

module.exports = router;
