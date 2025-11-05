import { useState, useEffect } from 'react';
import { Activity, Plus, Thermometer, Droplets, Settings, Trash2, RefreshCw, Edit } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { sensorService } from '../services/sensorService';
import { invernaderoService } from '../services/invernaderoService';

const Sensores = () => {
  const [sensores, setSensores] = useState([]);
  const [invernaderos, setInvernaderos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtroInvernadero, setFiltroInvernadero] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editandoSensor, setEditandoSensor] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'combinado',
    id_invernadero: '',
    estado: 'activo',
    ubicacion: '',
    temperatura_min: 18.00,
    temperatura_max: 24.00,
    humedad_min: 75.00,
    humedad_max: 85.00
  });

  useEffect(() => {
    cargarDatos();
  }, [filtroInvernadero, filtroEstado]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filtroInvernadero) params.id_invernadero = filtroInvernadero;
      if (filtroEstado) params.estado = filtroEstado;

      const [sensoresRes, invernaderoRes, statsRes] = await Promise.all([
        sensorService.getAll(params),
        invernaderoService.getAll(),
        sensorService.getEstadisticas()
      ]);

      console.log('Respuesta invernaderos:', invernaderoRes);

      setSensores(sensoresRes.data);
      setInvernaderos(invernaderoRes.data || invernaderoRes || []);
      setEstadisticas(statsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (sensor = null) => {
    if (sensor) {
      setEditandoSensor(sensor);
      setFormData({
        nombre: sensor.nombre,
        tipo: sensor.tipo,
        id_invernadero: sensor.id_invernadero,
        estado: sensor.estado,
        ubicacion: sensor.ubicacion || '',
        temperatura_min: sensor.temperatura_min || 18.00,
        temperatura_max: sensor.temperatura_max || 24.00,
        humedad_min: sensor.humedad_min || 75.00,
        humedad_max: sensor.humedad_max || 85.00
      });
    } else {
      setEditandoSensor(null);
      setFormData({
        nombre: '',
        tipo: 'combinado',
        id_invernadero: invernaderos.length > 0 ? invernaderos[0].id : '',
        estado: 'activo',
        ubicacion: '',
        temperatura_min: 18.00,
        temperatura_max: 24.00,
        humedad_min: 75.00,
        humedad_max: 85.00
      });
    }
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setEditandoSensor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoSensor) {
        await sensorService.actualizar(editandoSensor.id, formData);
      } else {
        await sensorService.crear(formData);
      }
      cerrarModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar sensor:', error);
      alert('Error al guardar sensor');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este sensor?')) return;

    try {
      await sensorService.eliminar(id);
      cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar sensor');
    }
  };

  const handleCalibrar = async (id) => {
    if (!window.confirm('¿Desea calibrar este sensor?')) return;

    try {
      await sensorService.calibrar(id);
      alert('Sensor calibrado correctamente');
      cargarDatos();
    } catch (error) {
      console.error('Error al calibrar:', error);
      alert('Error al calibrar sensor');
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await sensorService.cambiarEstado(id, nuevoEstado);
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado');
    }
  };

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case 'temperatura':
        return <Thermometer className="w-5 h-5 text-red-600" />;
      case 'humedad':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'combinado':
        return (
          <div className="flex gap-1">
            <Thermometer className="w-4 h-4 text-red-600" />
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
        );
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBadgeEstado = (estado) => {
    const estilos = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      mantenimiento: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded ${estilos[estado]}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Sensores</h1>
          </div>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Nuevo Sensor
          </button>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sensores</p>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                </div>
                <Activity className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.porEstado.activo || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactivos</p>
                  <p className="text-2xl font-bold text-gray-600">{estadisticas.porEstado.inactivo || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Mantenimiento</p>
                  <p className="text-2xl font-bold text-yellow-600">{estadisticas.porEstado.mantenimiento || 0}</p>
                </div>
                <Settings className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invernadero</label>
              <select
                value={filtroInvernadero}
                onChange={(e) => setFiltroInvernadero(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos los invernaderos</option>
                {invernaderos.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Sensores */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : sensores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {sensores.map(sensor => (
                <div key={sensor.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getIconoTipo(sensor.tipo)}
                      <h3 className="font-semibold text-gray-900">{sensor.nombre}</h3>
                    </div>
                    {getBadgeEstado(sensor.estado)}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Invernadero:</strong> {sensor.invernadero?.nombre || 'N/A'}</p>
                    <p><strong>Tipo:</strong> {sensor.tipo}</p>
                    {sensor.ubicacion && <p><strong>Ubicación:</strong> {sensor.ubicacion}</p>}

                    {(sensor.tipo === 'temperatura' || sensor.tipo === 'combinado') && (
                      <p><strong>Temp:</strong> {sensor.temperatura_min}°C - {sensor.temperatura_max}°C</p>
                    )}

                    {(sensor.tipo === 'humedad' || sensor.tipo === 'combinado') && (
                      <p><strong>Humedad:</strong> {sensor.humedad_min}% - {sensor.humedad_max}%</p>
                    )}

                    {sensor.ultima_calibracion && (
                      <p className="text-xs">
                        <strong>Última calibración:</strong>{' '}
                        {new Date(sensor.ultima_calibracion).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCalibrar(sensor.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm"
                      title="Calibrar sensor"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Calibrar
                    </button>

                    <button
                      onClick={() => abrirModal(sensor)}
                      className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded"
                      title="Editar sensor"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEliminar(sensor.id)}
                      className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded"
                      title="Eliminar sensor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <label className="block text-xs text-gray-600 mb-1">Cambiar estado:</label>
                    <select
                      value={sensor.estado}
                      onChange={(e) => handleCambiarEstado(sensor.id, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay sensores disponibles
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar Sensor */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editandoSensor ? 'Editar Sensor' : 'Nuevo Sensor'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo *</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="temperatura">Temperatura</option>
                      <option value="humedad">Humedad</option>
                      <option value="combinado">Combinado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Invernadero *</label>
                    <select
                      value={formData.id_invernadero}
                      onChange={(e) => setFormData({ ...formData, id_invernadero: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      {!formData.id_invernadero && <option value="">Seleccione un invernadero</option>}
                      {invernaderos.map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Estado *</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      <option value="error">Error</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Ej: Zona Central"
                    />
                  </div>
                </div>

                {(formData.tipo === 'temperatura' || formData.tipo === 'combinado') && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-red-700">Umbrales de Temperatura</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Temp. Mínima (°C)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.temperatura_min}
                          onChange={(e) => setFormData({ ...formData, temperatura_min: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Temp. Máxima (°C)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.temperatura_max}
                          onChange={(e) => setFormData({ ...formData, temperatura_max: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(formData.tipo === 'humedad' || formData.tipo === 'combinado') && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-blue-700">Umbrales de Humedad</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Humedad Mínima (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.humedad_min}
                          onChange={(e) => setFormData({ ...formData, humedad_min: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Humedad Máxima (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.humedad_max}
                          onChange={(e) => setFormData({ ...formData, humedad_max: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                  >
                    {editandoSensor ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={cerrarModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Sensores;
