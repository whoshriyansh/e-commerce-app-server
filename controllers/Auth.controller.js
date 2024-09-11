import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import createError from "../middlewares/Error.middleware.js";
import { generateAccessToken } from "../helper/GenerateToken.js";

// Sign Up A User
export const SignUp = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User with this Email is already existed"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashPass,
    });

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User Registered Sucessfully" });
  } catch (err) {
    next(err);
  }
};

//Sign In a User

export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "No User found with this Email Address"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(401, "OOPS! Invalid Password"));
    }

    const token = generateAccessToken(user);
    res.cookie("token", token);

    res
      .status(200)
      .json({ success: true, message: "Login successful", user, token });
  } catch (err) {
    next(err);
  }
};
