const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const productsRoute = require("./routes/productsRoutes");

const app = express();
const port = 8080;

mongoose
  .connect(
    "mongodb+srv://Ziv:Oriziv12@project.dz2dhdd.mongodb.net/CheaperSal",
    {}
  )
  .then(() => console.log("DB CONNECTED"))
  .catch(() => console.log("DB connection error"));

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/products", productsRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
