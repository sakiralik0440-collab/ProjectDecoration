require('dotenv').config();

// SAFE startup diagnostics — never print the token itself.
console.log("[AI CONFIG] provider:", process.env.AI_PROVIDER);
console.log("[AI CONFIG] HF token configured:", Boolean(process.env.HF_TOKEN));

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dbConnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan('dev'));

// Connect to DB
dbConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
