const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Missing Token invalid token" });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);

    req.user = decodedToken.user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid Token or not logged in" });
  }
};

module.exports = { authenticateToken };
