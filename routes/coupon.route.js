const express = require("express");

const couponController = require("../controllers/coupon.controller");

const router = express.Router();

router.post("/create", couponController.couponCreate);

// router.get("/get");

module.exports = router;