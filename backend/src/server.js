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

// Middleware
app.use(
  cors({
    origin: [
      'https://project-decoration-git-main-sakiralik0440-collabs-projects.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

// Connect to DB
dbConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

// Global error handler
app.use(errorHandler);

// Render provides PORT automatically
const PORT = process.env.PORT || 5002;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});