import axios from "axios";

// Create an axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_ENVIRONMENT === "production" 
    // ? "https://job-portal-backend-ly0x.onrender.com" 
    
    ? "https://job-portal-alpha-lovat.vercel.app/" 
    : "http://localhost:8000",
  withCredentials: true,
});





