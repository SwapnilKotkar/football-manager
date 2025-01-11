// auth-service/src/app.ts
import express, { Application, ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
// import errorHandler from "../../shared/src/middlewares/errorHandler";

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Error Handling Middleware
// app.use(errorHandler as ErrorRequestHandler);

export default app;
