import express, { Express, Request, Response } from "express";
import mainRouter from "@/routes/index";
import errorHandler from "@/middlewares/error.middleware";

const app: Express = express();

// Middlewares
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Kundalik Backend!");
});

// API Routes
app.use("/api", mainRouter);
app.use(errorHandler);

export default app;
