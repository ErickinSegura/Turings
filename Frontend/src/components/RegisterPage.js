import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const RegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validación del nombre
    if (!user.name) {
      newErrors.name = 'El nombre es requerido';
    } else if (user.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(user.name)) {
      newErrors.name = 'El nombre solo puede contener letras y espacios';
    }


    // Validación del email
    if (!user.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    } else if (!user.email.endsWith('@tec.mx')) {
      newErrors.email = 'Debe ser un correo institucional (@tec.mx)';
    } else if (!/^A0[a-zA-Z0-9]+@tec\.mx$/i.test(user.email)) {
      newErrors.email = 'El correo debe iniciar con A0';
    } else if (!/^A0[a-zA-Z0-9]{7}@tec\.mx$/i.test(user.email)) {
      newErrors.email = 'La matricula debe de ser de 9 caracteres';
    }



    // Validación de la contraseña
    if (!user.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      if (user.password.includes(' ')) {
        newErrors.password = 'La contraseña no debe contener espacios';
      } else if (user.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (!/\d/.test(user.password)) {
        newErrors.password = 'La contraseña debe contener al menos un número';
      } else if (!/[A-Z]/.test(user.password)) {
        newErrors.password = 'La contraseña debe contener al menos una mayúscula';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChanges = ({ target: { name, value } }) => {
    setErrors(prev => ({
      ...prev,
      [name]: null
    }));

    setUser(prevUser => ({
      ...prevUser,
      [name]: name === 'email' ? value.trim() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const matricula = user.email.split('@')[0].toUpperCase();
      const formattedName = user.name
          .trim()
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

      const result = await signUp(user.email, user.password, {
        name: formattedName,
        role: 'student',
        matricula,
      });

      if (!result.success) {
        switch (result.error.code) {
          case 'auth/email-already-in-use':
            setErrors({
              general: 'Ya existe una cuenta con este correo electrónico'
            });
            break;
          case 'auth/invalid-email':
            setErrors({
              email: 'El formato del correo electrónico no es válido'
            });
            break;
          case 'auth/weak-password':
            setErrors({
              password: 'La contraseña debe tener al menos 6 caracteres'
            });
            break;
          case 'auth/network-request-failed':
            setErrors({
              general: 'Error de conexión. Verifica tu conexión a internet'
            });
            break;
          default:
            console.error('Error no manejado:', result.error);
            setErrors({
              general: 'Ocurrió un error durante el registro. Por favor, intenta nuevamente'
            });
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({
        general: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName) => {
    return errors[fieldName] && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {errors[fieldName]}
        </p>
    );
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row border-2 border-black">
          <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-800 flex items-center justify-center">
            {/*
            <img
                src="/api/placeholder/800/600"
                alt="Turing Icon"
                className="object-cover w-full h-full"
            />
            */}
          </div>

          <div className="w-full md:w-3/4 p-6 sm:p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                Crear cuenta
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8">
                Completa tus datos para registrarte. Usa tu correo institucional.
              </p>

              {errors.general && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p>{errors.general}</p>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                      </div>
                      <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Tu nombre completo"
                          value={user.name}
                          onChange={handleChanges}
                          disabled={isSubmitting}
                          className={`pl-10 w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white
                        ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {renderFieldError('name')}
                  </div>

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
                          placeholder="matricula@tec.mx"
                          value={user.email}
                          onChange={handleChanges}
                          disabled={isSubmitting}
                          className={`pl-10 w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white
                        ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {renderFieldError('email')}
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
                          className={`pl-10 w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      />
                    </div>
                    {renderFieldError('password')}
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                        isSubmitting
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-gray-800 hover:bg-gray-700"
                    }`}
                >
                  {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </>
                  ) : "Registrarse"}
                </button>
              </form>

              <button
                  onClick={() => navigate("/login")}
                  disabled={isSubmitting}
                  className={`mt-4 w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 transition-colors duration-200 ${
                      isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  }`}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;