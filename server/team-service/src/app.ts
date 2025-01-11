// team-service/src/app.ts
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import teamRoutes from "./routes/teamRoutes";
// import errorHandler from "../../shared/src/middlewares/errorHandler";

dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/team", teamRoutes);

// Error Handling Middleware
// app.use(errorHandler);

export default app;
