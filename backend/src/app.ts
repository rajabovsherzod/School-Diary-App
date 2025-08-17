import express, { Express } from "express";
import cors from "cors";
import mainRouter from "@/routes/index";
import errorHandler from "@/middlewares/error.middleware";

const app: Express = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
// Barcha router'lar markazlashtirilgan holda mainRouter orqali ulanadi
app.use("/api", mainRouter);

// Error Handler (should be the last middleware)
app.use(errorHandler);

export default app;
