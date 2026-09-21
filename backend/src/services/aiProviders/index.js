const { InferenceClient } = require("@huggingface/inference");
const { GoogleGenAI } = require("@google/genai");

function resolveImageToBuffer(image) {
  if (!image) {
    throw new Error("Room image is required.");
  }

  // Data URL
  if (typeof image === "string" && image.startsWith("data:")) {
    const match = image.match(/^data:([^;]+);base64,(.+)$/);

    if (!match) {
      throw new Error("Invalid image data URL.");
    }

    return {
      buffer: Buffer.from(match[2], "base64"),
      contentType: match[1],
    };
  }

  // Remote URL
  if (typeof image === "string" && /^https?:\/\//i.test(image)) {
    throw new Error(
      "Remote image URLs are not supported here. Please upload the image again."
    );
  }

  // Raw base64
  if (typeof image === "string") {
    return {
      buffer: Buffer.from(image, "base64"),
      contentType: "image/jpeg",
    };
  }

  // Buffer
  if (Buffer.isBuffer(image)) {
    return {
      buffer: image,
      contentType: "image/jpeg",
    };
  }

  throw new Error("Unsupported room image format.");
}

function getImageBlob(buffer, contentType) {
  return new Blob([buffer], {
    type: contentType || "image/jpeg",
  });
}

const providers = {
  // ============================================================
  // HUGGING FACE
  // ============================================================
  huggingface: {
    apiKeyEnv: "HF_TOKEN",
    defaultModel: "black-forest-labs/FLUX.1-Kontext-dev",

    async call({ apiKey, prompt, image }) {
      console.log("[HF] Starting image-to-image generation");

      const { buffer, contentType } = resolveImageToBuffer(image);

      if (!buffer || buffer.length < 1000) {
        throw new Error(
          "Uploaded room image is invalid or too small."
        );
      }

      const imageBlob = getImageBlob(buffer, contentType);

      const hf = new InferenceClient(apiKey);

      const model =
        process.env.HF_MODEL ||
        "black-forest-labs/FLUX.1-Kontext-dev";

      console.log("[HF] Model:", model);

      try {
        const output = await hf.imageToImage({
          inputs: imageBlob,
          model,
          parameters: {
            prompt,
          },
        });

        if (!output) {
          throw new Error("Hugging Face returned an empty response.");
        }

        const outputBuffer = Buffer.from(
          await output.arrayBuffer()
        );

        const outputContentType =
          output.type || "image/jpeg";

        console.log(
          "[HF] Generated image bytes:",
          outputBuffer.length
        );

        return `data:${outputContentType};base64,${outputBuffer.toString(
          "base64"
        )}`;
      } catch (error) {
        console.error("[HF] Generation error:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });

        throw new Error(
          `Hugging Face image generation failed: ${error.message}`
        );
      }
    },
  },

  // ============================================================
  // GOOGLE GEMINI
  // ============================================================
  gemini: {
    apiKeyEnv: "GEMINI_API_KEY",
    defaultModel: "gemini-3.1-flash-image",

    async call({ apiKey, prompt, image }) {
      console.log("[Gemini] Starting image-to-image generation");

      const { buffer, contentType } =
        resolveImageToBuffer(image);

      if (!buffer || buffer.length < 1000) {
        throw new Error(
          "Uploaded room image is invalid or too small."
        );
      }

      const base64Image = buffer.toString("base64");

      const ai = new GoogleGenAI({
        apiKey,
      });

      const model =
        process.env.GEMINI_MODEL ||
        "gemini-3.1-flash-image";

      console.log("[Gemini] Model:", model);
      console.log("[Gemini] Image type:", contentType);
      console.log("[Gemini] Image bytes:", buffer.length);

      const input = [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "image",
          mime_type: contentType || "image/jpeg",
          data: base64Image,
        },
      ];

      try {
        const interaction = await ai.interactions.create({
          model,
          input,
          response_format: {
            type: "image",
            mime_type: "image/jpeg",
          },
        });

        if (!interaction) {
          throw new Error(
            "Gemini returned an empty response."
          );
        }

        // Preferred convenience property
        if (interaction.output_image?.data) {
          const outputBuffer = Buffer.from(
            interaction.output_image.data,
            "base64"
          );

          console.log(
            "[Gemini] Generated image bytes:",
            outputBuffer.length
          );

          return `data:image/png;base64,${outputBuffer.toString(
            "base64"
          )}`;
        }

        // Fallback: search through response steps
        for (const step of interaction.steps || []) {
          if (step.type !== "model_output") {
            continue;
          }

          for (const contentBlock of step.content || []) {
            if (
              contentBlock.type === "image" &&
              contentBlock.data
            ) {
              const outputBuffer = Buffer.from(
                contentBlock.data,
                "base64"
              );

              console.log(
                "[Gemini] Generated image bytes:",
                outputBuffer.length
              );

              return `data:image/png;base64,${outputBuffer.toString(
                "base64"
              )}`;
            }
          }
        }

        throw new Error(
          "Gemini response did not contain an image."
        );
      } catch (error) {
        console.error("[Gemini] Generation error:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });

        throw new Error(
          `Gemini image generation failed: ${error.message}`
        );
      }
    },
  },
};

function getProvider(providerName) {
  const name = providerName || "huggingface";
  return providers[name];
}

function isConfigured() {
  const providerName =
    process.env.AI_PROVIDER || "huggingface";

  const provider = providers[providerName];

  if (!provider) {
    return false;
  }

  return Boolean(
    process.env[provider.apiKeyEnv]
  );
}

module.exports = {
  providers,
  getProvider,
  isConfigured,
};