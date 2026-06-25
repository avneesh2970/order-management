// services/api.js
import axios from "axios";

export const IMG_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const BASE_URL = `${IMG_URL}/api`;

export const getAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${IMG_URL}/${path.replace(/^\//, "")}`;
};

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Admin Vendor Management
export const fetchAllVendors = () => API.get("/admin/all-vendors");
export const createVendor = (formData) => API.post("/admin/create-vendor", formData);
export const deleteVendor = (id) => API.delete(`/admin/${id}`);
export const updateVendor = (id, status) => API.patch(`/admin/status/${id}`, { status });
export const updateProfile = (formData) => API.put("/users/profile", formData);

export default API;
