import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import createError from "../middlewares/Error.middleware.js";

// Utility function to create JWT token
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Sign Up A User
export const SignUp = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "User with this Email is already existed"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullname,
      email,
      password: hashPass,
    });

    //Generate Token and send in HTTP-only Cokkies
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ success: true, message: "User Registered Sucessfully", user });
  } catch (err) {
    next(err);
  }
};

//Sign In a User
export const SignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Find a User
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, "No User found with this Email Address"));
    }

    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createErroacr(401, "OOPS! Invalid Password"));
    }

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Login successful", user });
  } catch (err) {
    next(err);
  }
};

//Logout a User
export const Logout = async (req, res, next) => {
  res.cookie("token", "", { maxAge: 1 });
  res.status(200).json({ success: true, message: "Logges Out Sucessfully" });
};
