import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Lightbox from "../Lightbox";
import "./GenerateStep.css";
import { generateDesign, downloadDesign } from "../../services/designs";

const GenerateStep = ({
  roomTypeName,
  designStyleName,
  payload,
  onBack,
  onStartNew,
}) => {
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  /* =========================
     LIGHTBOX
     ========================= */

  const openLightbox = (src) => {
    if (!src) return;

    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc("");
  };

  /* =========================
     GENERATE DESIGN
     ========================= */

  const handleGenerate = async () => {
    setStatus("loading");
    setErrorMessage("");
    setResult(null);
    setSaved(false);

    try {
      const design = await generateDesign(payload);

      setResult(design);
      setSaved(false);
      setStatus("ready");
    } catch (err) {
      console.error("Generate design error:", err);

      setStatus("error");

      setErrorMessage(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "We couldn't generate your design right now. Please try again."
      );
    }
  };

  /* =========================
     SAVE DESIGN
     ========================= */

  const handleSave = () => {
    if (!result?._id) return;

    setSaved(true);

    /*
      generateDesign() already saves the design
      in MongoDB through the backend.

      So no second save API is required.
    */

    setTimeout(() => {
      navigate("/designs");
    }, 350);
  };

  /* =========================
     DOWNLOAD DESIGN
     ========================= */

  const handleDownload = async () => {
    if (!result?._id || downloading) return;

    setDownloading(true);
    setErrorMessage("");

    try {
      const blob = await downloadDesign(result._id);

      if (!blob || blob.size === 0) {
        throw new Error("Downloaded file is empty.");
      }

      const url = window.URL.createObjectURL(blob);

      /*
        Mobile browsers handle direct anchor downloads
        differently. Opening the generated blob in a new
        tab gives mobile users a reliable way to save the image.
      */

      const isMobile =
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        const newWindow = window.open(url, "_blank");

        if (!newWindow) {
          /*
            If popup is blocked, navigate current tab
            to the image instead.
          */
          window.location.href = url;
        }

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 60000);
      } else {
        const link = document.createElement("a");

        link.href = url;
        link.download = `room-design-${result._id}.png`;
        link.rel = "noopener";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 2000);
      }
    } catch (err) {
      console.error("Download design error:", err);

      setErrorMessage(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to download the design right now."
      );
    } finally {
      setDownloading(false);
    }
  };

  /* =========================
     LOADING
     ========================= */

  if (status === "loading") {
    return (
      <>
        <h2 className="dw-heading">
          🤖 Generating Your Space...
        </h2>

        <p className="dw-subtitle">
          Our AI is analyzing the room and creating your personalized
          interior design. This can take up to a minute.
        </p>

        <div className="state-box centered">
          <div className="spinner" aria-hidden="true" />

          <p>
            Designing your{" "}
            {roomTypeName?.toLowerCase() || "room"} space...
          </p>
        </div>
      </>
    );
  }

  /* =========================
     ERROR
     ========================= */

  if (status === "error") {
    return (
      <>
        <h2 className="dw-heading">
          😕 We Hit a Snag
        </h2>

        <p className="dw-subtitle">
          Something went wrong while generating your design.
        </p>

        <div className="state-box">
          <p>{errorMessage}</p>

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
            >
              Back
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGenerate}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  /* =========================
     READY / RESULT
     ========================= */

  if (status === "ready" && result) {
    const generatedUrl =
      result.imageUrl || result.generatedImage;

    return (
      <>
        <h2 className="dw-heading">
          🎉 Your Space Design Is Ready!
        </h2>

        <p className="dw-subtitle">
          Compare your original room with your AI-generated design.
        </p>

        <div className="dw-result">

          {/* BEFORE */}

          <div className="dw-result-panel">
            <span className="dw-result-tag">
              Before
            </span>

            <div
              className="preview-card"
              onClick={() =>
                openLightbox(payload.roomImagePreview)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(payload.roomImagePreview);
                }
              }}
            >
              <img
                src={payload.roomImagePreview}
                alt="Your original space"
                className="preview-image"
              />

              <div className="preview-hint">
                🔍 Click to enlarge
              </div>
            </div>
          </div>

          {/* ARROW */}

          <div className="dw-result-divider">
            →
          </div>

          {/* AFTER */}

          <div className="dw-result-panel">
            <span className="dw-result-tag dw-result-tag-accent">
              AI Design
            </span>

            {generatedUrl ? (
              <div
                className="preview-card"
                onClick={() =>
                  openLightbox(generatedUrl)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(generatedUrl);
                  }
                }}
              >
                <img
                  src={generatedUrl}
                  alt={`${roomTypeName} in ${designStyleName} style`}
                  className="preview-image"
                />

                <div className="preview-hint">
                  🔍 Click to enlarge
                </div>
              </div>
            ) : (
              <div className="dw-result-empty">
                No generated image available yet.
              </div>
            )}
          </div>
        </div>

        {/* LIGHTBOX */}

        <Lightbox
          isOpen={lightboxOpen}
          src={lightboxSrc}
          onClose={closeLightbox}
        />

        {/* DESIGN DETAILS */}

        <div className="dw-summary">

          <div className="dw-summary-row">
            <span className="dw-summary-key">
              Room Type
            </span>

            <span className="dw-summary-val">
              {roomTypeName || "—"}
            </span>
          </div>

          <div className="dw-summary-row">
            <span className="dw-summary-key">
              Design Style
            </span>

            <span className="dw-summary-val">
              {designStyleName || "—"}
            </span>
          </div>

        </div>

        {/* ACTIONS */}

        <div className="dw-actions dw-actions-left">

          {/* SAVE */}

          <button
            type="button"
            className={`btn btn-save ${saved ? "saved" : ""
              }`}
            onClick={handleSave}
            disabled={!result?._id || saved}
          >
            {saved
              ? "✓ Saved to My Designs"
              : "♡ Save Design"}
          </button>

          {/* DOWNLOAD */}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={
              downloading ||
              !result?._id ||
              !generatedUrl
            }
          >
            {downloading
              ? "Preparing..."
              : "↓ Download Design"}
          </button>

          {/* NEW DESIGN */}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onStartNew}
          >
            Start a New Design
          </button>

        </div>

        {/* MOBILE DOWNLOAD HELP */}

        {errorMessage && (
          <div className="download-error">
            {errorMessage}
          </div>
        )}
      </>
    );
  }

  /* =========================
     INITIAL GENERATE SCREEN
     ========================= */

  return (
    <>
      <h2 className="dw-heading">
        🤖 Generate Design
      </h2>

      <p className="dw-subtitle">
        Your room is analyzed and ready for AI generation.
      </p>

      <div className="dw-summary">

        <div className="dw-summary-row">
          <span className="dw-summary-key">
            Room Type
          </span>

          <span className="dw-summary-val">
            {roomTypeName || "—"}
          </span>
        </div>

        <div className="dw-summary-row">
          <span className="dw-summary-key">
            Design Style
          </span>

          <span className="dw-summary-val">
            {designStyleName || "—"}
          </span>
        </div>

      </div>

      <div className="dw-actions">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGenerate}
        >
          ✦ Generate My Design
        </button>

      </div>
    </>
  );
};

export default GenerateStep;
