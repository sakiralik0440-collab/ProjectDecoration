const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true }, // bcrypt hash of the OTP
    expiresAt: { type: Date, required: true }, // expiry time (5 minutes)
    used: { type: Boolean, default: false }, // whether OTP has been consumed
    requestCount: { type: Number, default: 1 }, // number of OTP requests in the current window
    lastRequestedAt: { type: Date, default: Date.now }, // timestamp of the last request
  },
  { timestamps: true }
);

// Ensure one OTP doc per email for easy upsert
otpSchema.index({ email: 1 }, { unique: true });
// TTL index to automatically delete expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
