import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
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
        rol: 'administrador'
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            await register(dataToSend);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
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
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Nombre Completo */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu nombre completo"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu correo electrónico"
                                    required
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Ingresa tu número de teléfono"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                           text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Crea una contraseña segura"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                             text-gray-900 placeholder-gray-400 text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirma tu contraseña"
                                        required
                                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                             text-gray-900 placeholder-gray-400 text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Rol */}
                            <div>
                                <label className="block text-sm font-normal text-gray-700 mb-1.5">
                                    Rol
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
                                        <option value="supervisor">Supervisor</option>
                                        <option value="operador">Operador</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                                {loading ? 'Registrando...' : 'Registrarse'}
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