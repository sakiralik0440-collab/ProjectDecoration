const crypto = require('crypto');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Otp = require('../models/Otp');

const OTP_EXPIRY_MIN =
  parseInt(process.env.OTP_EXPIRY_MIN, 10) || 5;

const OTP_RATE_LIMIT =
  parseInt(process.env.OTP_RATE_LIMIT, 10) || 3;

const OTP_DEV_MODE =
  String(process.env.OTP_DEV_MODE).toLowerCase() === 'true';

console.log('[OTP Service] Development OTP mode:', OTP_DEV_MODE);

/**
 * Generate secure 6-digit OTP
 */
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Send OTP email using Brevo REST API
 */
async function sendOtpEmail(email, otp) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  if (!process.env.OTP_FROM) {
    throw new Error('OTP_FROM is not configured');
  }

  const emailData = {
    sender: {
      name: process.env.OTP_FROM_NAME || 'ProjectDecoration',
      email: process.env.OTP_FROM,
    },

    to: [
      {
        email,
      },
    ],

    subject: 'ProjectDecoration - Email Verification OTP',

    htmlContent: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 30px auto;
        padding: 25px;
        border: 1px solid #ddd;
        border-radius: 12px;
      ">
        <h2>ProjectDecoration</h2>

        <p>Hello,</p>

        <p>
          Thank you for registering with ProjectDecoration.
          Your email verification OTP is:
        </p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          padding: 20px;
          margin: 20px 0;
          background: #f5f5f5;
          border-radius: 8px;
        ">
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>${OTP_EXPIRY_MIN} minutes</strong>.
        </p>

        <p>
          Please do not share this OTP with anyone.
        </p>

        <p>
          If you did not request this OTP, you can safely ignore this email.
        </p>

        <p>
          Regards,<br />
          <strong>ProjectDecoration Team</strong>
        </p>
      </div>
    `,
  };

  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      emailData,
      {
        headers: {
          accept: 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      }
    );

    console.log(
      '[OTP Email] Sent successfully:',
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      '[Brevo Error]',
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to send OTP email'
    );
  }
}

/**
 * Request OTP
 */
async function requestOtp({
  email,
  name,
  password,
  confirmPassword,
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date();

  const oneHourAgo = new Date(
    now.getTime() - 60 * 60 * 1000
  );

  let otpDoc = await Otp.findOne({
    email: normalizedEmail,
  });

  if (otpDoc) {
    if (
      otpDoc.lastRequestedAt &&
      otpDoc.lastRequestedAt < oneHourAgo
    ) {
      otpDoc.requestCount = 1;
    } else {
      otpDoc.requestCount += 1;
    }

    if (otpDoc.requestCount > OTP_RATE_LIMIT) {
      const err = new Error(
        'Too many OTP requests. Please try again later.'
      );

      err.status = 429;
      throw err;
    }
  } else {
    otpDoc = new Otp({
      email: normalizedEmail,
      requestCount: 1,
    });
  }

  const otp = generateOtp();

  const otpHash = await bcrypt.hash(otp, 12);

  otpDoc.otpHash = otpHash;

  otpDoc.expiresAt = new Date(
    now.getTime() + OTP_EXPIRY_MIN * 60 * 1000
  );

  otpDoc.used = false;
  otpDoc.lastRequestedAt = now;

  await otpDoc.save();

  if (OTP_DEV_MODE) {
    console.log(
      `[DEV OTP] Email: ${normalizedEmail} | OTP: ${otp} | Expires in ${OTP_EXPIRY_MIN} minutes`
    );
  } else {
    await sendOtpEmail(normalizedEmail, otp);
  }

  return {
    message: 'OTP sent successfully',
  };
}

/**
 * Verify OTP
 */
async function verifyOtp({
  email,
  otp,
  name,
  password,
  confirmPassword,
}) {
  const normalizedEmail = email.trim().toLowerCase();

  const otpDoc = await Otp.findOne({
    email: normalizedEmail,
  });

  if (!otpDoc) {
    const err = new Error('OTP not found');
    err.status = 400;
    throw err;
  }

  if (otpDoc.used) {
    const err = new Error('OTP already used');
    err.status = 410;
    throw err;
  }

  if (otpDoc.expiresAt < new Date()) {
    const err = new Error('OTP expired');
    err.status = 410;
    throw err;
  }

  const match = await bcrypt.compare(
    otp,
    otpDoc.otpHash
  );

  if (!match) {
    const err = new Error('Invalid OTP');
    err.status = 401;
    throw err;
  }

  otpDoc.used = true;

  await otpDoc.save();

  return {
    email: normalizedEmail,
    name,
    password,
    confirmPassword,
  };
}

module.exports = {
  requestOtp,
  verifyOtp,
};