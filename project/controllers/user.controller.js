import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/user.model.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const existingUser = await findUserByEmail(req.body.email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      email: req.body.email,
      password_hash: hashedPassword,
      full_name: req.body.full_name,
      username: req.body.username,
      profile_picture: req.body.profile_picture,
      phone: req.body.phone,
      date_of_birth: req.body.date_of_birth,
      fitness_level: req.body.fitness_level,
      preferred_difficulty: req.body.preferred_difficulty,
      preferred_max_duration: req.body.preferred_max_duration,
      location_country: req.body.location_country,
      location_city: req.body.location_city,
      bio: req.body.bio,
    };

    await createUser(userData);

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
