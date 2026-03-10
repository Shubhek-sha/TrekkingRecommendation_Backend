import express from "express";
import { recommendTreks } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/:userId", recommendTreks);

export default router;