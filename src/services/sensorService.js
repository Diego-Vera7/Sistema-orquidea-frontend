import api from './api';

export const sensorService = {
  getAll: (params) => api.get('/sensores', { params }),
  getById: (id) => api.get(`/sensores/${id}`),
  getEstadisticas: () => api.get('/sensores/estadisticas'),
  crear: (data) => api.post('/sensores', data),
  actualizar: (id, data) => api.put(`/sensores/${id}`, data),
  calibrar: (id) => api.patch(`/sensores/${id}/calibrar`),
  cambiarEstado: (id, estado) => api.patch(`/sensores/${id}/estado`, { estado }),
  eliminar: (id) => api.delete(`/sensores/${id}`)
};
