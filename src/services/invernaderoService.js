import api from './api';

export const invernaderoService = {
  // Obtener todos los invernaderos
  getAll: async () => {
    const response = await api.get('/invernaderos');
    return response.data;
  },

  // Obtener un invernadero específico
  getById: async (id) => {
    const response = await api.get(`/invernaderos/${id}`);
    return response.data;
  },

  // Crear nuevo invernadero
  create: async (data) => {
    const response = await api.post('/invernaderos', data);
    return response.data;
  },

  // Actualizar invernadero
  update: async (id, data) => {
    const response = await api.put(`/invernaderos/${id}`, data);
    return response.data;
  },

  // Eliminar invernadero
  delete: async (id) => {
    const response = await api.delete(`/invernaderos/${id}`);
    return response.data;
  }
};
