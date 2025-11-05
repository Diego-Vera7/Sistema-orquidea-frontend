import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Droplets, Thermometer, Info } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { notificacionService } from '../services/notificacionService';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'noLeidas', 'leidas'

  useEffect(() => {
    cargarDatos();
  }, [filtro]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filtro === 'noLeidas') params.leida = false;
      if (filtro === 'leidas') params.leida = true;

      const [notifsRes, statsRes] = await Promise.all([
        notificacionService.getAll(params),
        notificacionService.getEstadisticas()
      ]);

      setNotificaciones(notifsRes.data.data || []);
      setEstadisticas(statsRes.data.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarLeida = async (id) => {
    try {
      await notificacionService.marcarLeida(id);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await notificacionService.marcarTodasLeidas();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta notificación?')) return;
    try {
      await notificacionService.eliminar(id);
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getIcono = (tipo) => {
    switch (tipo) {
      case 'riego':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'alerta_temperatura':
        return <Thermometer className="w-5 h-5 text-red-600" />;
      case 'alerta_humedad':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'sistema':
        return <Info className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-primary-600" />;
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          </div>
          {estadisticas && estadisticas.noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">No Leídas</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.noLeidas}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Leídas</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.leidas}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'todas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltro('noLeidas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'noLeidas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No Leídas
            </button>
            <button
              onClick={() => setFiltro('leidas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtro === 'leidas'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Leídas
            </button>
          </div>
        </div>

        {/* Lista de Notificaciones */}
        <div className="space-y-3">
          {notificaciones.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay notificaciones</p>
            </div>
          ) : (
            notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-lg shadow-md p-4 ${
                  !notif.leida ? 'border-l-4 border-primary-600' : 'border-l-4 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getIcono(notif.tipo)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notif.titulo}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPrioridadColor(notif.prioridad)}`}>
                          {notif.prioridad}
                        </span>
                        {!notif.leida && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                            Nueva
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.mensaje}</p>
                      {notif.invernadero && (
                        <p className="text-xs text-gray-500">
                          Invernadero: {notif.invernadero.nombre}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{formatFecha(notif.fecha_creacion)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!notif.leida && (
                      <button
                        onClick={() => marcarLeida(notif.id)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Marcar como leída"
                      >
                        <Check className="w-5 h-5 text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => eliminar(notif.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Notificaciones;