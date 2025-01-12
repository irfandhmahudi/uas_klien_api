import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/database.config.js";
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from "./routes/auth.route.js";
import disasterRoutes from "./routes/data.route.js";

dotenv.config();
connectDB();

const app = express();
app.use(cookieParser());

// Middleware untuk parsing body JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://uas-klien-ui.vercel.app", // Sesuaikan dengan domain frontend Anda
    credentials: true, // Mengizinkan pengiriman cookies
  })
);

// Route for users
app.use("/api/v1/user", authRoutes);

// Route for products
app.use("/api/v1/disaster", disasterRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
