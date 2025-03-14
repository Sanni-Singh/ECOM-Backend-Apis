const mongoose = require("mongoose");

const product = {
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "products",
  },
  qty: {
    type: Number,
    required: true,
    default: 1,
  },
};

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [product],
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("carts", cartSchema);

module.exports = CartModel;