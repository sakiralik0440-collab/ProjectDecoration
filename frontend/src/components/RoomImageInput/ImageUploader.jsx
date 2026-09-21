import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  validateRoomImageFile,
  fileToDataUrl,
  decodeImageDimensions,
  newId,
  mimeFromFileName,
} from "../../services/roomImage";

const ImageUploader = forwardRef(
  ({ onImageReady, onError, label = "Upload Space", className }, ref) => {
    const inputRef = useRef(null);
    const [busy, setBusy] = useState(false);

    const openPicker = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    useImperativeHandle(ref, () => ({ openPicker }));

    const handleFile = async (event) => {
      const file = event.target.files && event.target.files[0];
      // Ensure a cancelled picker (no file) changes nothing and a repeat pick
      // of the same file still fires.
      event.target.value = "";

      if (!file) return;

      const result = validateRoomImageFile(file);
      if (!result.valid) {
        onError(result.message);
        return;
      }

      setBusy(true);
      try {
        const dataUrl = await fileToDataUrl(file);
        const { width, height } = await decodeImageDimensions(dataUrl);
        onImageReady({
          id: newId("upload"),
          source: "upload",
          originalFilename: file.name || "space-image",
          fileType: file.type || mimeFromFileName(file.name) || "image/jpeg",
          sizeBytes: file.size,
          dataUrl,
          width,
          height,
          createdAt: new Date().toISOString(),
        });
      } catch {
        onError("Please select a valid image file.");
      } finally {
        setBusy(false);
      }
    };

    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
          onChange={handleFile}
          aria-hidden="true"
          tabIndex={-1}
        />
        <button
          type="button"
          className={className || "btn btn-primary"}
          onClick={openPicker}
          disabled={busy}
        >
          {busy ? "Reading image…" : label}
        </button>
      </>
    );
  }
);

ImageUploader.displayName = "ImageUploader";

export default ImageUploader;