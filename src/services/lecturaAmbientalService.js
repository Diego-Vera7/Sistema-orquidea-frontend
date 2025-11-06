import api from './api';

export const lecturaAmbientalService = {
  // Obtener todas las lecturas
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.id_invernadero) queryParams.append('id_invernadero', params.id_invernadero);
    if (params.desde) queryParams.append('desde', params.desde);
    if (params.hasta) queryParams.append('hasta', params.hasta);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.orden) queryParams.append('orden', params.orden);

    const url = `/lecturas-ambientales${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener lectura actual de un invernadero
  getActual: async (id_invernadero) => {
    const response = await api.get(`/lecturas-ambientales/actual/${id_invernadero}`);
    return response.data;
  },

  // ✅ NUEVO: Obtener últimas lecturas de todos los sensores de un invernadero
  getUltimasLecturasPorInvernadero: async (id_invernadero, limit = 10) => {
    try {
      const response = await api.get(`/lecturas-ambientales/invernadero/${id_invernadero}/ultimas?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener últimas lecturas:', error);
      throw error;
    }
  },

  // ✅ NUEVO: Obtener lecturas para gráficos (con rango de tiempo)
  getLecturasParaGrafico: async (id_invernadero, minutos = 30) => {
    try {
      const hasta = new Date();
      const desde = new Date(hasta.getTime() - minutos * 60000);
      
      const response = await api.get(`/lecturas-ambientales`, {
        params: {
          id_invernadero,
          desde: desde.toISOString(),
          hasta: hasta.toISOString(),
          limit: 100,
          orden: 'ASC'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener datos del gráfico:', error);
      throw error;
    }
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
