const CouponModel = require("../models/coupon.model");

const couponCreate = async (req, res) => {
  // Todo: Write your own validations

  await CouponModel.create(req.body);
  res.json({
    success: true,
    message: "Copuon created successfully",
  });
};

const couponController = {
  couponCreate,
};

module.exports = couponController;