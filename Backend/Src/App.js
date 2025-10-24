import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./Db.js";
import router from "../Router/Routes.js";

dotenv.config();

const app = express();

connectDB();
// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ---------- ROUTES ----------
app.use("/api", router);

// ---------- ROOT ROUTE ----------
app.get("/", (req, res) => {
  res.json({ message: "Credit Report Parser API is running" });
});

// ---------- ERROR HANDLING ----------
app.use((req, res, next) => {
  res.status(404).json({ error: "internal server error" });
});





export {app}
