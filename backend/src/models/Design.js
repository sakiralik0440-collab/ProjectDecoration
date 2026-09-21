const mongoose = require('mongoose');

const designSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

module.exports = mongoose.model('Design', designSchema);