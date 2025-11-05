import { useState, useEffect } from 'react';
import { Activity, Thermometer, Droplets, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import { lecturaAmbientalService } from '../services/lecturaAmbientalService';
import { invernaderoService } from '../services/invernaderoService';

const MonitoreoTiempoReal = () => {
  const [invernaderos, setInvernaderos] = useState([]);
  const [lecturasActuales, setLecturasActuales] = useState({});
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    cargarDatos();

    if (autoRefresh) {
      const interval = setInterval(cargarDatos, 30000); // Actualizar cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const invsRes = await invernaderoService.getAll();
      setInvernaderos(invsRes.data);

      // Cargar lectura actual para cada invernadero
      const lecturas = {};
      for (const inv of invsRes.data) {
        try {
          const lecturaRes = await lecturaAmbientalService.getActual(inv.id);
          lecturas[inv.id] = lecturaRes.data;
        } catch (error) {
          console.error(`Error al cargar lectura del invernadero ${inv.id}:`, error);
        }
      }
      setLecturasActuales(lecturas);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarNuevaLectura = async (id_invernadero) => {
    try {
      await lecturaAmbientalService.create({ id_invernadero });
      cargarDatos();
    } catch (error) {
      console.error('Error al generar lectura:', error);
      alert('Error al generar nueva lectura');
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const getRangoOptimo = (tipo) => {
    if (tipo === 'temperatura') return '18-24°C';
    if (tipo === 'humedad') return '~80%';
    return '';
  };

  const getEstadoColor = (lectura, tipo) => {
    if (!lectura) return 'gray';
    if (tipo === 'temperatura' && lectura.alerta_temperatura) return 'red';
    if (tipo === 'humedad' && lectura.alerta_humedad) return 'red';
    return 'green';
  };

  if (loading && Object.keys(lecturasActuales).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando monitoreo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Monitoreo en Tiempo Real</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-actualizar (30s)
            </label>
            <button
              onClick={cargarDatos}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Info de Rangos Óptimos */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Rangos Óptimos para Orquídeas</h3>
          <div className="flex gap-6 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              <span>Temperatura: 18-24°C (noche-día)</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              <span>Humedad Relativa: ~80%</span>
            </div>
          </div>
        </div>

        {/* Tarjetas de Monitoreo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {invernaderos.map(inv => {
            const lectura = lecturasActuales[inv.id];
            const tempColor = getEstadoColor(lectura, 'temperatura');
            const humColor = getEstadoColor(lectura, 'humedad');

            return (
              <div key={inv.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{inv.nombre}</h3>
                    <p className="text-sm text-gray-600">{inv.ubicacion || 'Sin ubicación'}</p>
                  </div>
                  {lectura?.es_simulado && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Simulado
                    </span>
                  )}
                </div>

                {lectura ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Temperatura */}
                      <div className={`p-4 rounded-lg border-2 ${
                        tempColor === 'red' ? 'bg-red-50 border-red-200' :
                        tempColor === 'green' ? 'bg-green-50 border-green-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Thermometer className={`w-5 h-5 ${
                            tempColor === 'red' ? 'text-red-600' :
                            tempColor === 'green' ? 'text-green-600' :
                            'text-gray-600'
                          }`} />
                          {lectura.alerta_temperatura && (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {parseFloat(lectura.temperatura).toFixed(1)}°C
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Óptimo: {getRangoOptimo('temperatura')}
                        </div>
                      </div>

                      {/* Humedad */}
                      <div className={`p-4 rounded-lg border-2 ${
                        humColor === 'red' ? 'bg-red-50 border-red-200' :
                        humColor === 'green' ? 'bg-green-50 border-green-200' :
                        'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Droplets className={`w-5 h-5 ${
                            humColor === 'red' ? 'text-red-600' :
                            humColor === 'green' ? 'text-green-600' :
                            'text-gray-600'
                          }`} />
                          {lectura.alerta_humedad && (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                          {parseFloat(lectura.humedad).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Óptimo: {getRangoOptimo('humedad')}
                        </div>
                      </div>
                    </div>

                    {/* Alertas */}
                    {(lectura.alerta_temperatura || lectura.alerta_humedad) && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="text-sm text-red-800">
                            <strong>Condiciones fuera de rango:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {lectura.alerta_temperatura && (
                                <li>Temperatura fuera del rango óptimo (18-24°C)</li>
                              )}
                              {lectura.alerta_humedad && (
                                <li>Humedad fuera del rango óptimo (~80%)</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Última lectura: {formatFecha(lectura.fecha_hora)}</span>
                    </div>

                    <button
                      onClick={() => generarNuevaLectura(inv.id)}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded font-medium text-sm"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Generar Nueva Lectura Simulada
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No hay lecturas disponibles</p>
                    <button
                      onClick={() => generarNuevaLectura(inv.id)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded"
                    >
                      Generar Primera Lectura
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {invernaderos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay invernaderos configurados para monitorear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoreoTiempoReal;
