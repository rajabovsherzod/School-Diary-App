import express, { Express } from "express";
import cors from "cors";
import mainRouter from "@/routes/index";
import errorHandler from "@/middlewares/error.middleware";

const app: Express = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use("/api", mainRouter);
app.use(errorHandler);

export default app;
