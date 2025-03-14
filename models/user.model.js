const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchemaObject = {
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
    default: "NA",
  },
  mobileNo: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  gender: {
    type: String,
    required: true,
    enum: ["MALE", "FEMALE", "OTHERS"], // List of allowed values
  },
  token: {
    type: String,
    reqiured: false,
    default: "",
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: {
    type: String,
    default: "CUSTOMER",
    enum: ["CUSTOMER", "SELLER", "ADMIN", "SUPER_ADMIN"],
  },
};

const userSchema = new mongoose.Schema(userSchemaObject, {
  timestamps: true,
});

// Hooks
userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt(10); // Extra added security on top of your password hash
    const cipherTextPassword = await bcrypt.hash(this.password, salt);
    this.password = cipherTextPassword;
  } catch (err) {
    console.log("ERROR WHILE HASINHG PASSWORD", err);
  }
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;