import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const getGuestEmiDetails = (travId) =>
  api.get(`/EMI/guest-details/${travId}`);
// POST save EMI plan
export const saveGuestEmiPlan = (payload) =>
  api.post("/EMI/save-guest-emi", payload);

export const getGuestEmiPlan = (travId) =>
  api.get(`/EMI/emi-plan/${travId}`);
