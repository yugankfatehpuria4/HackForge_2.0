const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      // Excluded from query results by default — findById/find never leak
      // this unless a query explicitly opts in with .select('+passwordHash').
      select: false
    },
    name: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
