const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const uri = "mongodb+srv://Ziv:Oriziv12@project.dz2dhdd.mongodb.net/CheaperSal";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB connection error:", err));

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String },
    price_per_kg: { type: String },
    price: { type: String },
    unitPrice: { type: String },
    quantity: { type: String },
    brand: { type: String },
    supermarket: { type: String },
    discount: { type: String },
    productLink: { type: String },
    img_url: { type: String },
    supermarket_id: { type: String },
  },
  { collection: "products" }
);

const Product = mongoose.model("Product", productSchema);

const fetchAndSaveProducts = () => {
  Product.find({})
    .then((products) => {
      const filePath = path.join(__dirname, "products/products.json");
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
      console.log("Products have been saved.");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.log("Error occurred while fetching products:", err);
    });
};

fetchAndSaveProducts();
