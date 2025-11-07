import { useState, useEffect } from 'react';
import { Plus, Clock, Droplets, Calendar, X, MapPin, Timer, AlertCircle, Edit2, Trash2, Save } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import api from '../services/api';

const CalendarioRiego = () => {
  const [riegos, setRiegos] = useState([]);
  const [invernaderos, setInvernaderos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [modoCreacion, setModoCreacion] = useState(false);
  const [selectedRiego, setSelectedRiego] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({}); // ✅ NUEVO
  
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
  const diasOptions = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  // ✅ MEJORADO: Generar opciones de hora permitidas
  const generarHorasPermitidas = () => {
    const horas = [];
    for (let h = 7; h <= 19; h++) {
      for (let m = 0; m < 60; m += 15) { // Intervalos de 15 minutos
        const hora = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        horas.push(hora);
      }
    }
    return horas;
  };

  const horasPermitidas = generarHorasPermitidas();

  const estilosScrollbar = `
    .scrollbar-thin::-webkit-scrollbar {
      height: 8px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #a7f3d0;
      border-radius: 4px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #6ee7b7;
    }
  `;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [riegosRes, invernaderosRes] = await Promise.all([
        api.get('/calendario-riego'),
        api.get('/invernaderos')
      ]);
      setRiegos(riegosRes.data.data || riegosRes.data || []);
      setInvernaderos(invernaderosRes.data.data || invernaderosRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const procesarDias = (diasString) => {
    if (!diasString) return [];
    return diasString.split(',').map(d => d.trim());
  };

  const getColorClase = (index) => {
    const colores = [
      'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
      'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
      'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
      'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
    ];
    return colores[index % colores.length];
  };

  const mapearDiaAColumna = (dia) => {
    const mapeo = {
      'lunes': 0, 'martes': 1, 'miercoles': 2, 'jueves': 3,
      'viernes': 4, 'sabado': 5, 'domingo': 6
    };
    return mapeo[dia.toLowerCase()] ?? -1;
  };

  // ✅ NUEVA FUNCIÓN: Validar horario permitido
  const validarHorario = (hora) => {
    if (!hora) return false;
    
    const [hours, minutes] = hora.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // 7:00 AM = 420 minutos, 7:00 PM = 1140 minutos
    const MIN_HORA = 7 * 60; // 07:00
    const MAX_HORA = 19 * 60; // 19:00
    
    return totalMinutes >= MIN_HORA && totalMinutes <= MAX_HORA;
  };

  // ✅ NUEVA FUNCIÓN: Validar todo el formulario
  const validarFormulario = () => {
    const errores = {};

    if (!formData.id_invernadero) {
      errores.id_invernadero = 'Selecciona un invernadero';
    }

    if (!formData.nombre_calendario || formData.nombre_calendario.trim().length < 3) {
      errores.nombre_calendario = 'El nombre debe tener al menos 3 caracteres';
    }

    if (formData.dias_semana.length === 0) {
      errores.dias_semana = 'Selecciona al menos un día';
    }

    if (!formData.hora_riego) {
      errores.hora_riego = 'La hora es requerida';
    } else if (!validarHorario(formData.hora_riego)) {
      errores.hora_riego = 'La hora debe estar entre 07:00 y 19:00';
    }

    if (!formData.duracion_minutos || formData.duracion_minutos < 1 || formData.duracion_minutos > 120) {
      errores.duracion_minutos = 'La duración debe ser entre 1 y 120 minutos';
    }

    // ✅ NUEVA VALIDACIÓN: Cantidad de agua
    if (!formData.cantidad_agua_litros || formData.cantidad_agua_litros === '' || parseFloat(formData.cantidad_agua_litros) <= 0) {
      errores.cantidad_agua_litros = 'La cantidad de agua es requerida y debe ser mayor a 0';
    } else if (parseFloat(formData.cantidad_agua_litros) > 1000) {
      errores.cantidad_agua_litros = 'La cantidad de agua no puede superar los 1000 litros';
    }

    setValidationErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleNuevoRiego = () => {
    setModoCreacion(true);
    setModoEdicion(false);
    setSelectedRiego(null);
    setValidationErrors({}); // ✅ Limpiar errores
    setFormData({
      id_invernadero: '',
      nombre_calendario: '',
      dias_semana: [],
      hora_riego: '',
      duracion_minutos: 15,
      cantidad_agua_litros: '',
      notas: ''
    });
    setShowModal(true);
  };

  const handleVerDetalle = (riego) => {
    setSelectedRiego(riego);
    setModoCreacion(false);
    setModoEdicion(false);
    setValidationErrors({});
    setShowModal(true);
  };

  const handleEditarRiego = (riego) => {
    setModoEdicion(true);
    setModoCreacion(false);
    setSelectedRiego(riego);
    setValidationErrors({});
    setFormData({
      id_invernadero: riego.id_invernadero,
      nombre_calendario: riego.nombre_calendario,
      dias_semana: procesarDias(riego.dias_semana),
      hora_riego: riego.hora_riego.substring(0, 5),
      duracion_minutos: riego.duracion_minutos,
      cantidad_agua_litros: riego.cantidad_agua_litros,
      notas: riego.notas || ''
    });
    setShowModal(true);
  };

  const handleEliminarRiego = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este riego?')) return;

    try {
      await api.delete(`/riegos/${id}`);
      setShowModal(false);
      await cargarDatos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el riego');
    }
  };

  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(dia)
        ? prev.dias_semana.filter(d => d !== dia)
        : [...prev.dias_semana, dia]
    }));
    // Limpiar error de días
    setValidationErrors(prev => ({ ...prev, dias_semana: '' }));
  };

  // ✅ ACTUALIZADO: Manejar cambios con limpieza de errores
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar el error específico del campo
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validar formulario completo
    if (!validarFormulario()) {
      // Scroll al primer error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        dias_semana: formData.dias_semana.join(','),
        hora_riego: formData.hora_riego + ':00'
      };

      if (modoEdicion) {
        await api.put(`/riegos/${selectedRiego.id}`, dataToSend);
      } else {
        await api.post('/riegos', dataToSend);
      }

      setShowModal(false);
      setValidationErrors({});
      await cargarDatos();

    } catch (error) {
      console.error('Error al guardar:', error);
      
      // ✅ Mostrar error del servidor en un alert más visible
      const errorMessage = error.response?.data?.message || 'Error al guardar el riego';
      
      // Crear un error visual en el modal
      setValidationErrors(prev => ({
        ...prev,
        _server: errorMessage
      }));
      
      // También mostrar alert
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 font-medium">Cargando calendario...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{estilosScrollbar}</style>
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calendario de Riego</h1>
            <p className="text-gray-600 text-sm mt-1">Gestiona los horarios de riego de tus invernaderos</p>
          </div>
          <button
            onClick={handleNuevoRiego}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Riego</span>
          </button>
        </div>

        {/* Calendario Semanal - IGUAL QUE ANTES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Calendario Semanal</h2>
            </div>
            <p className="text-xs text-gray-600 mt-1">Haz clic en cualquier riego para ver más detalles</p>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 bg-gray-50 sticky left-0 z-20 w-20">
                      Hora
                    </th>
                    {diasSemana.map((dia) => (
                      <th key={dia} className="px-2 py-3 text-center text-xs font-semibold text-gray-700 min-w-[140px]">
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {/* Generar filas de 07:00 a 19:00 */}
                  {Array.from({ length: 13 }, (_, i) => {
                    const hora = (7 + i).toString().padStart(2, '0') + ':00';
                    return (
                      <tr key={hora} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs font-medium text-gray-600 whitespace-nowrap bg-white sticky left-0 z-10 border-r border-gray-200">
                          {hora}
                        </td>
                        {diasSemana.map((_, diaIndex) => {
                          const riegosEnCelda = riegos.filter((riego) => {
                            const horaRiego = riego.hora_riego.substring(0, 5);
                            const [horaR] = horaRiego.split(':').map(Number);
                            const [horaTabla] = hora.split(':').map(Number);
                            const dias = procesarDias(riego.dias_semana);

                            return horaR === horaTabla && dias.some(d => mapearDiaAColumna(d) === diaIndex);
                          });

                          return (
                            <td key={diaIndex} className="px-2 py-2 min-w-[140px]">
                              <div className="flex flex-col gap-1.5">
                                {riegosEnCelda.map((riego) => (
                                  <button
                                    key={riego.id}
                                    onClick={() => handleVerDetalle(riego)}
                                    className={`
                                      ${getColorClase(riegos.indexOf(riego))} 
                                      px-2 py-1.5 rounded-lg text-[10px] font-medium
                                      transition-all border text-left w-full
                                      hover:shadow-md
                                    `}
                                  >
                                    <p className="font-semibold truncate leading-tight">
                                      {riego.nombre_calendario}
                                    </p>
                                    <p className="text-[9px] opacity-75 flex items-center gap-0.5 mt-0.5">
                                      <MapPin className="w-2.5 h-2.5" />
                                      <span className="truncate">{riego.invernadero?.nombre || 'N/A'}</span>
                                    </p>
                                  </button>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-200 text-center lg:hidden">
            <p className="text-xs text-gray-500">← Desliza para ver todos los días →</p>
          </div>
        </div>

        {/* Riegos Activos - IGUAL QUE ANTES */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Droplets className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">Riegos Activos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riegos.map((riego, index) => (
              <button
                key={riego.id}
                onClick={() => handleVerDetalle(riego)}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-emerald-300 transition-all text-left"
              >
                <div className={`${getColorClase(index)} inline-block px-3 py-1 rounded-md text-xs font-semibold mb-3 border`}>
                  {riego.invernadero?.nombre || 'Sin invernadero'}
                </div>
                <h3 className="font-semibold text-base text-gray-900 mb-3">
                  {riego.nombre_calendario}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs">{procesarDias(riego.dias_semana).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs">{riego.hora_riego}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs">{riego.cantidad_agua_litros} L • {riego.duracion_minutos} min</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - CON VALIDACIONES */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {!modoCreacion && !modoEdicion && selectedRiego ? (
              // Vista de detalle - IGUAL QUE ANTES
              <div className="relative">
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-t-2xl z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{selectedRiego.nombre_calendario}</h3>
                      <div className="flex items-center gap-1.5 text-emerald-100 text-sm">
                        <MapPin className="w-4 h-4" />
                        <p>{selectedRiego.invernadero?.nombre || 'Sin invernadero'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4 relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <p className="text-xs font-medium text-gray-600">Hora</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{selectedRiego.hora_riego}</p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Timer className="w-4 h-4 text-emerald-600" />
                        <p className="text-xs font-medium text-gray-600">Duración</p>
                      </div>
                      <p className="text-2xl font-bold text-emerald-900">{selectedRiego.duracion_minutos} min</p>
                    </div>
                  </div>

                  <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-4 h-4 text-cyan-600" />
                      <p className="text-xs font-medium text-gray-600">Cantidad de Agua</p>
                    </div>
                    <p className="text-2xl font-bold text-cyan-900">{selectedRiego.cantidad_agua_litros} Litros</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs font-medium text-gray-600">Días Programados</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {procesarDias(selectedRiego.dias_semana).map((dia, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-semibold border border-purple-200"
                        >
                          {dia.charAt(0).toUpperCase() + dia.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedRiego.notas && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <p className="text-xs font-medium text-gray-600">Notas</p>
                      </div>
                      <p className="text-sm text-gray-700">{selectedRiego.notas}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleEditarRiego(selectedRiego)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminarRiego(selectedRiego.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // FORMULARIO CON VALIDACIONES ✅
              <div className="relative">
                <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-t-2xl z-10">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {modoEdicion ? 'Editar Riego' : 'Nuevo Riego'}
                      </h3>
                      <p className="text-emerald-100 text-sm mt-1">Completa la información del riego</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setValidationErrors({});
                      }}
                      className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 relative">
                  
                  {/* ✅ NUEVO: Mensaje de error del servidor */}
                  {validationErrors._server && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in fade-in duration-300">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Error al guardar</p>
                          <p className="text-sm text-red-700 mt-1">{validationErrors._server}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invernadero */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Invernadero *
                    </label>
                    <select
                      value={formData.id_invernadero}
                      onChange={(e) => handleInputChange('id_invernadero', e.target.value)}
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm
                        ${validationErrors.id_invernadero ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Selecciona un invernadero</option>
                      {invernaderos.map(inv => (
                        <option key={inv.id} value={inv.id}>{inv.nombre}</option>
                      ))}
                    </select>
                    {validationErrors.id_invernadero && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.id_invernadero}
                      </p>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nombre del Riego *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre_calendario}
                      onChange={(e) => handleInputChange('nombre_calendario', e.target.value)}
                      placeholder="Ej: Riego Matutino Phalaenopsis"
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm
                        ${validationErrors.nombre_calendario ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.nombre_calendario && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.nombre_calendario}
                      </p>
                    )}
                  </div>

                  {/* Días */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Días de Riego *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {diasOptions.map((dia, idx) => (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => toggleDia(dia)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${formData.dias_semana.includes(dia)
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-300'
                            }`}
                        >
                          {diasSemana[idx].substring(0, 3)}
                        </button>
                      ))}
                    </div>
                    {validationErrors.dias_semana && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.dias_semana}
                      </p>
                    )}
                  </div>

                  {/* Hora y Duración */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Hora * <span className="text-xs text-gray-500">(07:00 - 19:00)</span>
                      </label>
                      <select
                        value={formData.hora_riego}
                        onChange={(e) => handleInputChange('hora_riego', e.target.value)}
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm
                          ${validationErrors.hora_riego ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Selecciona una hora</option>
                        {horasPermitidas.map(hora => (
                          <option key={hora} value={hora}>
                            {hora}
                          </option>
                        ))}
                      </select>
                      {validationErrors.hora_riego && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.hora_riego}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Duración (min) *
                      </label>
                      <input
                        type="number"
                        value={formData.duracion_minutos}
                        onChange={(e) => handleInputChange('duracion_minutos', parseInt(e.target.value))}
                        min="1"
                        max="120"
                        className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm
                          ${validationErrors.duracion_minutos ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {validationErrors.duracion_minutos && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {validationErrors.duracion_minutos}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cantidad de Agua */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Cantidad de Agua (litros) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="1000"
                      value={formData.cantidad_agua_litros}
                      onChange={(e) => handleInputChange('cantidad_agua_litros', e.target.value)}
                      placeholder="Ej: 15.5"
                      className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm
                        ${validationErrors.cantidad_agua_litros ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.cantidad_agua_litros && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.cantidad_agua_litros}
                      </p>
                    )}
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={formData.notas}
                      onChange={(e) => handleInputChange('notas', e.target.value)}
                      placeholder="Observaciones..."
                      rows="3"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
                    />
                  </div>

                  {/* Advertencia de Horario */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-emerald-800">
                        <p className="font-medium mb-1">✓ Horario Permitido</p>
                        <p>Selecciona una hora entre <strong>07:00 AM</strong> y <strong>07:00 PM</strong> en intervalos de 15 minutos.</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setValidationErrors({});
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {modoEdicion ? 'Guardar' : 'Crear'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default CalendarioRiego;