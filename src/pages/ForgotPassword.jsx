import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Aquí se conectaria la API para enviar el email// ME ENCARGO YO(CRISTIAN)
      // await api.post('/auth/forgot-password', { email }); / ruta para poder enviar solicitud jiJAS
      
      // Simulación de envío exitoso
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          
          {/* Icono y título */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary-100 p-4 rounded-2xl mb-6">
              <Flower2 className="w-10 h-10 text-primary-600" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Orchid Monitor
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-600 text-center text-sm">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensajes */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                <p className="text-sm font-medium">
                  ¡Correo enviado exitosamente!
                </p>
                <p className="text-sm mt-1">
                  Revisa tu bandeja de entrada y sigue las instrucciones.
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@ejemplo.com"
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading || success}
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
                  <span>Enviando...</span>
                </div>
              ) : success ? (
                'Correo Enviado'
              ) : (
                'Enviar Enlace'
              )}
            </button>

            {/* Link a Login */}
            <div className="text-center pt-4">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;