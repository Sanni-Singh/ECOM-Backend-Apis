const dayjs = require("dayjs");

const CartModel = require("../models/cart.model");
const CouponModel = require("../models/coupon.model");
const OrderModel = require("../models/order.model");
const ProductModel = require("../models/product.model");

const emailService = require("../service/emailService");

const orderCreate = async (req, res) => {
  /**
   * 1. Fetch user cart
   * 2. Total amount
   *  * Check the inventory for order
   * 3. Apply coupon (Total Value)
   * 4. PLACE ORDER
   *  4.1 COD
   *  4.2 ONLINE
   * 5. Insert the order details into orders collection
   * 6. Clear the user cart
   * 7. Reduce the inventory
   * 8. Send order confirmation Email / SMS
   */
  const userCart = await CartModel.findOne({ userId: req.user._id }).populate(
    "products.productId"
  );
  // console.log(JSON.stringify(userCart));

  if (!userCart || userCart.products.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please add at least 1 product in your cart to place an order",
    });
  }

  const productsList = userCart.products;

  const total = productsList.reduce(
    (acc, cV) => cV.productId.price * cV.qty + acc,
    0
  );

  // let total = 0;
  // for (let i = 0; i < productsList.length; i++) {
  //     const currentProduct = productsList[i];
  //     const cost = currentProduct.productId.price * currentProduct.qty;
  //     total = total + cost
  // }

  let discountInRs = 0;
  let amountToBePaid = total;
  if (req.body.couponCode) {
    const couponDetails = await CouponModel.findOne({
      code: req.body.couponCode,
    });
    if (!couponDetails) {
      return res.status(400).json({
        success: false,
        message: "Coupon is invalid or expired",
      });
    }
    const couponExpiryDate = dayjs(couponDetails.validTill);
    const currentDate = dayjs();

    const isValid = currentDate.isBefore(couponExpiryDate);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Coupon is invalid or expired",
      });
    }

    if (total < couponDetails.minAmountRequired) {
      return res.status(400).json({
        success: false,
        message: `Minimum amount required to claim this coupon is Rs ${couponDetails.minAmountRequired}`,
      });
    }

    discountInRs = (total / 100) * couponDetails.discountPercentage;
    discountInRs =
      discountInRs > couponDetails.maxDiscountInRs
        ? couponDetails.maxDiscountInRs
        : discountInRs;

    amountToBePaid = (total - discountInRs).toFixed(2);
  }

  if (req.body.paymentMode === "ONLINE") {
    // Todo: Payment gateway redirection
  }

  const productsOrdered = userCart.products.map((product) => ({
    productId: product.productId._id,
    qty: product.qty,
  }));
  const orderDetails = {
    paymentMode: req.body.paymentMode,
    shippingAddress: req.body.shippingAddress,
    user: req.user._id,
    totalAmount: total,
    discountAmount: discountInRs,
    amountToBePaid: amountToBePaid,
    productDetails: productsOrdered,
  };

  const insertedOrderDetails = await OrderModel.create(orderDetails);

  await CartModel.deleteOne({ userId: req.user._id });

  productsOrdered.forEach(async (product) => {
    await ProductModel.findByIdAndUpdate(product.productId, {
      $inc: {
        stock: -product.qty,
      },
    });
  });

  emailService({
    toEmail: req.user.email,
    subject: "Order Confirmation!",
    orderDetails: {
      // Todo : Put order details here
    },
  });

  res.json({
    success: true,
    message: `Order placess succesfully, order id : ${insertedOrderDetails._id}`,
  });
};

const orderController = {
  orderCreate,
};

module.exports = orderController;