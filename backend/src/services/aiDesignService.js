const axios = require("axios");
const FormData = require("form-data");

/* =========================================================
   Pollinations Configuration
========================================================= */

const POLLINATIONS_MODEL = "kontext";
const POLLINATIONS_EDIT_URL =
  "https://gen.pollinations.ai/v1/images/edits";

/* =========================================================
   Allowed Room Types
========================================================= */

const ALLOWED_ROOM_TYPES = [
  "living-room",
  "bedroom",
  "kitchen",
  "office",
];

/* =========================================================
   Allowed Design Styles
========================================================= */

const ALLOWED_DESIGN_STYLES = [
  "classic",
  "modern",
  "luxury",
  "minimal",
  "rustic",
];

/* =========================================================
   Validation
========================================================= */

function validateInputs({
  roomImage,
  roomType,
  designStyle,
}) {
  if (!roomImage) {
    throw new Error("Room image is required.");
  }

  if (!ALLOWED_ROOM_TYPES.includes(roomType)) {
    throw new Error(`Invalid room type: ${roomType}`);
  }

  if (!ALLOWED_DESIGN_STYLES.includes(designStyle)) {
    throw new Error(`Invalid design style: ${designStyle}`);
  }
}

/* =========================================================
   Convert Base64 / Data URI to Buffer
========================================================= */

function parseRoomImage(roomImage) {
  if (typeof roomImage !== "string") {
    throw new Error("Invalid room image format.");
  }

  let mimeType = "image/jpeg";
  let base64Data = roomImage;

  /*
    Example:
    data:image/jpeg;base64,xxxxx
  */

  if (roomImage.startsWith("data:image/")) {
    const match = roomImage.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );

    if (!match) {
      throw new Error("Invalid image data URI.");
    }

    mimeType = match[1];
    base64Data = match[2];
  }

  /*
    Remove accidental whitespace/newlines
  */

  base64Data = base64Data.replace(/\s/g, "");

  const imageBuffer = Buffer.from(base64Data, "base64");

  if (!imageBuffer.length) {
    throw new Error("Unable to decode room image.");
  }

  let extension = "jpg";

  if (mimeType === "image/png") {
    extension = "png";
  } else if (mimeType === "image/webp") {
    extension = "webp";
  } else if (mimeType === "image/jpeg") {
    extension = "jpg";
  }

  return {
    buffer: imageBuffer,
    mimeType,
    filename: `room.${extension}`,
  };
}

/* =========================================================
   Build Interior Design Prompt
========================================================= */

function buildDesignPrompt({
  roomType,
  designStyle,
}) {
  const roomName = roomType.replace("-", " ");

  return `
You are a professional interior designer and photorealistic interior visualization specialist.

EDIT THE PROVIDED ROOM PHOTO.

Transform this exact ${roomName} into a premium ${designStyle} interior.

IMPORTANT:
The uploaded image is the ORIGINAL ROOM.
The final image must look like the SAME ROOM after professional interior renovation.

PRESERVE EXACTLY AS MUCH AS POSSIBLE:

- Same room architecture
- Same walls
- Same windows
- Same doors
- Same floor
- Same ceiling
- Same room dimensions
- Same camera viewpoint
- Same camera perspective
- Same camera height
- Same room layout
- Same architectural elements
- Same lighting direction
- Same structural openings

ONLY redesign the interior furniture, decoration and styling.

CHANGE / IMPROVE:

- Sofa
- Bed if applicable
- Tables
- Chairs
- Cabinets
- Storage
- Curtains
- Rugs
- Lighting fixtures
- Wall decoration
- Decorative objects
- Furniture materials
- Furniture colors
- Interior color palette
- Textures
- Styling
- Accessories
- Decorative plants where appropriate

DESIGN STYLE:
${designStyle}

ROOM TYPE:
${roomName}

QUALITY REQUIREMENTS:

- Photorealistic
- Premium interior design
- Professional interior photography
- Realistic furniture proportions
- Realistic materials
- Natural shadows
- Natural reflections
- Realistic lighting
- High-end interior visualization
- Elegant composition
- Balanced furniture placement
- Professional interior designer quality

CRITICAL ROOM PRESERVATION:

Do NOT change the room into another room.

Do NOT:

- Move walls
- Remove walls
- Add unnecessary walls
- Add unnecessary windows
- Remove existing windows
- Change doors
- Change the camera angle
- Change the camera perspective
- Change the floor structure
- Change the ceiling structure
- Distort room dimensions
- Change architectural openings
- Create unrealistic furniture
- Create floating furniture
- Create duplicated objects
- Create distorted objects
- Create cartoon-like objects
- Make the image look like a video game

The output must look like a real photograph of the SAME ROOM redesigned by a professional interior designer.

The requested ${designStyle} style should be clearly visible through furniture, materials, colors, lighting and decoration.

Keep the result natural, realistic and premium.

Return ONLY the edited room image.
`;
}

