import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConfigDB from "./db/ConfigDB.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  ConfigDB();
  console.log(`App is listning PORT: ${PORT}`);
});
