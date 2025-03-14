const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.post("/add", cartController.cartAdd);

router.post("/change-qty", cartController.cartChangeQty);

router.get("/", cartController.cartGet);

module.exports = router;