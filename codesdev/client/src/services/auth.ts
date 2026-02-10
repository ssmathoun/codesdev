import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

// Helper to get CSRF token from cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const authService = {
  async register (userData: any) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error("AuthService Register Error:", error);
      throw error;
    }
  },

  async login(credentials: any) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // Ensures the Set-Cookie header is processed
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || 'Login failed');
    return data; 
  },

  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCookie('csrf_access_token') || ''
      },
      credentials: 'include',
    });
    return response.json();
  }
};