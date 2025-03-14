const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const UserModel = require("../models/user.model");

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization || "";
    token = token.split(" ")[1];
    // console.log(req.cookies);
    // req.cookies // To get cookies from the request
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /**
     * 1. Validate the token
     * 2. not vaild before
     * 3. not expired
     * 4. Is the user inside the token valid?
     */

    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("isValid", tokenData);

    const user = await UserModel.findById(tokenData._id);

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.user = user;
    next(); // Forward the request to API
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;