const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

function publicUser(user) {
  return { id: user._id, email: user.email, name: user.name || null };
}

const register = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const name = (req.body.name || '').trim();

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required.',
        error: 'INVALID_EMAIL'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters.',
        error: 'WEAK_PASSWORD'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with that email already exists.',
        error: 'EMAIL_TAKEN'
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, passwordHash, name: name || undefined });

    res.status(201).json({
      success: true,
      token: signToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: 'REGISTER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    // select('+passwordHash') is required because the schema hides it by default.
    const user = await User.findOne({ email }).select('+passwordHash');

    // Same message whether the email is unknown or the password is wrong —
    // distinguishing the two lets an attacker enumerate registered emails.
    const invalid = () =>
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });

    if (!user) return invalid();

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return invalid();

    res.json({
      success: true,
      token: signToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to sign in',
      error: 'LOGIN_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Requires requireAuth to have run first, which sets req.userId.
const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('❌ Me error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: 'ME_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { register, login, me };
