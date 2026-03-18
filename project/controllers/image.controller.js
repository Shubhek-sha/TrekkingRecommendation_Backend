import db from "../config/db.js";
import fs from "fs";

// 🔥 Upload Multiple Images
export const uploadMultipleTrekImages = async (req, res) => {
  try {
    const trek_id = req.body.trek_id || req.fields?.trek_id;

    if (!trek_id) {
      return res.status(400).json({ message: "trek_id is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const values = req.files.map((file, index) => [
      trek_id,
      `/uploads/${file.filename}`,
      `Image ${index + 1}`,
      index === 0,
      index + 1,
    ]);

    await db.query(
      `INSERT INTO trek_images 
       (trek_id, url, caption, is_cover, sort_order)
       VALUES ?`,
      [values],
    );

    res.json({
      message: "Images uploaded",
      files: req.files.map((f) => f.filename),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Get Images
export const getTrekImages = async (req, res) => {
  try {
    const { trek_id } = req.params;

    const [images] = await db.query(
      "SELECT * FROM trek_images WHERE trek_id=? ORDER BY sort_order",
      [trek_id],
    );

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 Delete Image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT url FROM trek_images WHERE image_id=?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const filePath = "." + rows[0].url;

    fs.unlink(filePath, () => {});

    await db.query("DELETE FROM trek_images WHERE image_id=?", [id]);

    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