/* =========================================================
   Generate Room Design with Pollinations
========================================================= */

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
    throw new Error(
      "POLLINATIONS_API_KEY is missing. Add it to backend .env."
    );
  }

  const image = parseRoomImage(roomImage);

  const prompt = buildDesignPrompt({
    roomType,
    designStyle,
  });

  console.log(
    "[Pollinations] Starting room design generation..."
  );

  console.log(
    "[Pollinations] Model:",
    POLLINATIONS_MODEL
  );

  console.log(
    "[Pollinations] Room:",
    roomType
  );

  console.log(
    "[Pollinations] Style:",
    designStyle
  );

  try {
    /* =====================================================
       Multipart Form Data
    ===================================================== */

    const form = new FormData();

    form.append(
      "image",
      image.buffer,
      {
        filename: image.filename,
        contentType: image.mimeType,
      }
    );

    form.append(
      "prompt",
      prompt
    );

    form.append(
      "model",
      POLLINATIONS_MODEL
    );

    form.append(
      "size",
      "1024x1024"
    );

    form.append(
      "response_format",
      "url"
    );

    /* =====================================================
       Pollinations API Request
    ===================================================== */

    const response = await axios.post(
      POLLINATIONS_EDIT_URL,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${apiKey}`,
        },

        maxBodyLength: Infinity,
        maxContentLength: Infinity,

        timeout: 180000,
      }
    );

    console.log(
      "[Pollinations] Request completed."
    );

    const data = response?.data;

    if (!data) {
      throw new Error(
        "Pollinations returned an empty response."
      );
    }

    console.log(
      "[Pollinations] Response received."
    );

    /* =====================================================
       Extract Generated Image URL
    ===================================================== */

    let imageUrl = null;

    /*
      OpenAI-compatible response:

      {
        data: [
          {
            url: "https://..."
          }
        ]
      }
    */

    if (
      Array.isArray(data.data) &&
      data.data.length > 0
    ) {
      imageUrl =
        data.data[0]?.url || null;

      /*
        Some responses may return b64_json
        instead of URL.
      */

      if (
        !imageUrl &&
        data.data[0]?.b64_json
      ) {
        imageUrl =
          `data:image/png;base64,${data.data[0].b64_json}`;
      }
    }

    /*
      Fallback for alternate response shapes
    */

    if (!imageUrl && data.url) {
      imageUrl = data.url;
    }

    if (!imageUrl) {
      console.error(
        "[Pollinations] Unexpected response:",
        JSON.stringify(data, null, 2)
      );

      throw new Error(
        "Pollinations did not return a generated image."
      );
    }

    console.log(
      "[Pollinations] Generated image:",
      imageUrl
    );

    console.log(
      "[Pollinations] Room design generated successfully."
    );

    return {
      imageUrl,
      prompt,
      model: POLLINATIONS_MODEL,
      requestId:
        response?.headers?.["x-request-id"] ||
        null,
    };

  } catch (error) {
    console.error(
      "[Pollinations] Generation failed:"
    );

    console.error(
      error?.message || error
    );

    /* =====================================================
       API Error Details
    ===================================================== */

    if (error?.response) {
      console.error(
        "[Pollinations] Status:",
        error.response.status
      );

      console.error(
        "[Pollinations] Response:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );

      if (error.response.status === 401) {
        throw new Error(
          "Pollinations API key is invalid or missing."
        );
      }

      if (error.response.status === 402) {
        throw new Error(
          "Pollinations balance/Pollen is exhausted. Please check your Pollinations account balance."
        );
      }

      if (error.response.status === 403) {
        throw new Error(
          "Pollinations API access is not available for this key/model."
        );
      }

      if (error.response.status === 429) {
        throw new Error(
          "Pollinations rate limit reached. Please try again later."
        );
      }
    }

    throw new Error(
      error?.message ||
      "Pollinations image generation failed."
    );
  }
}

/* =========================================================
   Exports
========================================================= */

exports.validateInputs =
  validateInputs;

exports.generateRoomDesign =
  generateRoomDesign;

exports.buildDesignPrompt =
  buildDesignPrompt;
