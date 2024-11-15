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
  const [error, setError] = useState(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChanges = ({ target: { name, value } }) => {
    setError(null);
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user.email || !user.password || !user.name) {
      setError("Por favor completa todos los campos");
      setIsSubmitting(false);
      return;
    }

    // Verificar si el correo termina en '@tec.mx'
    if (!user.email.endsWith("@tec.mx")) {
      setError("El correo debe ser institucional (@tec.mx)");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Intentando registrar al usuario...");

      // Extraer la matrícula del correo
      const matricula = user.email.split("@")[0];

      // Registrar al usuario con Firebase Auth y Firestore
      const result = await signUp(user.email, user.password, {
        name: user.name,
        role: "student",
        matricula, // Guardar la matrícula en Firestore
      });

      if (result.error) {
        console.error("Error en signUp:", result.error);
        let errorMessage;
        switch (result.error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este correo electrónico ya está registrado";
            break;
          case "auth/invalid-email":
            errorMessage = "El correo electrónico no es válido";
            break;
          case "auth/weak-password":
            errorMessage = "La contraseña debe tener al menos 6 caracteres";
            break;
          default:
            errorMessage = "Ocurrió un error durante el registro";
        }
        setError(errorMessage);
      } else {
        console.log("Usuario registrado exitosamente:", result);
        navigate("/");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setError("Error al crear la cuenta. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row border-2 border-black">
          <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-800 flex items-center justify-center">
            <img
                src="/api/placeholder/800/600"
                alt="Register illustration"
                className="object-cover w-full h-full"
            />
          </div>

          <div className="w-full md:w-3/4 p-6 sm:p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                Crear cuenta
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8">
                Completa tus datos para registrarte. Usa tu correo institucional.
              </p>

              {error && (
                  <div
                      className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg"
                      role="alert"
                  >
                    <p>{error}</p>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre completo
                    </label>
                    <div className="relative">
                      <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Tu nombre completo"
                          value={user.name}
                          onChange={handleChanges}
                          disabled={isSubmitting}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="matricula@tec.mx"
                          value={user.email}
                          onChange={handleChanges}
                          disabled={isSubmitting}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Contraseña"
                          value={user.password}
                          onChange={handleChanges}
                          disabled={isSubmitting}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                      />
                    </div>
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
                  {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
              </form>

              <button
                  onClick={() => navigate("/login")}
                  className="mt-4 w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 transition-colors duration-200"
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
