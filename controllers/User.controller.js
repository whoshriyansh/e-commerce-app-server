import User from "../models/User.model.js";
import createError from "../middlewares/Error.middleware.js";

// Get user profile (protected route)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteUserAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json({ success: true, message: "User account deleted" });
  } catch (error) {
    next(error);
  }
};
