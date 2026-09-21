// src/utils/jwt.js
const jwt = require('jsonwebtoken');

// Generate JWT token for a user
// Payload contains user id; token expires in 1 hour
module.exports = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
