import express from "express";

import {
  fetchTreks,
  fetchSingleTrek,
  addTrek,
} from "../controllers/trek.controller.js";

const router = express.Router();

router.get("/", fetchTreks);

router.get("/:id", fetchSingleTrek);

router.post("/", addTrek);

export default router;
