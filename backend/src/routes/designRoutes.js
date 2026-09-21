const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const designController = require("../controllers/designController");

// Every design route requires an authenticated user.
router.use(authMiddleware);

// Generate a new design
router.post("/generate", designController.generate);

// Get logged-in user's designs
router.get("/", designController.list);

// Download generated design
router.get("/:id/download", designController.download);

// Delete a design
router.delete("/:id", designController.remove);

// Get a single design
router.get("/:id", designController.getById);

module.exports = router;