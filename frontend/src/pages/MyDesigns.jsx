import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Lightbox from "../components/Lightbox";

import {
  fetchRecentDesigns,
  downloadDesign,
  deleteDesign,
} from "../services/designs";

import {
  WIZARD_ROOM_TYPES,
  WIZARD_DESIGN_STYLES,
} from "../data/staticData";

import "./MyDesigns.css";

const roomLabel = (id) =>
  (WIZARD_ROOM_TYPES.find((r) => r.id === id) || {}).name;

const styleLabel = (id) =>
  (WIZARD_DESIGN_STYLES.find((s) => s.id === id) || {}).name;

const MyDesigns = () => {
  const { user, token } = useContext(AuthContext);

  const [designs, setDesigns] = useState([]);
  const [status, setStatus] = useState("idle");

  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState("");

  const load = async () => {
    if (!token) return;

    setStatus("loading");

    try {
      const data = await fetchRecentDesigns({
        limit: 50,
      });

      console.log("MY DESIGNS:", data);

      setDesigns(
        Array.isArray(data) ? data : []
      );

      setStatus("ready");
    } catch (err) {
      console.error(
        "MY DESIGNS LOAD ERROR:",
        err
      );

      setStatus("error");
    }
  };

  useEffect(() => {
    if (!token) return;

    load();
  }, [token]);

  // ============================================
  // OPEN IMAGE
  // ============================================

  const openImage = (imageUrl) => {
    if (!imageUrl) return;

    setLightboxSrc(imageUrl);
    setLightboxOpen(true);
  };

  const closeImage = () => {
    setLightboxOpen(false);
    setLightboxSrc("");
  };

  // ============================================
  // DOWNLOAD
  // ============================================

  const handleDownload = async (design) => {
    if (!design?._id || downloadingId) {
      return;
    }

    setDownloadingId(design._id);

    try {
      const blob = await downloadDesign(
        design._id
      );

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        `room-design-${design._id}.jpg`;

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error(
        "DOWNLOAD ERROR:",
        err
      );

      alert(
        "Unable to download this design right now."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // ============================================
  // DELETE CONFIRMATION
  // ============================================

  const askDelete = (design) => {
    setDeleteTarget(design);
  };

  const cancelDelete = () => {
    if (deletingId) return;

    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (
      !deleteTarget?._id ||
      deletingId
    ) {
      return;
    }

    const id = deleteTarget._id;

    setDeletingId(id);

    try {
      await deleteDesign(id);

      setDesigns((current) =>
        current.filter(
          (design) =>
            design._id !== id
        )
      );

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "DELETE DESIGN ERROR:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Unable to delete this design right now."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const isLoggedIn = Boolean(token);

  return (
    <>
      <section className="section my-designs-page">
        <div className="container">

          {/* HEADER */}

          <div className="myd-header">

            <div>
              <span className="myd-eyebrow">
                YOUR COLLECTION
              </span>

              <h2 className="section-title">
                My Designs
              </h2>

              <p className="section-subtitle">
                {user?.name
                  ? `${user.name}, `
                  : ""}
                your saved and generated
                space designs.
              </p>
            </div>

            <Link
              to="/design"
              className="btn btn-primary"
            >
              + New Design
            </Link>

          </div>

          {/* NOT LOGGED IN */}

          {!isLoggedIn ? (
            <div className="state-box">
              <p>
                Sign in to see your saved
                and generated space designs.
              </p>

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Login to View Your Designs
              </Link>
            </div>

          ) : status === "loading" ? (

            /* LOADING */

            <div className="state-box centered">
              <div
                className="spinner"
                aria-label="Loading designs"
              />

              <p>
                Loading your designs...
              </p>
            </div>

          ) : status === "error" ? (

            /* ERROR */

            <div className="state-box">
              <p>
                We couldn't load your
                designs right now.
              </p>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={load}
              >
                Try Again
              </button>
            </div>

          ) : designs.length === 0 ? (

            /* EMPTY */

            <div className="state-box myd-empty">

              <div className="myd-empty-icon">
                ✨
              </div>

              <h3>
                No designs yet
              </h3>

              <p>
                Create your first AI-powered
                room design and it will appear
                here.
              </p>

              <Link
                to="/design"
                className="btn btn-primary"
              >
                Start Designing
              </Link>

            </div>

          ) : (

            /* DESIGN GRID */

            <div className="designs-grid">

              {designs.map((design) => {

                const imageUrl =
                  design.generatedImage ||
                  design.imageUrl ||
                  design.image ||
                  "";

                const roomName =
                  roomLabel(
                    design.roomType
                  ) ||
                  design.roomType ||
                  "Room Design";

                const styleName =
                  styleLabel(
                    design.designStyle
                  ) ||
                  design.designStyle ||
                  "Custom Style";

                const isDeleting =
                  deletingId ===
                  design._id;

                const isDownloading =
                  downloadingId ===
                  design._id;

                return (
                  <article
                    className="myd-card"
                    key={design._id}
                  >

                    {/* IMAGE */}

                    <div
                      className="myd-image-wrap"
                      onClick={() =>
                        openImage(imageUrl)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === " "
                        ) {
                          e.preventDefault();
                          openImage(imageUrl);
                        }
                      }}
                      aria-label="Open design image"
                    >

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${roomName} in ${styleName} style`}
                          className="myd-image"
                        />
                      ) : (
                        <div className="myd-no-image">
                          <span>🖼️</span>

                          <p>
                            Image not available
                          </p>
                        </div>
                      )}

                      {imageUrl && (
                        <div className="myd-view-overlay">
                          🔍 View Full Image
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="myd-content">

                      <div className="myd-meta">
                        AI GENERATED
                      </div>

                      <h3>
                        {roomName}
                      </h3>

                      <p className="myd-style">
                        🎨 {styleName}
                      </p>

                      {design.createdAt && (
                        <p className="myd-date">
                          Created{" "}
                          {new Date(
                            design.createdAt
                          ).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="myd-actions">

                      <button
                        type="button"
                        className="myd-action-btn myd-download-btn"
                        onClick={() =>
                          handleDownload(
                            design
                          )
                        }
                        disabled={
                          isDownloading ||
                          isDeleting
                        }
                      >
                        {isDownloading
                          ? "Preparing..."
                          : "↓ Download"}
                      </button>

                      <button
                        type="button"
                        className="myd-action-btn myd-delete-btn"
                        onClick={() =>
                          askDelete(
                            design
                          )
                        }
                        disabled={
                          isDeleting ||
                          isDownloading
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* LIGHTBOX */}

      <Lightbox
        isOpen={lightboxOpen}
        src={lightboxSrc}
        onClose={closeImage}
      />

      {/* DELETE MODAL */}

      {deleteTarget && (
        <div
          className="delete-modal-overlay"
          onClick={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              cancelDelete();
            }
          }}
        >

          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >

            <div className="delete-icon">
              🗑️
            </div>

            <h3 id="delete-title">
              Delete this design?
            </h3>

            <p>
              This design will be permanently
              removed from your My Designs.
            </p>

            <div className="delete-modal-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDelete}
                disabled={
                  Boolean(deletingId)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={
                  Boolean(deletingId)
                }
              >
                {deletingId
                  ? "Deleting..."
                  : "Delete Design"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MyDesigns;
