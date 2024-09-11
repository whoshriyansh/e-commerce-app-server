import express, { json } from "express";
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

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(json());
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
