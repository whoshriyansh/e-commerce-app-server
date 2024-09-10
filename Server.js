import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConfigDB from "./db/ConfigDB.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/Auth.route.js";
import userRoutes from "./routes/User.route.js";
import productRoutes from "./routes/Product.route.js";
import orderRoutes from "./routes/Order.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  ConfigDB();
  console.log(`App is listning PORT: ${PORT}`);
});
