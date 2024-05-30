const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/tokenAuthenticator");
const userAuth = require("../services/userAuth");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userAuth.userCheck(username, password);

    if (user) {
      const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
      res.status(200).json({ message: "Login successful", accessToken });
    } else {
      console.log("Invalid username or password");
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.authenticate = async (req, res) => {
  try {
    authenticateToken(req, res, () => {
      console.log("User verified");
      res.status(201).send({ message: "User verified" });
    });
  } catch (error) {
    console.log("hola");
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signout = async (req, res) => {
  console.log("signout");
};
