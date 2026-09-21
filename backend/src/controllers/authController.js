const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requestOtp: requestOtpService, verifyOtp: verifyOtpService } = require('../services/otpService');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// =====================================================
// REGISTER (legacy – now delegated to OTP verification)
// POST /api/auth/register
// =====================================================
// NOTE: The original register endpoint is now handled via OTP verification.
// Keeping this export for backward compatibility is optional; we will disable direct registration.
// For safety, we replace it with a placeholder that returns 404.
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Basic validation (same as OTP request)
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!pwRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include a letter and a number',
      });
    }
    // Check email uniqueness
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Server error' });
  }
  return res.status(404).json({ message: 'Registration via this endpoint is disabled. Use /register/request-otp instead.' });
};

// ---------------------------------------------------------------------
// OTP REQUEST HANDLER
// POST /api/auth/register/request-otp
// ---------------------------------------------------------------------
exports.requestOtp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // Basic validation (reuse same checks as original register)
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!pwRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, include a letter and a number',
      });
    }
    // Delegate OTP creation/sending to service
    await requestOtpService({ email, name, password, confirmPassword });
    return res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || 'Server error' });
  }
};

// ---------------------------------------------------------------------
// OTP VERIFICATION HANDLER (creates user after successful OTP)
// POST /api/auth/register/verify-otp
// ---------------------------------------------------------------------
exports.verifyOtp = async (req, res) => {
  try {
    // Expected body: email, otp, name, password, confirmPassword
    const { email, otp, name, password, confirmPassword } = req.body;

    // Verify OTP via service; will throw on failure and return the payload
    const payload = await verifyOtpService({ email, otp, name, password, confirmPassword });

    // After successful OTP verification, create the user (same logic as legacy register)
    // Ensure email is still unique (race condition guard)
    const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = new User({
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      passwordHash,
    });
    await user.save();

    // Respond with success – never include password or OTP
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message || 'Server error' });
  }
};


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // IMPORTANT:
    // passwordHash has select:false in User model,
    // so we MUST explicitly select it here.
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+passwordHash');

    // User not found
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Generate JWT
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);

    return res.status(500).json({
      message: err.message || 'Server error',
    });
  }
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-passwordHash'
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    console.error('GET ME ERROR:', err);

    return res.status(500).json({
      message: err.message || 'Server error',
    });
  }
};
