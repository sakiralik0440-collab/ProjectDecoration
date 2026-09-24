require('dotenv').config();

// SAFE startup diagnostics — never print secret values.
console.log("[AI CONFIG] provider:", process.env.AI_PROVIDER);
console.log(
  "[AI CONFIG] Pollinations key configured:",
  Boolean(process.env.POLLINATIONS_API_KEY)
);

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dbConnect = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  'https://project-decoration.vercel.app',
  'https://project-decoration-git-main-sakiralik0440-collabs-projects.vercel.app',
  'https://project-decoration-69pp17e1z-sakiralik0440-collabs-projects.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('[CORS] Blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// =====================================================
// BODY PARSING
// =====================================================

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// =====================================================
// LOGGER
// =====================================================

app.use(morgan('dev'));

// =====================================================
// DATABASE
// =====================================================

dbConnect();

// =====================================================
// ROUTES
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(errorHandler);

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
