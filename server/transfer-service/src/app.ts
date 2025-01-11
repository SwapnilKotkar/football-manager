// transfer-service/src/app.ts
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import transferRoutes from "./routes/transferRoutes";
// import errorHandler from "../../shared/src/middlewares/errorHandler";

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/transfer", transferRoutes);

// Error Handling Middleware
// app.use(errorHandler);

export default app;
