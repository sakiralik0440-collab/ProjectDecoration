import React from "react";
import { formatBytes } from "../../services/roomImage";

const ImagePreview = ({ roomImage, onChangeLabel, onChange, onRemove }) => {
  if (!roomImage) return null;

  const isCamera = roomImage.source === "camera";

  return (
    <div className="room-preview">
      <div className="room-preview-frame">
        <img
          src={roomImage.dataUrl}
          alt="Your space"
          role="img"
          aria-label="Preview of your space photo"
        />
      </div>

      <div className="room-preview-meta">
        <span className="room-preview-name">
          {roomImage.originalFilename || (isCamera ? "Captured photo" : "Space image")}
        </span>
        {typeof roomImage.sizeBytes === "number" && (
          <span className="room-preview-size">{formatBytes(roomImage.sizeBytes)}</span>
        )}
      </div>

      <div className="room-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onChange}
        >
          {onChangeLabel || (isCamera ? "Retake" : "Change Image")}
        </button>
        <button
          type="button"
          className="btn btn-ghost room-remove"
          onClick={onRemove}
        >
          Remove Image
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;