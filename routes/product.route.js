const express = require("express");

const productController = require("../controllers/product.controller");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
  "/create",
  roleMiddleware("SELLER", "ADMIN", "SUPER_ADMIN"),
  productController.productCreate
);

router.get("/list", productController.productList);

router.get("/:id", productController.productDetail);

router.post(
  "/add-review",
  roleMiddleware("CUSTOMER"),
  productController.productReview
);

module.exports = router;