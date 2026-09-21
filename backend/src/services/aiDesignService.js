
const axios = require("axios");
const FormData = require("form-data");
const sharp = require("sharp");

const {
  buildDesignPrompt,
  ALLOWED_ROOM_TYPES,
  ALLOWED_DESIGN_STYLES,
} = require("./aiPrompts");

function invalidField(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function notConfiguredError() {
  const error = new Error("Pollinations AI is not configured.");
  error.status = 503;
  error.code = "AI_NOT_CONFIGURED";
  return error;
}

function validateInputs({ roomImage, roomType, designStyle }) {
  if (!roomImage) {
    throw invalidField("Room image is required.");
  }

  if (!roomType || !ALLOWED_ROOM_TYPES.includes(roomType)) {
    throw invalidField("Room type is missing or invalid.");
  }

  if (!designStyle || !ALLOWED_DESIGN_STYLES.includes(designStyle)) {
    throw invalidField("Design style is missing or invalid.");
  }
}

function getImageBuffer(roomImage) {
  if (Buffer.isBuffer(roomImage)) {
    return roomImage;
  }

  const value = String(roomImage);

  if (value.startsWith("data:image/")) {
    const base64 = value.replace(
      /^data:image\/[^;]+;base64,/,
      ""
    );

    return Buffer.from(base64, "base64");
  }

  return Buffer.from(value, "base64");
}

async function prepareImage(roomImage) {
  const originalBuffer = getImageBuffer(roomImage);

  console.log(
    "[POLLINATIONS] Original image:",
    Math.round(originalBuffer.length / 1024),
    "KB"
  );

  const processedBuffer = await sharp(originalBuffer)
    .rotate()
    .resize({
      width: 1024,
      height: 1024,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 75,
      mozjpeg: true,
    })
    .toBuffer();

  console.log(
    "[POLLINATIONS] Compressed image:",
    Math.round(processedBuffer.length / 1024),
    "KB"
  );

  return processedBuffer;
}

async function generateRoomDesign({
  roomImage,
  roomType,
  designStyle,
}) {
  validateInputs({
    roomImage,
    roomType,
    designStyle,
  });

  const apiKey = process.env.POLLINATIONS_API_KEY;

  if (!apiKey) {
    throw notConfiguredError();
  }

  /*
   * IMPORTANT:
   * Do NOT pass roomImage to buildDesignPrompt.
   *
   * roomImage is a large base64 string.
   * Passing it into the prompt causes:
   *
   * "Too big: expected string to have <=32000 characters"
   */

  const prompt = buildDesignPrompt({
    roomType,
    designStyle,
  });

  try {
    const imageBuffer = await prepareImage(roomImage);

    const form = new FormData();

    /*
     * Send the room image as an actual file.
     */
    form.append("image", imageBuffer, {
      filename: "room.jpg",
      contentType: "image/jpeg",
    });

    /*
     * Send ONLY the text instructions here.
     * No base64 image inside prompt.
     */
    form.append("prompt", prompt);

    form.append(
      "model",
      "black-forest-labs/flux.1-kontext-pro"
    );

    form.append("size", "1024x1024");

    form.append("response_format", "url");

    console.log(
      "[POLLINATIONS] Sending image for editing..."
    );

    const response = await axios.post(
      "https://gen.pollinations.ai/v1/images/edits",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 300000,
      }
    );

    const data = response.data;

    console.log(
      "[POLLINATIONS] Generation successful."
    );

    if (data?.data?.[0]?.url) {
      return {
        imageUrl: data.data[0].url,
        prompt,
      };
    }

    if (data?.data?.[0]?.b64_json) {
      return {
        imageUrl:
          `data:image/png;base64,${data.data[0].b64_json}`,
        prompt,
      };
    }

    throw new Error(
      "Pollinations returned an unexpected response."
    );
  } catch (error) {
    console.error(
      "POLLINATIONS AI ERROR:",
      error.response?.data || error.message
    );

    const apiError =
      error.response?.data?.error?.message ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Pollinations image generation failed.";

    const finalError = new Error(apiError);

    finalError.status =
      error.response?.status || 500;

    throw finalError;
  }
}

exports.validateInputs = validateInputs;
exports.generateRoomDesign = generateRoomDesign;


// cd C:\ProjectDecoration\backend
// npm run dev
// ```

// If the server is already running, just:

// ```text
// Ctrl + C
// npm run dev
// ```

// ### Why this should fix your exact error

// **Before:**

// ```text
// roomImage
//    ↓
// buildDesignPrompt()
//    ↓
// huge base64 string inside prompt
//    ↓
// > 32,000 characters ❌
// ```

// **Now:**

// ```text
// roomImage ───────────────→ multipart image
//                               ↓
//                          Pollinations

// roomType + designStyle → short text prompt
//                               ↓
//                          Pollinations
// ```

// So the `roomImage` is **never inserted into the prompt**.

// Also, the current Pollinations platform explicitly supports media inputs and image editing models such as **FLUX.1 Kontext Pro**, so this architecture matches the service's current capabilities.

// **Don't change frontend, don't change `.env`, and don't touch LocalAI.** Just replace this one file and restart the backend.
