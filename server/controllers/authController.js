import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { isValidGmail, isStrongPassword } from '../utils/validators.js';

// In-memory fallback user storage if MongoDB is offline
const memoryUsers = new Map();

const generateToken = (userId, email, name) => {
  return jwt.sign(
    { id: userId, email, name },
    process.env.JWT_SECRET || 'super_secret_jwt_key_job_assistant_2026',
    { expiresIn: '7d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password).' });
    }

    const emailLower = email.toLowerCase().trim();
    const cleanName = String(name).trim();

    if (cleanName.length < 2) {
      return res.status(400).json({ message: 'Please enter your full name.' });
    }

    // Only Gmail addresses are accepted
    if (!isValidGmail(emailLower)) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: 'Weak password. Use at least 8 characters with an uppercase letter, a lowercase letter, a number and a special character (no spaces).',
      });
    }

    if (isMongoConnected) {
      const userExists = await User.findOne({ email: emailLower });
      if (userExists) {
        return res.status(409).json({ message: 'User Already Exist' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: cleanName,
        email: emailLower,
        password: hashedPassword,
      });

      const token = generateToken(user._id.toString(), user.email, user.name);
      return res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } else {
      // Memory fallback
      if (memoryUsers.has(emailLower)) {
        return res.status(409).json({ message: 'User Already Exist' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = 'mem_user_' + Date.now();
      const newUser = { id: userId, name: cleanName, email: emailLower, password: hashedPassword };
      memoryUsers.set(emailLower, newUser);

      const token = generateToken(userId, emailLower, cleanName);
      return res.status(201).json({
        user: { id: userId, name: cleanName, email: emailLower },
        token,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    const emailLower = email.toLowerCase().trim();

    if (isMongoConnected) {
      const user = await User.findOne({ email: emailLower });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = generateToken(user._id.toString(), user.email, user.name);
      return res.json({
        user: { id: user._id, name: user.name, email: user.email },
        token,
      });
    } else {
      // Memory fallback
      const user = memoryUsers.get(emailLower);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const token = generateToken(user.id, user.email, user.name);
      return res.json({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id, email, name } = req.user;
    let profile = { id, email, name };

    if (isMongoConnected) {
      const dbUser = await User.findById(id).select('name email');
      if (dbUser) profile = { id: dbUser._id, name: dbUser.name, email: dbUser.email };
    } else if (email && memoryUsers.has(email)) {
      const memUser = memoryUsers.get(email);
      profile = { id: memUser.id, name: memUser.name, email: memUser.email };
    }

    res.json({ user: profile });
  } catch (error) {
    // Fall back to what's inside the token
    res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name } });
  }
};
