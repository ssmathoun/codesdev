// This automatically chooses the right URL based on the environment
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || "http://localhost:5001";