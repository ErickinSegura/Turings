import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from 'react-router-dom';

const PasswordResetPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", content: "" });

        if (!email) {
            setMessage({ type: "error", content: "Por favor, ingresa tu correo electrónico" });
            return;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setMessage({ type: "error", content: "El formato del correo electrónico no es válido" });
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await resetPassword(email);

            if (result.success) {
                setMessage({
                    type: "success",
                    content: "Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña"
                });
                setEmail("");
            } else {
                // Manejo de errores de Firebase
                const errorCode = result.error?.code;
                let errorMessage;

                switch (errorCode) {
                    case 'auth/invalid-email':
                        errorMessage = 'El formato del correo electrónico no es válido';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No existe una cuenta asociada a este correo';
                        break;
                    case 'auth/missing-email':
                        errorMessage = 'Por favor, ingresa tu correo electrónico';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Error de conexión. Verifica tu conexión a internet';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Demasiadas solicitudes. Por favor, intenta más tarde';
                        break;
                    default:
                        errorMessage = 'Ha ocurrido un error al enviar el correo. Por favor, intenta nuevamente';
                        console.error('Error no manejado:', result.error);
                }

                setMessage({ type: "error", content: errorMessage });
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            setMessage({
                type: "error",
                content: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-black p-6 sm:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
                        Recuperar Contraseña
                    </h1>
                    <p className="text-gray-600">
                        Ingresa el correo electrónico asociado a tu cuenta para recibir instrucciones
                    </p>
                </div>

                {message.content && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${
                            message.type === "success"
                                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                                : "bg-red-50 border-l-4 border-red-500 text-red-700"
                        }`}
                        role="alert"
                    >
                        <p>{message.content}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}
                                disabled={isSubmitting}
                                className="pl-10 w-full px-3 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white border-gray-300"
                            />
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
                                Enviando...
                            </>
                        ) : 'Enviar instrucciones'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-gray-600 hover:text-gray-800"
                    >
                        Volver a iniciar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;