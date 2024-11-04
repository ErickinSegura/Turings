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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="tu@ejemplo.com"
                value={user.email}
                onChange={handleChanges}
                disabled={isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Contraseña"
                value={user.password}
                onChange={handleChanges}
                disabled={isSubmitting}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isSubmitting 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
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
      </div>
    </div>
  );
};

export default LoginPage;