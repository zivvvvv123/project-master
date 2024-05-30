const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/tokenAuthenticator");
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.get("/tokenAuth", authenticateToken, authController.authenticate);
router.post("/signout", authController.signout);

module.exports = router;
