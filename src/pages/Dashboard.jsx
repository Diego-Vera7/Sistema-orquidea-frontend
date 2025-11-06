import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Flower2, LogOut, User, ArrowRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

        {/* Botón de Acceso al Sistema */}
        <div className="mb-8 flex flex-col items-center justify-center py-12">
          <div className="relative group">
            {/* Efecto de brillo de fondo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-green-500 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>

            {/* Botón principal */}
            <button
              onClick={() => navigate('/monitoreo')}
              className="relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800
                       text-white px-12 py-6 rounded-2xl shadow-2xl
                       transform transition-all duration-300 hover:scale-105
                       flex items-center gap-4 group"
            >
              <Sparkles className="w-8 h-8 animate-pulse" />
              <div className="text-left">
                <div className="text-2xl font-bold tracking-wide">Acceder al Sistema</div>
                <div className="text-sm text-primary-100 mt-1">Comienza a monitorear tus orquídeas</div>
              </div>
              <ArrowRight className="w-8 h-8 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Indicadores visuales debajo del botón */}
          <div className="mt-8 flex gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Calendario de Riego</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Monitoreo en Vivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Historial Ambiental</span>
            </div>
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
