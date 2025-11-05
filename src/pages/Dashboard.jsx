import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Flower2, LogOut, User, Calendar, Activity, BarChart, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const modulos = [
    {
      titulo: 'Calendario de Riego',
      descripcion: 'Gestiona los horarios y frecuencia de riego para tus invernaderos',
      icono: Calendar,
      color: 'from-blue-500 to-blue-600',
      ruta: '/calendario-riego',
      requerimiento: 'RF1 y RF2'
    },
    {
      titulo: 'Monitoreo en Tiempo Real',
      descripcion: 'Visualiza las condiciones actuales de temperatura y humedad',
      icono: Activity,
      color: 'from-green-500 to-green-600',
      ruta: '/monitoreo',
      requerimiento: 'RF3, RF4 y RF7'
    },
    {
      titulo: 'Historial Ambiental',
      descripcion: 'Consulta el registro histórico y estadísticas de condiciones',
      icono: BarChart,
      color: 'from-purple-500 to-purple-600',
      ruta: '/historial',
      requerimiento: 'RF5 y RF6'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Flower2 className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Sistema de Monitoreo de Orquídeas
                </h1>
                <p className="text-sm text-gray-600">Integración de Competencias II - Etapa 3</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.nombre}</span>
                <span className="text-sm text-gray-500">({user?.rol})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600
                         text-white rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.nombre}!
          </h2>
          <p className="text-gray-600">
            Sistema de monitoreo para el cultivo de orquídeas con control de temperatura (18-24°C) y humedad (~80%)
          </p>
        </div>

        {/* Módulos del Sistema */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Módulos del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modulos.map((modulo, index) => {
              const IconComponent = modulo.icono;
              return (
                <div
                  key={index}
                  onClick={() => navigate(modulo.ruta)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer
                           transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <div className={`h-2 bg-gradient-to-r ${modulo.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${modulo.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {modulo.requerimiento}
                      </span>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {modulo.titulo}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {modulo.descripcion}
                    </p>

                    <div className="flex items-center text-primary-600 font-medium text-sm">
                      <span>Abrir módulo</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información del Proyecto */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Proyecto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-700"><strong>Objetivo:</strong> Monitoreo de cultivo de orquídeas en invernadero</p>
              <p className="text-gray-700 mt-2"><strong>Temperatura Óptima:</strong> 18-24°C (noche-día)</p>
              <p className="text-gray-700 mt-2"><strong>Humedad Óptima:</strong> ~80%</p>
            </div>
            <div>
              <p className="text-gray-700"><strong>Tecnologías:</strong> React, Node.js, Express, MySQL</p>
              <p className="text-gray-700 mt-2"><strong>Funcionalidades:</strong></p>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                <li>Calendario de riego con notificaciones</li>
                <li>Monitoreo de sensores simulados</li>
                <li>Historial y estadísticas</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
