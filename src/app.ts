import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import authRoutes from "./routes/auth.routes";
import { setupSwagger } from "./swagger/setup";

export const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use(errorHandler);
