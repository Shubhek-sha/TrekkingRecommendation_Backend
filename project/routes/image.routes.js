import express from "express";
import upload from "../utils/upload.js";

import {
  uploadMultipleTrekImages,
  deleteImage,
} from "../controllers/image.controller.js";

const router = express.Router();

// multiple upload
router.post("/trek", upload.array("images", 10), uploadMultipleTrekImages);

// get images
// router.get("/:trek_id", getTrekImages);

// delete image
router.delete("/:id", deleteImage);

export default router;
