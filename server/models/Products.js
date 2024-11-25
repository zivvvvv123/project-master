const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupermarketSchema = new Schema({
  supermarket_id: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_per_kg: {
    type: Number,
    required: false,
  },
});

const ProductSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  price_per_kg: {
    type: Number,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  image_url: {
    type: String,
    required: false,
  },
  quantity: {
    type: String,
    required: false,
  },
  unit: {
    type: String,
    required: false,
  },
  supermarkets: [SupermarketSchema],
});

module.exports = mongoose.model("Product", ProductSchema);
