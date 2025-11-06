import { useState, useEffect } from 'react';
import { BarChart, Calendar, Download, Filter, FileText } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { lecturaAmbientalService } from '../services/lecturaAmbientalService';
import { invernaderoService } from '../services/invernaderoService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const HistorialAmbiental = () => {
  const [invernaderos, setInvernaderos] = useState([]);
  const [lecturas, setLecturas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    id_invernadero: '',
    desde: '',
    hasta: '',
    limit: 50
  });

  useEffect(() => {
    cargarInvernaderos();
  }, []);

  useEffect(() => {
    if (invernaderos.length > 0) {
      cargarDatos();
    }
  }, [filtros, invernaderos]);

  const cargarInvernaderos = async () => {
    try {
      const res = await invernaderoService.getAll();
      setInvernaderos(res.data);
      if (res.data.length > 0) {
        setFiltros(prev => ({ ...prev, id_invernadero: res.data[0].id }));
      }
    } catch (error) {
      console.error('Error al cargar invernaderos:', error);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filtros.id_invernadero) params.id_invernadero = filtros.id_invernadero;
      if (filtros.desde) params.desde = filtros.desde;
      if (filtros.hasta) params.hasta = filtros.hasta;
      if (filtros.limit) params.limit = filtros.limit;

      const [lecturasRes, statsRes] = await Promise.all([
        lecturaAmbientalService.getAll(params),
        lecturaAmbientalService.getEstadisticas(params)
      ]);

      setLecturas(lecturasRes.data);
      setEstadisticas(statsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    if (lecturas.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Historial de Condiciones Ambientales', 14, 20);

    // Subtítulo con fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 14, 28);

    // Información del invernadero seleccionado
    if (filtros.id_invernadero) {
      const inv = invernaderos.find(i => i.id === parseInt(filtros.id_invernadero));
      if (inv) {
        doc.text(`Invernadero: ${inv.nombre}`, 14, 34);
      }
    }

    // Estadísticas si existen
    if (estadisticas) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Estadísticas del Período', 14, 44);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Temperatura: Min ${estadisticas.temperatura.minima}°C | Prom ${estadisticas.temperatura.promedio}°C | Max ${estadisticas.temperatura.maxima}°C`, 14, 50);
      doc.text(`Humedad: Min ${estadisticas.humedad.minima}% | Prom ${estadisticas.humedad.promedio}% | Max ${estadisticas.humedad.maxima}%`, 14, 56);
      doc.text(`Alertas: Temperatura ${estadisticas.alertas.temperatura} | Humedad ${estadisticas.alertas.humedad}`, 14, 62);
    }

    // Tabla de datos
    const tableData = lecturas.map(l => [
      new Date(l.fecha_hora).toLocaleString('es-ES'),
      l.invernadero?.nombre || 'N/A',
      parseFloat(l.temperatura).toFixed(1) + '°C',
      parseFloat(l.humedad).toFixed(1) + '%',
      l.alerta_temperatura ? 'Sí' : 'No',
      l.alerta_humedad ? 'Sí' : 'No'
    ]);

    autoTable(doc, {
      startY: estadisticas ? 68 : 40,
      head: [['Fecha y Hora', 'Invernadero', 'Temp.', 'Hum.', 'Alert. T', 'Alert. H']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 30 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 18 },
        5: { cellWidth: 18 }
      }
    });

    // Guardar el PDF
    doc.save(`historial_ambiental_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const generarLecturasSimuladas = async () => {
    if (!filtros.id_invernadero) {
      alert('Seleccione un invernadero');
      return;
    }

    try {
      await lecturaAmbientalService.generarSimuladas(filtros.id_invernadero, 24, 1);
      alert('24 lecturas simuladas generadas (una por hora)');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al generar lecturas simuladas');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Historial de Condiciones Ambientales</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generarLecturasSimuladas}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Generar 24h Simuladas
            </button>
            <button
              onClick={exportarPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <FileText className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invernadero</label>
              <select
                value={filtros.id_invernadero}
                onChange={(e) => setFiltros({ ...filtros, id_invernadero: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                {invernaderos.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Desde</label>
              <input
                type="datetime-local"
                value={filtros.desde}
                onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hasta</label>
              <input
                type="datetime-local"
                value={filtros.hasta}
                onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Límite</label>
              <input
                type="number"
                value={filtros.limit}
                onChange={(e) => setFiltros({ ...filtros, limit: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
                max="1000"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Temperatura */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Estadísticas de Temperatura</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio:</span>
                  <span className="font-semibold">{estadisticas.temperatura.promedio}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínima:</span>
                  <span className="font-semibold text-blue-600">{estadisticas.temperatura.minima}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máxima:</span>
                  <span className="font-semibold text-red-600">{estadisticas.temperatura.maxima}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alertas:</span>
                  <span className={`font-semibold ${estadisticas.alertas.temperatura > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {estadisticas.alertas.temperatura}
                  </span>
                </div>
              </div>
            </div>

            {/* Humedad */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Estadísticas de Humedad</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio:</span>
                  <span className="font-semibold">{estadisticas.humedad.promedio}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mínima:</span>
                  <span className="font-semibold text-blue-600">{estadisticas.humedad.minima}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Máxima:</span>
                  <span className="font-semibold text-red-600">{estadisticas.humedad.maxima}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alertas:</span>
                  <span className={`font-semibold ${estadisticas.alertas.humedad > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {estadisticas.alertas.humedad}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Lecturas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Registro de Lecturas ({lecturas.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : lecturas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invernadero</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Temperatura</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Humedad</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lecturas.map(lectura => (
                    <tr key={lectura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatFecha(lectura.fecha_hora)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lectura.invernadero?.nombre || 'N/A'}
                      </td>
                      <td className={`px-6 py-4 text-sm text-center font-medium ${
                        lectura.alerta_temperatura ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {parseFloat(lectura.temperatura).toFixed(1)}°C
                      </td>
                      <td className={`px-6 py-4 text-sm text-center font-medium ${
                        lectura.alerta_humedad ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {parseFloat(lectura.humedad).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 text-center">
                        {(lectura.alerta_temperatura || lectura.alerta_humedad) ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            Alerta
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay lecturas disponibles con los filtros seleccionados
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistorialAmbiental;
