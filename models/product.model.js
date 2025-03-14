const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product schema
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      depth: {
        type: Number,
        required: true,
      },
    },
    warrantyInformation: {
      type: String,
    },
    shippingInformation: {
      type: String,
    },
    availabilityStatus: {
      type: String,
    },
    reviews: [
      {
        // _id: false,
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
          default: new Date(),
        },
        reviewerName: {
          type: String,
          required: true,
        },
        reviewerEmail: {
          type: String,
          required: true,
        },
      },
    ],
    returnPolicy: {
      type: String,
    },
    minimumOrderQuantity: {
      type: Number,
      required: true,
    },
    meta: {
      createdAt: {
        type: Date,
        required: true,
      },
      updatedAt: {
        type: Date,
        required: true,
      },
      barcode: {
        type: String,
      },
      qrCode: {
        type: String,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model from the schema
const Product = mongoose.model("products", productSchema);

module.exports = Product;