// services/api.js
import axios from "axios";

export const IMG_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "https://order-management-backend-uqtn.onrender.com"; 

const BASE_URL = `${IMG_URL}/api`;

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