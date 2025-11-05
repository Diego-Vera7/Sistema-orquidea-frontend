import api from './api';

export const lecturaAmbientalService = {
  // Obtener todas las lecturas
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.id_invernadero) queryParams.append('id_invernadero', params.id_invernadero);
    if (params.desde) queryParams.append('desde', params.desde);
    if (params.hasta) queryParams.append('hasta', params.hasta);
    if (params.limit) queryParams.append('limit', params.limit);

    const url = `/lecturas-ambientales${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener lectura actual de un invernadero
  getActual: async (id_invernadero) => {
    const response = await api.get(`/lecturas-ambientales/actual/${id_invernadero}`);
    return response.data;
  },

  // Obtener estadísticas
  getEstadisticas: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.id_invernadero) queryParams.append('id_invernadero', params.id_invernadero);
    if (params.desde) queryParams.append('desde', params.desde);
    if (params.hasta) queryParams.append('hasta', params.hasta);

    const url = `/lecturas-ambientales/estadisticas${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Crear nueva lectura
  create: async (data) => {
    const response = await api.post('/lecturas-ambientales', data);
    return response.data;
  },

  // Generar lecturas simuladas
  generarSimuladas: async (id_invernadero, cantidad = 24, frecuencia_horas = 1) => {
    const response = await api.post('/lecturas-ambientales/simular', {
      id_invernadero,
      cantidad,
      frecuencia_horas
    });
    return response.data;
  }
};
