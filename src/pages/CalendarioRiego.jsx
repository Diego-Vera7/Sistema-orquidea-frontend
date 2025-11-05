import { useState, useEffect } from 'react';
import { Calendar, Clock, Droplets, Plus, Edit2, Trash2, Power, Bell } from 'lucide-react';
import { calendarioRiegoService } from '../services/calendarioRiegoService';
import { invernaderoService } from '../services/invernaderoService';

const CalendarioRiego = () => {
  const [calendarios, setCalendarios] = useState([]);
  const [invernaderos, setInvernaderos] = useState([]);
  const [recordatorios, setRecordatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_invernadero: '',
    nombre_calendario: '',
    dias_semana: [],
    hora_riego: '',
    duracion_minutos: 15,
    cantidad_agua_litros: '',
    notas: ''
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [calsRes, invsRes, recsRes] = await Promise.all([
        calendarioRiegoService.getAll(),
        invernaderoService.getAll(),
        calendarioRiegoService.getRecordatoriosHoy()
      ]);

      setCalendarios(calsRes.data);
      setInvernaderos(invsRes.data);
      setRecordatorios(recsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(dia)
        ? prev.dias_semana.filter(d => d !== dia)
        : [...prev.dias_semana, dia]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_invernadero || formData.dias_semana.length === 0 || !formData.hora_riego) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        dias_semana: formData.dias_semana.join(',')
      };

      await calendarioRiegoService.create(dataToSend);
      alert('Calendario creado exitosamente');
      setShowModal(false);
      cargarDatos();
      resetForm();
    } catch (error) {
      console.error('Error al crear calendario:', error);
      alert('Error al crear el calendario');
    }
  };

  const handleToggleCalendario = async (id) => {
    try {
      await calendarioRiegoService.toggle(id);
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar estado del calendario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este calendario?')) {
      try {
        await calendarioRiegoService.delete(id);
        alert('Calendario eliminado');
        cargarDatos();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el calendario');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_invernadero: '',
      nombre_calendario: '',
      dias_semana: [],
      hora_riego: '',
      duracion_minutos: 15,
      cantidad_agua_litros: '',
      notas: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
            <Calendar className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Calendario de Riego</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Calendario
          </button>
        </div>

        {/* Recordatorios de Hoy */}
        {recordatorios.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <Bell className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-yellow-800">Recordatorios de Hoy ({recordatorios[0].dia})</h3>
                <ul className="mt-2 space-y-1">
                  {recordatorios.map(rec => (
                    <li key={rec.id} className="text-yellow-700">
                      {rec.hora_riego} - {rec.invernadero?.nombre} ({rec.nombre_calendario || 'Sin nombre'})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Calendarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calendarios.map(cal => (
            <div key={cal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {cal.nombre_calendario || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {cal.invernadero?.nombre}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cal.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {cal.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{cal.hora_riego}</span>
                  <span className="text-sm text-gray-500">({cal.duracion_minutos} min)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{cal.dias_semana}</span>
                </div>

                {cal.cantidad_agua_litros && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">{cal.cantidad_agua_litros}L</span>
                  </div>
                )}

                {cal.notas && (
                  <p className="text-sm text-gray-600 italic mt-2">{cal.notas}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => handleToggleCalendario(cal.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium ${
                    cal.activo
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {cal.activo ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(cal.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {calendarios.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay calendarios de riego configurados</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Crear el primero
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Nuevo Calendario de Riego</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invernadero *</label>
                  <select
                    value={formData.id_invernadero}
                    onChange={(e) => setFormData({ ...formData, id_invernadero: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Seleccionar invernadero</option>
                    {invernaderos.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Calendario</label>
                  <input
                    type="text"
                    value={formData.nombre_calendario}
                    onChange={(e) => setFormData({ ...formData, nombre_calendario: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ej: Riego Matutino"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Días de la Semana *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {diasSemana.map(dia => (
                      <button
                        key={dia}
                        type="button"
                        onClick={() => handleToggleDia(dia)}
                        className={`px-3 py-2 rounded text-sm font-medium ${
                          formData.dias_semana.includes(dia)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {dia.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hora de Riego *</label>
                    <input
                      type="time"
                      value={formData.hora_riego}
                      onChange={(e) => setFormData({ ...formData, hora_riego: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Duración (min)</label>
                    <input
                      type="number"
                      value={formData.duracion_minutos}
                      onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad de Agua (litros)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cantidad_agua_litros}
                    onChange={(e) => setFormData({ ...formData, cantidad_agua_litros: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ej: 50.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notas</label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    placeholder="Observaciones adicionales..."
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg font-medium"
                  >
                    Guardar Calendario
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarioRiego;
