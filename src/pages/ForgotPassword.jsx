import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

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
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmail(''); // Limpiar el formulario
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          
          {/* Icono y título */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary-100 p-4 rounded-2xl mb-6">
              <Flower2 className="w-10 h-10 text-primary-600" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-600 text-center text-sm">
              No te preocupes, te enviaremos un enlace para restablecerla
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensajes */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded animate-in slide-in-from-top-2">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      ¡Correo enviado exitosamente!
                    </p>
                    <p className="text-sm mt-1">
                      Revisa tu bandeja de entrada y sigue las instrucciones. 
                      Si no lo ves, revisa tu carpeta de spam.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            {!success && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.email@ejemplo.com"
                      required
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               transition-all duration-200 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Botón */}
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
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Enviar Enlace de Recuperación'
                  )}
                </button>
              </>
            )}

            {/* Links de navegación */}
            <div className="space-y-3 pt-4">
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>

              {success && (
                <button
                  onClick={() => setSuccess(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ¿No recibiste el correo? Intenta de nuevo
                </button>
              )}
            </div>
          </form>

          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              El enlace de recuperación expirará en 1 hora. 
              Si no recibes el correo en unos minutos, verifica tu carpeta de spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;