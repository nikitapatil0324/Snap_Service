import axios from "axios";

const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:9090/api";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

let authToken = null;

export function setToken(token) {
  authToken = token;
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export async function login(credentials) {
  return api.post("/auth/login", credentials).then(r => r.data);
}

export async function getProviders() {
  const data = await api.get("/providers").then(r => r.data);
  // Handle both single object and array responses
  return Array.isArray(data) ? data : (data ? [data] : []);
}

export async function getUserBookings(userId) {
  // if backend uses authenticated user, userId may be optional
  return api.get(`/bookings${userId ? `?userId=${userId}` : ""}`).then(r => r.data);
}

export async function getProviderAssignments(providerId) {
  return api.get(`/bookings${providerId ? `?providerId=${providerId}` : ""}`).then(r => r.data);
}

export async function createBooking(booking) {
  // Map frontend field names to backend entity field names
  const payload = {
    ...booking,
    serviceName: booking.service || booking.serviceName,
    customerName: booking.customer || booking.customerName,
  };
  return api.post("/bookings", payload).then(r => r.data);
}

export async function assignProvider(bookingId, providerId) {
  return api.put(`/bookings/${bookingId}/assign`, { providerId }).then(r => r.data);
}

export async function updateBookingStatus(bookingId, status) {
  return api.put(`/bookings/${bookingId}/status`, { status }).then(r => r.data);
}

export async function register(userData) {
  return api.post("/users", userData).then(r => r.data);
}

export async function registerProvider(providerData) {
  // Correct the field name from 'city' to 'area' to match backend DTO
  const payload = {
    ...providerData,
    area: providerData.city || providerData.area
  };
  return api.post("/providers/register", payload).then(r => r.data);
}

export async function updateProvider(id, providerData) {
  return api.put(`/providers/${id}`, providerData).then(r => r.data);
}

export async function getUsers() {
  return api.get("/users").then(r => r.data);
}

export async function createService(serviceData) {
  const adminId = serviceData.admin_id || serviceData.adminId;
  console.log("createService called with:", serviceData);

  if (!adminId || adminId === "undefined") {
    console.error("Missing Admin ID in createService!");
    throw new Error("Admin ID is missing. Please log out and log in again.");
  }

  console.log("Admin ID from payload:", adminId);
  console.log("Sending POST request to: /services/" + adminId);
  const requestBody = {
    serviceName: serviceData.serviceName,
    description: serviceData.description,
    price: serviceData.price,
    areas: serviceData.areas
  };
  console.log("Request body:", JSON.stringify(requestBody, null, 2));
  try {
    const response = await api.post(`/services/${adminId}`, requestBody);
    console.log("Service creation response:", response);
    return response.data;
  } catch (error) {
    console.error("========== SERVICE CREATION ERROR ==========");
    console.error("Status:", error?.response?.status);
    console.error("Backend Error Message:", error?.response?.data?.message);
    console.error("Backend Error Description:", error?.response?.data?.description);
    console.error("Full Error Data:", JSON.stringify(error?.response?.data, null, 2));
    console.error("==========================================");
    throw error;
  }
}

export async function getServices() {
  return api.get("/services").then(r => r.data);
}

export async function updateService(id, serviceData) {
  return api.put(`/services/${id}`, serviceData).then(r => r.data);
}

export async function deleteService(id) {
  return api.delete(`/services/${id}`).then(r => r.data);
}

export async function getRecommendedProviders(bookingId) {
  return api.get(`/bookings/${bookingId}/recommended-providers`).then(r => r.data);
}

export async function getLocations() {
  return api.get("/locations").then(r => r.data);
}

export async function createLocation(locationData) {
  return api.post("/locations", locationData).then(r => r.data);
}

export async function deleteLocation(id) {
  return api.delete(`/locations/${id}`).then(r => r.data);
}

export async function addReview(reviewData) {
  return api.post("/review/add", reviewData).then(r => r.data);
}

export async function getReviewsByUser(userId) {
  return api.get(`/reviews/user/${userId}`).then(r => r.data);
}

export async function getProviderRating(providerId) {
  return api.get(`/reviews/provider/${providerId}/rating`).then(r => r.data);
}

export async function acceptBooking(bookingId, amount) {
  return api.put(`/bookings/${bookingId}/accept`, { amount }).then(r => r.data);
}

export async function getPayments() {
  return api.get("/payments").then(r => r.data);
}

export async function updateUser(id, userData) {
  return api.put(`/users/${id}`, userData).then(r => r.data);
}

export default api;
