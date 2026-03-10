import { getAllTreks, getTrekById, createTrek } from "../models/trek.model.js";

// GET ALL TREKS
export const fetchTreks = async (req, res) => {
  try {
    const treks = await getAllTreks();

    res.json(treks);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET SINGLE TREK
export const fetchSingleTrek = async (req, res) => {
  try {
    const trek = await getTrekById(req.params.id);

    if (!trek) {
      return res.status(404).json({
        message: "Trek not found",
      });
    }

    res.json(trek);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ADD TREK
export const addTrek = async (req, res) => {
  try {
    await createTrek(req.body);

    res.status(201).json({
      message: "Trek added successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
