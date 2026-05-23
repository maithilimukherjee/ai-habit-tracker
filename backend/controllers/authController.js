import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Generate JWT token
const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d"
    }
  );
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanName = name ? name.trim() : "";
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanName || !cleanEmail || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password"
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
      avatar: `https://www.gravatar.com/avatar/${cleanEmail}?d=identicon`
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        morningMotivation: user.morningMotivation
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error during registration"
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanEmail || !password) {
      return res.status(400).json({
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        morningMotivation: user.morningMotivation
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login"
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, morningMotivation } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
      user.avatar =
        `https://www.gravatar.com/avatar/${user.email.toLowerCase()}?d=identicon`;
    }

    if (morningMotivation !== undefined) {
      user.morningMotivation = morningMotivation;
    }

    await user.save();

    res.json({ user });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Server error during profile update"
    });
  }
};

export const me = async (req, res) => {
    res.json({ user: req.user });
};

