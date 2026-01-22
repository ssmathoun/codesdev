const API_URL = 'http://localhost:5001/api';

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

export const projectService = {
  async getProjects() {
    const res = await fetch(`${API_URL}/projects`, { credentials: 'include' });
    return res.json();
  },

  async createProject(name: string) {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCookie('csrf_access_token') || '' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    });
    return res.json();
  },

  async updateProject(id: string, name: string) {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCookie('csrf_access_token') || '' },
      body: JSON.stringify({ name }),
      credentials: 'include',
    });
    return res.json();
  },

  async deleteProject(id: string) {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'X-CSRF-TOKEN': getCookie('csrf_access_token') || '' },
      credentials: 'include',
    });
    return res.json();
  }
};