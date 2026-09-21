const Design = require("../models/Design");
const { generateRoomDesign } = require("../services/aiDesignService");

// ============================================
// POST /api/designs/generate
// ============================================

exports.generate = async (req, res) => {
  try {
    const {
      roomImage,
      roomType,
      designStyle,
    } = req.body;

    const result = await generateRoomDesign({
      roomImage,
      roomType,
      designStyle,
    });

    const design = await Design.create({
      user: req.user.id,
      originalRoomImage: roomImage,
      roomType,
      designStyle,
      generatedImage: result.imageUrl,
    });

    return res.status(201).json({
      design,
    });
  } catch (err) {
    console.error(
      "GENERATE DESIGN ERROR:",
      err
    );

    const status = err.status || 500;

    let message;

    if (
      status === 500 &&
      err.message &&
      err.message.includes(
        "AI image generation"
      )
    ) {
      message =
        "AI image generation failed. Please try again.";
    } else if (
      status === 503 &&
      err.message
    ) {
      message = err.message;
    } else {
      message =
        err.message ||
        "Unable to generate your design. Please try again.";
    }

    return res.status(status).json({
      message,
    });
  }
};

// ============================================
// GET /api/designs?limit=N
// ============================================

exports.list = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 20,
        1
      ),
      50
    );

    const designs = await Design.find({
      user: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .limit(limit);

    return res.status(200).json({
      designs,
    });
  } catch (err) {
    console.error(
      "LIST DESIGNS ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to load your designs.",
    });
  }
};

// ============================================
// GET /api/designs/:id
// ============================================

exports.getById = async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!design) {
      return res.status(404).json({
        message: "Design not found.",
      });
    }

    return res.status(200).json({
      design,
    });
  } catch (err) {
    console.error(
      "GET DESIGN ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to load the design.",
    });
  }
};

// ============================================
// GET /api/designs/:id/download
// ============================================

exports.download = async (req, res) => {
  try {
    const design = await Design.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!design) {
      return res.status(404).json({
        message: "Design not found.",
      });
    }

    const generatedImage =
      design.generatedImage;

    if (!generatedImage) {
      return res.status(404).json({
        message:
          "Generated image not available.",
      });
    }

    // Pollinations / external image URL
    if (
      /^https?:\/\//i.test(
        generatedImage
      )
    ) {
      const axios = require("axios");

      const response = await axios.get(
        generatedImage,
        {
          responseType:
            "arraybuffer",
          timeout: 30000,
        }
      );

      res.setHeader(
        "Content-Type",
        response.headers[
        "content-type"
        ] || "image/jpeg"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="ai-room-design-${design._id}.jpg"`
      );

      return res.send(
        response.data
      );
    }

    return res.redirect(
      generatedImage
    );
  } catch (err) {
    console.error(
      "DOWNLOAD DESIGN ERROR:",
      err
    );

    return res.status(502).json({
      message:
        "Unable to download the image right now.",
    });
  }
};

// ============================================
// DELETE /api/designs/:id
// ============================================

exports.remove = async (req, res) => {
  try {
    const design =
      await Design.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!design) {
      return res.status(404).json({
        message: "Design not found.",
      });
    }

    return res.status(200).json({
      message:
        "Design deleted successfully.",
      designId: design._id,
    });
  } catch (err) {
    console.error(
      "DELETE DESIGN ERROR:",
      err
    );

    return res.status(500).json({
      message:
        "Unable to delete the design.",
    });
  }
};