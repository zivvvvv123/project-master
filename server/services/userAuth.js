// userAuth.js
const mongoose = require("mongoose");
const User = require("../models/User");

async function userCheck(username, password) {
  try {
    const user = await User.findOne({ username: username, password: password });

    if (user) {
      console.log("Login successful");
      return user;
    } else {
      console.log("Invalid username or password");
      return null;
    }
  } catch (error) {
    console.error("Error checking login credentials:", error);
    throw error;
  }
}

module.exports = {
  userCheck,
};
