import api from "./axios";

// List assets with filters + pagination
export const getAssets = (params) => api.get("/assets", { params });

// Get single asset
export const getAsset = (id) => api.get(`/assets/${id}`);
export const getAssetOptions = () => api.get("/meta/asset_options");

// Create asset (admin)
export const createAsset = (payload) => api.post("/assets", { asset: payload });

// Update asset (admin)
export const updateAsset = (id, payload) =>
  api.put(`/assets/${id}`, { asset: payload });

// Delete asset (admin)
export const deleteAsset = (id) => api.delete(`/assets/${id}`);

// Assign asset (admin)
export const assignAsset = (assetId, payload) =>
  api.post(`/assets/${assetId}/asset_assignments`, {
    asset_assignment: payload,
  });

// Unassign asset (admin)
export const unassignAsset = (assetId, assignmentId) =>
  api.patch(`/assets/${assetId}/asset_assignments/${assignmentId}/close`);

// Assignment history
export const getAssetHistory = (assetId) =>
  api.get(`/assets/${assetId}/asset_assignments`);