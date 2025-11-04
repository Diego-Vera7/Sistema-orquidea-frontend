import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Flower2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* Lado izquierdo - Imagen de orquídea */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-16">
            <div className="max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=700&fit=crop&q=80" 
                alt="Orquídea Blanca" 
                className="w-full h-auto rounded-2xl"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Lado derecho - Formulario */}
          <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            
            {/* Icono y título */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-primary-100 p-4 rounded-2xl mb-6">
                <Flower2 className="w-10 h-10 text-primary-600" strokeWidth={2} />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido</h1>
              <p className="text-gray-600 text-center">
                Inicia sesión en tu sistema de monitoreo.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu email"
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           transition-all duration-200 text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* ¿Olvidaste tu contraseña? */}
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de Login */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold 
                         py-4 px-6 rounded-xl transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40
                         transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              {/* Link a Registro */}
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿No tienes una cuenta?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;