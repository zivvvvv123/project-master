const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const randomRoute = require("./routes/randomRoutes");
//app
const app = express();
app.use(express.json());

// db
mongoose
  .connect(
    "mongodb+srv://Ziv:Oriziv12@project.dz2dhdd.mongodb.net/OverReview",
    {}
  )
  .then(() => console.log("DB CONNECTED"))
  .catch(() => console.log("db connection error"));
//middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
//routes
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/products", randomRoute);
//port
const port = 8080;

const server = app.listen(
  port,
  () => console.log(`server is running on port ${port}`),
  console.log(require("crypto").randomBytes(32).toString("hex"))
);
