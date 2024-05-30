const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const uri = "mongodb+srv://Ziv:Oriziv12@project.dz2dhdd.mongodb.net/products";

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
  },
  { collection: "juhananof" }
);

const Juhananof = mongoose.model("Juhananof", productSchema);

const dir = path.join(__dirname, "server/products");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fetchAndSaveItems = () => {
  Juhananof.find({})
    .then((items) => {
      console.log("Retrieved items:", items);

      if (items.length === 0) {
        console.log("No documents found in the collection.");
        return;
      }

      const jsonContent = JSON.stringify(items, null, 2);
      const filePath = path.join(__dirname, "products/juhananof.json");

      fs.writeFile(filePath, jsonContent, "utf8", (err) => {
        if (err) {
          console.log(
            "An error occurred while writing JSON Object to File.",
            err
          );
          return;
        }
        console.log("JSON file has been saved.");
      });
    })
    .catch((err) => {
      console.log("Error occurred while fetching items:", err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

fetchAndSaveItems();
