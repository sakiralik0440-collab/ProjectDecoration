const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalRoomImage: {
      type: String,
      required: true,
    },

    roomType: {
      type: String,
      required: true,
    },

    designStyle: {
      type: String,
      required: true,
    },

    generatedImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Important index for My Designs query
designSchema.index({
  user: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Design", designSchema);