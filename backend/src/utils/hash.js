// src/utils/hash.js
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

module.exports = {
  hashPassword: async (plain) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
  },
  comparePassword: async (plain, hash) => {
    return bcrypt.compare(plain, hash);
  }
};
