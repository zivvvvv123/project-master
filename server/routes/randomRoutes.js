const express = require("express");
const router = express.Router();
const randomController = require("../controllers/randomController");

router.get("/randomProducts", randomController.random);

module.exports = router;
