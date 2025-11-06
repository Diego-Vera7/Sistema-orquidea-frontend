import api from './api';

export const calendarioRiegoService = {
  // Obtener todos los calendarios
  getAll: async (id_invernadero = null) => {
    const url = id_invernadero
      ? `/calendario-riego?id_invernadero=${id_invernadero}`
      : '/calendario-riego';
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un calendario específico
  getById: async (id) => {
    const response = await api.get(`/calendario-riego/${id}`);
    return response.data;
  },

  // Obtener recordatorios de hoy
  getRecordatoriosHoy: async () => {
    const response = await api.get('/calendario-riego/recordatorios-hoy');
    return response.data;
  },

  // Crear nuevo calendario
  create: async (data) => {
    const response = await api.post('/calendario-riego', data);
    return response.data;
  },

  // Actualizar calendario
  update: async (id, data) => {
    const response = await api.put(`/calendario-riego/${id}`, data);
    return response.data;
  },

  // Activar/Desactivar calendario
  toggle: async (id) => {
    const response = await api.patch(`/calendario-riego/${id}/toggle`);
    return response.data;
  },

  // Eliminar calendario
  delete: async (id) => {
    const response = await api.delete(`/calendario-riego/${id}`);
    return response.data;
  }
};
