const express = require("express");
const router = express.Router();
const labTestController = require("../controllers/labTestController");

router.get("/", labTestController.getAllLabTests);
router.post("/add", labTestController.addLabTest);

module.exports = router;
