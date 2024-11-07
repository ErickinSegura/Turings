import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleChanges = ({ target: { name, value } }) => {
    setError(null);
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user.email || !user.password) {
      setError('Por favor completa todos los campos');
      setIsSubmitting(false);
      return;
    }

    const result = await logIn(user.email, user.password);
    
    if (result.error) {
      let errorMessage;
      switch (result.error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Correo o contraseña incorrectos';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Por favor, intenta más tarde';
          break;
        default:
          errorMessage = result.error.message;
      }
      setError(errorMessage);
    } else {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row border-2 border-black">
        {/* Lado izquierdo - Imagen */}
        <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-800 flex items-center justify-center">
          <img
            src="/api/placeholder/800/600"
            alt="Turing Icon"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full md:w-3/4 p-6 sm:p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
              Iniciar sesión
            </h1>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Ingresa a tu cuenta para comenzar
            </p>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="tu@ejemplo.com"
                      value={user.email}
                      onChange={handleChanges}
                      disabled={isSubmitting}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Contraseña"
                      value={user.password}
                      onChange={handleChanges}
                      disabled={isSubmitting}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white transition-colors duration-200
                  ${isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-gray-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : 'Iniciar sesión'}
              </button>
            </form>

            <button 
              onClick={() => navigate('/register')}
              className="mt-4 w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 transition-colors duration-200">
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;