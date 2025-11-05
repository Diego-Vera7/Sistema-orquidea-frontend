import api from './api';

export const notificacionService = {
  getAll: (params) => api.get('/notificaciones', { params }),
  getEstadisticas: () => api.get('/notificaciones/estadisticas'),
  marcarLeida: (id) => api.patch(`/notificaciones/${id}/leida`),
  marcarTodasLeidas: () => api.patch('/notificaciones/marcar-todas-leidas'),
  eliminar: (id) => api.delete(`/notificaciones/${id}`),
  crear: (data) => api.post('/notificaciones', data)
};
