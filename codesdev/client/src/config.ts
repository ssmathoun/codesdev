// This automatically chooses the right URL based on the environment
export const API_BASE_URL: string = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");