import mongoose, { Schema } from "mongoose";

const WishlistSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wishlistItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wishlist", WishlistSchema);
