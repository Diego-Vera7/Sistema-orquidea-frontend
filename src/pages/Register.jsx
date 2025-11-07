import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import orquideaImg from '../assets/orquidea.jpg';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: 'operador'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpiar el error específico del campo que se está editando
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      general: ''
    };
    let isValid = true;

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
      isValid = false;
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
      isValid = false;
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    if (formData.telefono.trim() && !/^\+?[\d\s-]{8,}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido (ej: +56912345678)';
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({ nombre: '', email: '', telefono: '', password: '', confirmPassword: '', general: '' });

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error de registro:', err);
      setErrors(prev => ({
        ...prev,
        general: err.response?.data?.message || 'Error al registrarse. Intenta nuevamente.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Lado izquierdo - Formulario */}
          <div className="w-full lg:w-5/12 p-8 lg:p-12 bg-white">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Crear Cuenta</h1>
              <p className="text-sm text-gray-600">Completa el formulario para registrarte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Mensaje de error general */}
              {errors.general && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error de registro</p>
                      <p className="text-sm text-red-700 mt-1">{errors.general}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre completo"
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm transition-all
                           ${errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                />
                {errors.nombre && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ingresa tu correo electrónico"
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm transition-all
                           ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Teléfono <span className="text-gray-400 text-xs">(opcional)</span>
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56912345678"
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm transition-all
                           ${errors.telefono ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                />
                {errors.telefono && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.telefono}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg 
                             focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                             text-gray-900 placeholder-gray-400 text-sm pr-10 transition-all
                             ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-lg 
                             focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                             text-gray-900 placeholder-gray-400 text-sm pr-10 transition-all
                             ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.confirmPassword}
                  </p>
                )}
                {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Las contraseñas coinciden
                  </p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                  Rol <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                             text-gray-900 appearance-none pr-10 text-sm"
                  >
                    <option value="administrador">Administrador</option>
                    <option value="operador">Operador</option>
                    <option value="visualizador">Visualizador</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Indicador de requisitos */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-800 mb-2">Requisitos de contraseña:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={formData.password.length >= 6 ? 'text-green-700' : 'text-blue-700'}>
                      Mínimo 6 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${formData.password && formData.password === formData.confirmPassword ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={formData.password && formData.password === formData.confirmPassword ? 'text-green-700' : 'text-blue-700'}>
                      Las contraseñas coinciden
                    </span>
                  </div>
                </div>
              </div>

              {/* Botón de Registro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium 
                         py-3 px-6 rounded-lg transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  'Registrarse'
                )}
              </button>

              {/* Link a Login */}
              <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>

          {/* Lado derecho - Imagen */}
          <div className="hidden lg:block lg:w-7/12 relative">
            <img
              src={orquideaImg}
              alt="Orquídea Rosa"
              className="w-full h-full object-cover"
              style={{ minHeight: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;