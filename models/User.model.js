import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
