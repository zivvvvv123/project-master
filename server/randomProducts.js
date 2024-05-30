const fs = require("fs");
const path = require("path");

// Path to the input file
const inputFile = path.join(__dirname, "products", "juhananof.json");

// Path to the output file
const outputFile = path.join(__dirname, "products", "randomProducts.json");

// Read the input JSON file
fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading input JSON file:", err);
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
          return;
        }
        console.log("Random products saved to randomProducts.json");
      }
    );
  } catch (error) {
    console.error("Error parsing input JSON:", error);
  }
});

// Function to get random elements from an array
const getRandomElements = (array, numElements) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
};
