const fs = require("fs");
const path = require("path");

const displayFilePath = path.join(
  __dirname,
  "products/consolidatedMatchedProducts.json"
);
const randomProductsFilePath = path.join(
  __dirname,
  "products/randomProducts.json"
);

const getRandomProducts = () => {
  fs.readFile(displayFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("An error occurred while reading the display file:", err);
      return;
    }

    let products;
    try {
      products = JSON.parse(data);
    } catch (err) {
      console.error("An error occurred while parsing the display file:", err);
      return;
    }

    const randomProducts = [];
    const productsLength = products.length;

    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * productsLength);
      randomProducts.push(products[randomIndex]);
    }

    fs.writeFile(
      randomProductsFilePath,
      JSON.stringify(randomProducts, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error(
            "An error occurred while writing random products to file:",
            err
          );
          return;
        }
        console.log("Random products have been saved to randomProducts.json.");
      }
    );
  });
};

getRandomProducts();
