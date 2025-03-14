const CartModel = require("../models/cart.model");

const cartAdd = async (req, res, next) => {
  console.log(req.user);
  /**
   * 1. Check if the cart for the user already exists
   *  1.1 If not create a new cart and add the product
   *  1.2 If available, push the proudct to existing cart
   */

  const userCartFromDb = await CartModel.findOne({
    userId: req.user._id,
  });

  if (userCartFromDb) {
    // Push the item to the existing array
    const newProduct = {
      productId: req.body.product.productId,
      qty: req.body.product.qty,
    };

    await CartModel.findByIdAndUpdate(userCartFromDb._id, {
      $push: {
        products: newProduct,
      },
    });
  } else {
    // Create a new cart
    const objectToInsert = {
      products: [req.body.product],
      userId: req.user._id,
    };
    await CartModel.create(objectToInsert);
  }

  // console.log(userCartFromDb);

  res.json({
    success: true,
    message: "Add to cart API",
  });
};

const cartChangeQty = async (req, res) => {
  // const userCartFromDb = await CartModel.findOne({ userId: req.body.userId });
  // Todo : Write your validation
  await CartModel.updateOne(
    {
      "products.productId": req.body.product.productId,
      userId: req.user._id,
    },
    {
      $inc: {
        "products.$.qty": req.body.product.qty,
      },
    }
  );

  res.json({
    success: true,
    message: "Cart updated successfully",
  });
};

const cartGet = async (req, res) => {
  const cart = await CartModel.findOne({
    userId: req.user._id,
  }).populate("products.productId");

  res.json({
    success: true,
    message: "Cart API",
    result: cart,
  });
};

const cartController = {
  cartAdd,
  cartChangeQty,
  cartGet,
};

module.exports = cartController;