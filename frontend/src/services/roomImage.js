export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MAX_ROOM_IMAGE_BYTES = 10 * 1024 * 1024;

export const MAX_ROOM_IMAGE_MB = MAX_ROOM_IMAGE_BYTES / (1024 * 1024);

export const CAMERA_DENIED_MESSAGE = "Camera permission is required to capture a space photo.";

export const INVALID_IMAGE_MESSAGE = "Please select a valid image file.";

export const OVERSIZED_IMAGE_MESSAGE =
  "The image is too large. Please choose a smaller image.";

const ALLOWED_EXTENSION_RE = /\.(jpe?g|png|webp)$/i;

const MIME_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export function mimeFromFileName(name = "") {
  const match = name.toLowerCase().match(/\.(jpe?g|png|webp)$/);
  return match ? MIME_BY_EXTENSION[match[0]] : null;
}

export function validateRoomImageFile(file) {
  if (!file || !(file instanceof File)) {
    return { valid: false, message: INVALID_IMAGE_MESSAGE };
  }

  const allowedType = file.type && ALLOWED_IMAGE_TYPES.includes(file.type);
  const allowedExtension = ALLOWED_EXTENSION_RE.test(file.name || "");

  if (!allowedType && !allowedExtension) {
    return { valid: false, message: INVALID_IMAGE_MESSAGE };
  }

  if (file.size > MAX_ROOM_IMAGE_BYTES) {
    return { valid: false, message: OVERSIZED_IMAGE_MESSAGE };
  }

  return { valid: true };
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function decodeImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Unable to decode image"));
    img.src = dataUrl;
  });
}

export function captureFrameToDataUrl(video, quality = 0.9) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not supported");
  }
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function newId(prefix = "img") {
  const rand =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${rand}`;
}