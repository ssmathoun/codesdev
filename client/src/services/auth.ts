const API_URL = 'http://localhost:5001/api';

export const authService = {
  async register(userData: any) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    return response.json();
  },

  async login(credentials: any) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCookie('csrf_access_token') || '' // Required by Flask
      },
      credentials: 'include',
    });
    return response.json();
  }
};

// Helper to get CSRF token from cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}