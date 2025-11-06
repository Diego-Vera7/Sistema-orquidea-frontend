import { useState, useEffect, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { lecturaAmbientalService } from '../services/lecturaAmbientalService';
import { 
  ArrowPathIcon, 
  PauseIcon, 
  PlayIcon,
  SignalIcon,
  SignalSlashIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonitoreoTiempoReal = () => {
  const [invernaderoId] = useState(1); // Por defecto invernadero 1
  const [datosActuales, setDatosActuales] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [datosGrafico, setDatosGrafico] = useState([]);
  const [conectado, setConectado] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [frecuenciaActualizacion, setFrecuenciaActualizacion] = useState(5000); // 5 segundos
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const intervaloRef = useRef(null);

  // Obtener datos actuales
  const obtenerDatosActuales = async () => {
    try {
      const response = await lecturaAmbientalService.getActual(invernaderoId);
      if (response.success && response.data) {
        setDatosActuales(response.data);
        setConectado(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error al obtener datos actuales:', err);
      setConectado(false);
      setError('Error de conexión');
    }
  };

  // Obtener lecturas de sensores
  const obtenerLecturasSensores = async () => {
    try {
      const response = await lecturaAmbientalService.getUltimasLecturasPorInvernadero(invernaderoId, 10);
      if (response.success) {
        setSensores(response.data);
      }
    } catch (err) {
      console.error('Error al obtener lecturas de sensores:', err);
    }
  };

  // Obtener datos para gráficos
  const obtenerDatosGrafico = async () => {
    try {
      const response = await lecturaAmbientalService.getLecturasParaGrafico(invernaderoId, 30);
      if (response.success && response.data) {
        setDatosGrafico(response.data);
      }
    } catch (err) {
      console.error('Error al obtener datos del gráfico:', err);
    }
  };

  // Actualizar todos los datos
  const actualizarDatos = async () => {
    if (pausado) return;
    
    await Promise.all([
      obtenerDatosActuales(),
      obtenerLecturasSensores(),
      obtenerDatosGrafico()
    ]);
    
    setUltimaActualizacion(new Date());
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setCargando(true);
      await actualizarDatos();
      setCargando(false);
    };

    cargarDatosIniciales();
  }, [invernaderoId]);

  // Efecto para actualización automática
  useEffect(() => {
    if (pausado) {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
      return;
    }

    intervaloRef.current = setInterval(() => {
      actualizarDatos();
    }, frecuenciaActualizacion);

    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, [pausado, frecuenciaActualizacion, invernaderoId]);

  // Toggle pausa
  const togglePausa = () => {
    setPausado(!pausado);
  };

  // Refrescar manualmente
  const refrescarManual = () => {
    actualizarDatos();
  };

  // Preparar datos para el gráfico
  const prepararDatosGrafico = () => {
    if (!datosGrafico || datosGrafico.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = datosGrafico.map(lectura => {
      const fecha = new Date(lectura.fecha_hora);
      return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: datosGrafico.map(l => parseFloat(l.temperatura)),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          yAxisID: 'y',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Humedad (%)',
          data: datosGrafico.map(l => parseFloat(l.humedad)),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y1',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const opcionesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Condiciones Ambientales - Últimos 30 minutos'
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperatura (°C)'
        },
        min: 15,
        max: 30
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humedad (%)'
        },
        min: 60,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    }
  };

  // Determinar el estado de una métrica
  const getEstadoMetrica = (valor, min, max) => {
    if (valor < min) return 'bajo';
    if (valor > max) return 'alto';
    return 'normal';
  };

  const temperatura = datosActuales ? parseFloat(datosActuales.temperatura) : 0;
  const humedad = datosActuales ? parseFloat(datosActuales.humedad) : 0;
  const estadoTemp = getEstadoMetrica(temperatura, 18, 24);
  const estadoHum = getEstadoMetrica(humedad, 75, 85);

  if (cargando) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando datos del monitoreo...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-blue-600" />
                Monitoreo en Tiempo Real
              </h1>
              <p className="text-gray-600 mt-1">
                Invernadero {invernaderoId} - Condiciones actuales de orquídeas
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Estado de conexión */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                conectado ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {conectado ? (
                  <>
                    <SignalIcon className="w-5 h-5" />
                    <span className="font-medium">Conectado</span>
                  </>
                ) : (
                  <>
                    <SignalSlashIcon className="w-5 h-5" />
                    <span className="font-medium">Desconectado</span>
                  </>
                )}
              </div>

              {/* Frecuencia de actualización */}
              <select
                value={frecuenciaActualizacion}
                onChange={(e) => setFrecuenciaActualizacion(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3000}>3 segundos</option>
                <option value={5000}>5 segundos</option>
                <option value={10000}>10 segundos</option>
                <option value={30000}>30 segundos</option>
              </select>

              {/* Botón pausar/reanudar */}
              <button
                onClick={togglePausa}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  pausado
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {pausado ? (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    <span>Reanudar</span>
                  </>
                ) : (
                  <>
                    <PauseIcon className="w-5 h-5" />
                    <span>Pausar</span>
                  </>
                )}
              </button>

              {/* Botón refrescar */}
              <button
                onClick={refrescarManual}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Refrescar</span>
              </button>
            </div>
          </div>

          {/* Última actualización */}
          {ultimaActualizacion && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="w-4 h-4" />
              <span>
                Última actualización: {ultimaActualizacion.toLocaleTimeString('es-ES')}
              </span>
            </div>
          )}
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Temperatura */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            estadoTemp === 'normal' ? 'border-green-500' :
            estadoTemp === 'bajo' ? 'border-blue-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Temperatura</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                estadoTemp === 'normal' ? 'bg-green-100 text-green-800' :
                estadoTemp === 'bajo' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
              }`}>
                {estadoTemp === 'normal' ? '✓ Óptima' :
                 estadoTemp === 'bajo' ? '↓ Baja' : '↑ Alta'}
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {temperatura.toFixed(1)}°C
            </div>
            <div className="text-sm text-gray-500">
              Rango óptimo: 18°C - 24°C
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  estadoTemp === 'normal' ? 'bg-green-500' :
                  estadoTemp === 'bajo' ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(Math.max((temperatura / 30) * 100, 0), 100)}%`
                }}
              />
            </div>
          </div>

          {/* Humedad */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            estadoHum === 'normal' ? 'border-green-500' :
            estadoHum === 'bajo' ? 'border-orange-500' : 'border-red-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Humedad</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                estadoHum === 'normal' ? 'bg-green-100 text-green-800' :
                estadoHum === 'bajo' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
              }`}>
                {estadoHum === 'normal' ? '✓ Óptima' :
                 estadoHum === 'bajo' ? '↓ Baja' : '↑ Alta'}
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {humedad.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              Rango óptimo: 75% - 85%
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  estadoHum === 'normal' ? 'bg-green-500' :
                  estadoHum === 'bajo' ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(humedad, 100)}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Tendencias Ambientales
          </h3>
          <div className="h-80">
            <Line data={prepararDatosGrafico()} options={opcionesGrafico} />
          </div>
        </div>

        {/* Estado de sensores */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Estado de Sensores
          </h3>
          {sensores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay sensores activos en este invernadero
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sensor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Humedad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Lectura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sensores.map((sensor, index) => {
                    const ultimaLectura = sensor.ultima_lectura;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {sensor.sensor.codigo_sensor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {sensor.sensor.ubicacion_especifica || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ultimaLectura ? (
                            <div className="text-sm text-gray-900">
                              {parseFloat(ultimaLectura.temperatura).toFixed(1)}°C
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ultimaLectura ? (
                            <div className="text-sm text-gray-900">
                              {parseFloat(ultimaLectura.humedad).toFixed(1)}%
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ultimaLectura ? (
                            <div className="text-sm text-gray-500">
                              {new Date(ultimaLectura.fecha_hora).toLocaleTimeString('es-ES')}
                            </div>
                          ) : (
                            <span className="text-gray-400">Sin datos</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ultimaLectura ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              !ultimaLectura.alerta_temperatura && !ultimaLectura.alerta_humedad
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {!ultimaLectura.alerta_temperatura && !ultimaLectura.alerta_humedad ? 'Normal' : 'Alerta'}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Sin datos
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MonitoreoTiempoReal;
