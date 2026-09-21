import React, { useEffect, useRef, useState } from "react";
import {
  captureFrameToDataUrl,
  newId,
  CAMERA_DENIED_MESSAGE,
} from "../../services/roomImage";

const CAMERA_UNAVAILABLE_MESSAGE =
  "Camera capture isn't available on this device. Please use Upload Space instead.";

const CameraCapture = ({ onCaptured, onCancel }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState("requesting"); // requesting | streaming | captured | denied | unavailable
  const [capturedImage, setCapturedImage] = useState(null);

  const stopStream = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("unavailable");
      return;
    }

    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("streaming");
      }
    } catch (err) {
      if (!mountedRef.current) return;
      if (err && err.name === "NotAllowedError") {
        setStatus("denied");
      } else if (err && err.name === "NotFoundError") {
        setStatus("unavailable");
      } else {
        setStatus("unavailable");
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      mountedRef.current = false;
      stopStream();
    };
    // startCamera intentionally runs once on mount (retry is via the button)
  }, []);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    try {
      const dataUrl = captureFrameToDataUrl(video);
      setCapturedImage({
        id: newId("camera"),
        source: "camera",
        originalFilename: null,
        fileType: "image/jpeg",
        sizeBytes: Math.round((dataUrl.length * 3) / 4),
        dataUrl,
        width: video.videoWidth,
        height: video.videoHeight,
        createdAt: new Date().toISOString(),
      });
      setStatus("captured");
    } catch {
      setStatus("unavailable");
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setStatus("streaming");
  };

  const usePhoto = () => {
    stopStream();
    if (capturedImage) {
      onCaptured(capturedImage);
    }
    onCancel();
  };

  const cancel = () => {
    stopStream();
    onCancel();
  };

  return (
    <div className="camera">
      {status === "requesting" && (
        <div className="state-box">
          <div className="spinner" aria-hidden="true" />
          <p>Waiting for camera permission…</p>
        </div>
      )}

      {(status === "streaming" || status === "captured") && (
        <>
          <div className="camera-viewport">
            {status === "streaming" ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Live camera preview"
              />
            ) : (
              <img
                src={capturedImage.dataUrl}
                alt="Captured space photo"
                role="img"
                aria-label="Captured space photo preview"
              />
            )}
          </div>

          {status === "streaming" ? (
            <div className="camera-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={capture}
              >
                Capture Photo
              </button>
            </div>
          ) : (
            <div className="camera-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={retake}
              >
                Retake
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={usePhoto}
              >
                Use This Photo
              </button>
            </div>
          )}
        </>
      )}

      {(status === "denied" || status === "unavailable") && (
        <div className="camera-error">
          <p className="error-msg">
            {status === "denied"
              ? CAMERA_DENIED_MESSAGE
              : CAMERA_UNAVAILABLE_MESSAGE}
          </p>
          <div className="camera-actions">
            {status === "denied" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={startCamera}
              >
                Try Camera Again
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancel}
            >
              Close Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;