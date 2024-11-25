const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupermarketSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Supermarket", SupermarketSchema);
