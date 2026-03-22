const API_URL = 'http://localhost:3000/api';

export const api = {
  get: async (path) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error((await res.json())?.error || 'Erro na requisição');
    return res.json();
  },
  post: async (path, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error((await res.json())?.error || 'Erro na requisição');
    return res.json();
  },
  put: async (path, body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error((await res.json())?.error || 'Erro na requisição');
    return res.json();
  }
};
