import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../config/prisma.js';
import {generateOTP} from '../utils/otp.js';

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {email: req.body.email},
    });

    if (existingUser) {
      return res.status(400).json({message: 'Email already registered'});
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.create({
      data: {
        email: req.body.email,
        password_hash: hashedPassword,
        full_name: req.body.full_name,
        username: req.body.username,
        profile_picture: req.body.profile_picture,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth ? new Date(req.body.date_of_birth) : null,
        fitness_level: req.body.fitness_level ? parseInt(req.body.fitness_level) : null,
        preferred_difficulty: req.body.preferred_difficulty,
        preferred_max_duration: req.body.preferred_max_duration ? parseInt(req.body.preferred_max_duration) : null,
        location_country: req.body.location_country,
        location_city: req.body.location_city,
        bio: req.body.bio,
        otp,
        otp_expires: otpExpires,
      },
    });

    // Send OTP
    console.log(`OTP for ${req.body.email}: ${otp}`);

    res.status(201).json({
      message: 'User registered. OTP sent to email.',
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  const {email, otp} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    if (user.otp !== otp) {
      return res.status(400).json({message: 'Invalid OTP'});
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({message: 'OTP expired'});
    }

    // Clear OTP
    await prisma.user.update({
      where: {email},
      data: {otp: null, otp_expires: null},
    });

    res.json({message: 'OTP verified successfully. Account activated.'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({message: 'Invalid password'});

    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    //remove sensetive info
    const {password_hash, otp, otp_expires, ...userWithoutSensitive} = user;

    res.json({token, user: userWithoutSensitive});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        email: true,
        full_name: true,
        username: true,
        profile_picture: true,
        phone: true,
        date_of_birth: true,
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
        location_country: true,
        location_city: true,
        bio: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {user_id: req.user.id},
      select: {
        user_id: true,
        email: true,
        full_name: true,
        username: true,
        profile_picture: true,
        phone: true,
        date_of_birth: true,
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
        location_country: true,
        location_city: true,
        bio: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
