import { useEffect, useState } from "react";
import { ActivitySquare, Droplets, Thermometer, Gauge, RefreshCcw } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";
import api from "../services/api";
import MetricCard from "../components/common/MetricCard";
import HumidityBar from "../components/common/charts/HumidityBar";
import TemperatureLine from "../components/common/charts/TemperatureLine";
import HumidityRing from "../components/common/charts/HumidityRing";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [humBar, setHumBar] = useState([]);
  const [tempLine, setTempLine] = useState([]);
  const [ring, setRing] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const invernaderoId = 1; // TODO: hacerlo dinámico con selector global o query param

  // ✨ ESTILOS PERSONALIZADOS PARA EL SCROLLBAR (igual que Calendario)
  const estilosScrollbar = `
    .scrollbar-thin::-webkit-scrollbar {
      height: 8px;
      width: 8px;
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [humidadRes, tempRes, rangoRes] = await Promise.all([
        api.get("/metricas/humedad-semanal", { params: { invernaderoId } }),
        api.get("/metricas/temperatura-semanal", { params: { invernaderoId } }),
        api.get("/metricas/rango-humedad", { params: { invernaderoId } }),
      ]);
      setHumBar(humidadRes.data || []);
      setTempLine(tempRes.data || []);
      setRing(rangoRes.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err);
      setError("No se pudieron cargar los datos. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Opcional: auto-refresh
    // const id = setInterval(fetchData, 30000);
    // return () => clearInterval(id);
  }, [invernaderoId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 font-medium">Cargando dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl shadow-sm">
            {error}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{estilosScrollbar}</style>

      <div className="space-y-6">
        {/* Header con gradiente (calendario-like) */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ActivitySquare className="w-6 h-6" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard Principal</h1>
                <p className="text-emerald-100 text-sm mt-1">
                  Monitorea las métricas de tus invernaderos en tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-emerald-50/90 text-sm">
                  Última actualización: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchData}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Refrescar
              </button>
            </div>
          </div>
        </div>

        {/* KPIs rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-500">Serie de Humedad</p>
                <p className="text-lg font-semibold text-gray-900">{humBar.length} puntos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-5 h-5 text-rose-600" />
              <div>
                <p className="text-xs text-gray-500">Serie de Temperatura</p>
                <p className="text-lg font-semibold text-gray-900">{tempLine.length} puntos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-xs text-gray-500">Distribución Humedad</p>
                <p className="text-lg font-semibold text-gray-900">{ring.reduce((a, b) => a + (b.value || 0), 0)} lecturas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Humedad General - ancho completo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 bg-emerald-50 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Humedad general</h2>
              </div>
              <p className="text-xs text-gray-600 mt-1">Comparativa últimos 6 días vs semana anterior</p>
            </div>
            <div className="p-4">
              {humBar.length > 0 ? (
                <div className="h-64">
                  <HumidityBar data={humBar} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-emerald-600">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 bg-sky-50 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-sky-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Temperatura general</h2>
                </div>
                <p className="text-xs text-gray-600 mt-1">Promedio diario de los últimos 6 días</p>
              </div>
              <div className="p-4">
                {tempLine.length > 0 ? (
                  <div className="h-64">
                    <TemperatureLine data={tempLine} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-sky-600">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Rango óptimo de humedad</h2>
                </div>
                <p className="text-xs text-gray-600 mt-1">Distribución de lecturas en los últimos 7 días</p>
              </div>
              <div className="p-4">
                {ring.length > 0 ? (
                  <div className="h-64">
                    <HumidityRing data={ring} />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-amber-600">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Indicador de scroll horizontal si lo agregas a secciones con overflow-x */}
          <div className="p-2 bg-gray-50 border border-gray-200 text-center rounded-lg lg:hidden">
            <p className="text-xs text-gray-500">Desliza para ver más contenido →</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
