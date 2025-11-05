import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Flower2, 
  LayoutDashboard, 
  Clock, 
  LineChart, 
  CalendarDays, 
  Bell, 
  Radio,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/monitoreo', icon: Clock, label: 'Monitoreo' },
    { path: '/historial', icon: LineChart, label: 'Historial' },
    { path: '/calendario-riego', icon: CalendarDays, label: 'Calendario' },
    { path: '/notificaciones', icon: Bell, label: 'Notificaciones' },
    { path: '/sensores', icon: Radio, label: 'Sensores' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo y título */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 p-2.5 rounded-xl shadow-sm">
              <Flower2 className="w-7 h-7 text-primary-600" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Sistema de Orquídeas</h1>
              <p className="text-xs text-gray-500 font-medium">Monitoreo y Control</p>
            </div>
          </Link>

          {/* Menú de navegación - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium 
                    transition-all duration-200 relative overflow-hidden
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-primary-100 opacity-50 rounded-xl"></div>
                  )}
                  <Icon className="w-5 h-5 relative z-10" strokeWidth={2.2} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y menú desplegable */}
          <div className="flex items-center gap-4">
            {/* Botón móvil */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Perfil usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {user?.nombre}
                  </p>
                  <p className="text-xs text-gray-500 capitalize font-medium">{user?.rol}</p>
                </div>
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 p-2.5 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  <User className="w-5 h-5 text-primary-600" strokeWidth={2.5} />
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                      <div className="mt-2">
                        <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg capitalize">
                          {user?.rol}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={2.5} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
                      transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;