const path = require("path");
const fs = require("fs");

exports.random = async (req, res) => {
  const inputFile = path.join(__dirname, "..", "products", "juhananof.json");
  const outputFile = path.join(
    __dirname,
    "..",
    "products",
    "randomProducts.json"
  );

  // Function to get random elements from an array
  const getRandomElements = (array, numElements) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
  };

  // Read the input JSON file
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading input JSON file:", err);
      res.status(500).json({ error: "Failed to read products" });
      return;
    }

    try {
      const products = JSON.parse(data);

      // Select 15 random products
      const randomProducts = getRandomElements(products, 15);

      // Write the random products to the output JSON file
      fs.writeFile(
        outputFile,
        JSON.stringify(randomProducts, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing output JSON file:", err);
            res.status(500).json({ error: "Failed to write random products" });
            return;
          }
          console.log("Random products saved to randomProducts.json");

          // Send the random products as a response
          res.json(randomProducts);
        }
      );
    } catch (error) {
      console.error("Error parsing input JSON:", error);
      res.status(500).json({ error: "Failed to parse input JSON" });
    }
  });
};
