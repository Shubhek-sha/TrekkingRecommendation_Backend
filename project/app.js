import express from "express";
import recommendationRoutes from "./routes/recommendation.routes.js";

const app = express();

app.use(express.json());

app.use("/api/recommend", recommendationRoutes);

export default app;