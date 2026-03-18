import db from "../config/db.js";
import fs from "fs";

//Upload Multiple Images
export const uploadMultipleTrekImages = async (req, res) => {
  try {
    const trek_id = req.body.trek_id;
    const user_id = req.user?.id || req.body.user_id; // ✅ from JWT or body

    if (!trek_id || !user_id) {
      return res.status(400).json({
        message: "trek_id and user_id are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const values = req.files.map((file, index) => [
      user_id,
      trek_id,
      `/uploads/${file.filename}`,
      `Image ${index + 1}`,
      index === 0,
      index + 1,
    ]);

    await db.query(
      `INSERT INTO trek_images 
      (user_id, trek_id, url, caption, is_cover, sort_order)
      VALUES ?`,
      [values],
    );

    res.json({
      message: "Images uploaded successfully",
      files: req.files.map((f) => f.filename),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//delete image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM trek_images WHERE image_id=?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    if (rows[0].user_id !== user_id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const filePath = "." + rows[0].url;
    fs.unlink(filePath, () => {});

    await db.query("DELETE FROM trek_images WHERE image_id=?", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
