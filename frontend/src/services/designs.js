import api from "./api";

// The /api/designs endpoints are live in the backend (see backend/src/designRoutes.js).
const DESIGNS_API_AVAILABLE = true;

export function isDesignsApiAvailable() {
  return DESIGNS_API_AVAILABLE;
}

// Requires the JWT (attached automatically via the shared axios instance).
// MUST NOT be called when the user is logged out.

// GET /api/designs?limit=N
export async function fetchRecentDesigns({ limit = 4 } = {}) {
  const res = await api.get("/designs", { params: { limit } });
  return res.data.designs;
}

// POST /api/designs/generate
// Payload uses the uploaded room image id (roomImage.id from the DesignContext).
export async function generateDesign({ roomImage, roomType, designStyle }) {
  const token = localStorage.getItem("token");
  const res = await api.post(
    "/designs/generate",
    { roomImage, roomType, designStyle },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data.design;
}

// GET /api/designs/:id/download
// Returns the generated image as a blob for the browser "save as" dialog.
export async function downloadDesign(id) {
  const res = await api.get(`/designs/${id}/download`, {
    responseType: "blob",
  });
  return res.data; // Blob
}

// GET /api/designs/:id
export async function fetchDesignById(id) {
  const res = await api.get(`/designs/${id}`);
  return res.data.design;
}


export async function deleteDesign(id) {
  const res = await api.delete(
    `/designs/${id}`
  );

  return res.data;
}