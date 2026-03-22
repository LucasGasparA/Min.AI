const API_URL = 'http://localhost:4000/api'; // Backend na porta 4000!

export const api = {
  get: async (path) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('❌ Backend não está respondendo. Verifique se o servidor está rodando em http://localhost:3000');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro na API (GET):', error.message);
      throw error;
    }
  },

  post: async (path, body) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('❌ Backend não está respondendo. Verifique se o servidor está rodando em http://localhost:3000');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro na API (POST):', error.message);
      throw error;
    }
  },

  put: async (path, body) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('❌ Backend não está respondindo. Verifique se o servidor está rodando em http://localhost:3000');
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro na API (PUT):', error.message);
      throw error;
    }
  }
};