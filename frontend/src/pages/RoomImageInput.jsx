import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ImageUploader from "../components/RoomImageInput/ImageUploader";
import ImagePreview from "../components/RoomImageInput/ImagePreview";
import GenerateStep from "../components/DesignWizard/GenerateStep";
import { useDesignSession } from "../context/DesignContext";
import {
  WIZARD_ROOM_TYPES,
  WIZARD_DESIGN_STYLES,
} from "../data/staticData";
import { MAX_ROOM_IMAGE_MB } from "../services/roomImage";

const RoomImageInput = () => {
  const {
    roomImage,
    roomType,
    designStyle,
    setRoomImage,
    setRoomType,
    setDesignStyle,
    clearRoomImage,
  } = useDesignSession();

  const uploaderRef = useRef(null);

  const [error, setError] = useState(null);
  const [showGenerate, setShowGenerate] = useState(false);

  const handleImageReady = (image) => {
    setError(null);
    setShowGenerate(false);
    setRoomImage(image);
  };

  const handleRemove = () => {
    clearRoomImage();
    setShowGenerate(false);
    setError(null);
  };

  const handleChange = () => {
    if (uploaderRef.current) {
      uploaderRef.current.openPicker();
    }
  };

  const selectedRoom = WIZARD_ROOM_TYPES.find(
    (room) => room.id === roomType
  );

  const selectedStyle = WIZARD_DESIGN_STYLES.find(
    (style) => style.id === designStyle
  );

  const canGenerate =
    Boolean(roomImage) &&
    Boolean(roomType) &&
    Boolean(designStyle);

  const handleGenerate = () => {
    if (!canGenerate) return;

    setShowGenerate(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStartNew = () => {
    clearRoomImage();
    setRoomType("");
    setDesignStyle("");
    setShowGenerate(false);
  };

  /* =========================
     GENERATION SCREEN
  ========================= */

  if (showGenerate && canGenerate) {
    return (
      <section className="design-page">
        <div className="design-container">

          <div className="design-topbar">
            <Link to="/" className="design-back">
              ← Back to Home
            </Link>

            <span className="design-brand-badge">
              AI INTERIOR DESIGN
            </span>
          </div>

          <div className="generation-header">
            <span className="design-eyebrow">YOUR DESIGN</span>

            <h1>Ready to Transform Your Room</h1>

            <p>
              Review your selections and let AI create your new interior.
            </p>
          </div>

          <div className="generation-review">

            <div className="generation-image">
              <img
                src={roomImage.dataUrl}
                alt="Selected room"
              />
            </div>

            <div className="generation-details">

              <span className="review-label">
                SELECTED OPTIONS
              </span>

              <div className="review-item">
                <span className="review-icon">
                  {selectedRoom?.icon || "🏠"}
                </span>

                <div>
                  <small>Room Type</small>
                  <strong>
                    {selectedRoom?.name || roomType}
                  </strong>
                </div>
              </div>

              <div className="review-item">
                <span className="review-icon">
                  ✨
                </span>

                <div>
                  <small>Design Style</small>
                  <strong>
                    {selectedStyle?.name || designStyle}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowGenerate(false)}
              >
                ← Edit Selections
              </button>

            </div>
          </div>

          <GenerateStep
            roomTypeName={selectedRoom?.name || roomType}
            designStyleName={selectedStyle?.name || designStyle}
            payload={{
              roomImage: roomImage.dataUrl,
              roomImagePreview: roomImage.dataUrl,
              roomType,
              designStyle,
            }}
            onBack={() => setShowGenerate(false)}
            onStartNew={handleStartNew}
          />

        </div>
      </section>
    );
  }

  /* =========================
     MAIN DESIGN PAGE
  ========================= */

  return (
    <section className="design-page">

      <div className="design-container">

        {/* TOP BAR */}

        <div className="design-topbar">

          <Link to="/" className="design-back">
            ← Back to Home
          </Link>

          <span className="design-brand-badge">
            AI INTERIOR DESIGN
          </span>

        </div>

        {/* HEADER */}

        <header className="design-hero">

          <div className="design-eyebrow">
            CREATE YOUR SPACE
          </div>

          <h1>
            Design a Room You'll
            <span> Love Coming Home To.</span>
          </h1>

          <p>
            Upload your room, choose a space and select a style.
            Our AI will transform your existing room into a
            beautiful interior concept.
          </p>

        </header>

        {/* MAIN CONTENT */}

        <div className="design-layout">

          {/* =====================
              PHOTO CARD
          ===================== */}

          <div className="design-card photo-card">

            <div className="card-header">

              <div className="step-badge">
                01
              </div>

              <div>
                <h2>Your Room</h2>

                <p>
                  Upload a clear photo of your space.
                </p>
              </div>

            </div>

            {error && (
              <div className="design-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {!roomImage ? (

              <div className="upload-area">

                <div className="upload-icon">
                  ↑
                </div>

                <h3>
                  Upload your room photo
                </h3>

                <p>
                  Drag & drop your image here or choose
                  a photo from your device.
                </p>

                <ImageUploader
                  ref={uploaderRef}
                  onImageReady={handleImageReady}
                  onError={(message) => setError(message)}
                />

                <span className="upload-format">
                  JPG · PNG · WEBP · Max {MAX_ROOM_IMAGE_MB} MB
                </span>

              </div>

            ) : (

              <div className="selected-photo">

                <div className="selected-photo-frame">

                  <img
                    src={roomImage.dataUrl}
                    alt="Selected room"
                  />

                  <div className="photo-overlay">

                    <button
                      type="button"
                      onClick={handleChange}
                      className="photo-action"
                    >
                      Change Photo
                    </button>

                    <button
                      type="button"
                      onClick={handleRemove}
                      className="photo-action photo-delete"
                    >
                      Remove
                    </button>

                  </div>

                </div>

                <div className="photo-success">
                  <span>✓</span>
                  Room photo uploaded successfully
                </div>

              </div>

            )}

          </div>


          {/* =====================
              RIGHT OPTIONS
          ===================== */}

          <div className="design-options">

            {/* ROOM TYPE */}

            <div className="design-card">

              <div className="card-header">

                <div className="step-badge">
                  02
                </div>

                <div>
                  <h2>Room Type</h2>

                  <p>
                    What space are you designing?
                  </p>
                </div>

              </div>

              <div className="room-options-grid">

                {WIZARD_ROOM_TYPES.map((room) => {

                  const icon =
                    room.icon ||
                    (
                      room.id === "living-room"
                        ? "🛋️"
                        : room.id === "bedroom"
                          ? "🛏️"
                          : room.id === "kitchen"
                            ? "🍳"
                            : "💼"
                    );

                  return (
                    <button
                      key={room.id}
                      type="button"
                      className={`room-option ${roomType === room.id
                          ? "active"
                          : ""
                        }`}
                      onClick={() => {
                        setRoomType(room.id);
                        setShowGenerate(false);
                      }}
                    >

                      <span className="room-icon">
                        {icon}
                      </span>

                      <span className="room-name">
                        {room.name}
                      </span>

                      {roomType === room.id && (
                        <span className="option-check">
                          ✓
                        </span>
                      )}

                    </button>
                  );
                })}

              </div>

            </div>


            {/* DESIGN STYLE */}

            <div className="design-card">

              <div className="card-header">

                <div className="step-badge">
                  03
                </div>

                <div>
                  <h2>Interior Style</h2>

                  <p>
                    Choose the look and feeling you want.
                  </p>
                </div>

              </div>

              <div className="style-options-grid">

                {WIZARD_DESIGN_STYLES.map((style) => (

                  <button
                    key={style.id}
                    type="button"
                    className={`style-option ${designStyle === style.id
                        ? "active"
                        : ""
                      }`}
                    onClick={() => {
                      setDesignStyle(style.id);
                      setShowGenerate(false);
                    }}
                  >

                    <div className="style-top">

                      <span className="style-name">
                        {style.name}
                      </span>

                      {designStyle === style.id && (
                        <span className="option-check">
                          ✓
                        </span>
                      )}

                    </div>

                    {style.description && (
                      <span className="style-description">
                        {style.description}
                      </span>
                    )}

                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>


        {/* =====================
            GENERATE BAR
        ===================== */}

        <div
          className={`generate-panel ${canGenerate ? "ready" : ""
            }`}
        >

          <div className="generate-status">

            <div className="generate-status-icon">
              {canGenerate ? "✨" : "○"}
            </div>

            <div>

              <strong>
                {canGenerate
                  ? "Everything is ready"
                  : "Complete your design setup"}
              </strong>

              <p>
                {!roomImage
                  ? "Upload your room photo"
                  : !roomType
                    ? "Select your room type"
                    : !designStyle
                      ? "Select an interior style"
                      : "Your AI transformation is ready"}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="generate-button"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            <span>✨</span>
            Generate Design
            <span>→</span>
          </button>

        </div>


        {/* FOOT NOTE */}

        <div className="design-footer-note">
          🔒 Your room image is used only to create your design.
        </div>

      </div>

    </section>
  );
};

export default RoomImageInput;