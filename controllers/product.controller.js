const ProductModel = require("../models/product.model");
const UserModel = require("../models/user.model");

const productCreate = async (req, res, next) => {
  await ProductModel.create(req.body);
  res.json({
    success: true,
    message: "Product created successfully",
  });
};

const productList = async (req, res, next) => {
  try {
    const itemsPerPage = req.query.pageSize || 10;
    const pageNo = req.query.pageNo || 1;
    const searchKey = req.query.searchKey || "";

    const searchQuery = {
      $or: [
        {
          title: new RegExp(searchKey, "gi"),
        },
        {
          description: new RegExp(searchKey, "gi"),
        },
        {
          tags: {
            $in: [searchKey],
          },
        },
      ],
    };

    const totalProducts = await ProductModel.find(searchQuery).countDocuments();

    const itemsToSkip = (pageNo - 1) * itemsPerPage;
    const products = await ProductModel.find(searchQuery, {
      title: 1,
      price: 1,
      thumbnail: 1,
    })
      .skip(itemsToSkip)
      .limit(itemsPerPage);

    res.json({
      success: true,
      message: "Product list API",
      total: totalProducts,
      results: products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ succes: false, message: "Something went wrong" });
  }
};

const productDetail = async (req, res, next) => {
  const productId = req.params.id;

  const product = await ProductModel.findById(productId);

  if (!product) {
    res.json({
      success: true,
      message: "No product found",
    });
    return;
  }

  res.json({
    success: true,
    message: "Product details API",
    result: product,
  });
};

const productReview = async (req, res) => {
  // const userDetailsFromDb = await UserModel.findById(req.body.userId);

  // const items = [{},{},{},{},{}]
  // $push: {
  //     reviews: {
  //         $each: items
  //     }
  // }

  await ProductModel.findByIdAndUpdate(req.body.productId, {
    $push: {
      reviews: {
        rating: req.body.review.rating,
        comment: req.body.review.comment,
        reviewerName: `${req.user.firstName} ${req.user.lastName}`,
        reviewerEmail: req.user.email,
      },
    },
  });

  res.json({
    success: true,
    message: "Review added successfully",
  });
};

const productController = {
  productCreate,
  productList,
  productDetail,
  productReview,
};

module.exports = productController;