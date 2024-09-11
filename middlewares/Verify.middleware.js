import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import createError from "./Error.middleware.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(createError(401, "Not AUthorized, No Token"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decode.id).select("-password");

    next();
  } catch (err) {
    next(createError(401, "Not authorized, token failed"));
  }
};

export default verifyToken;
