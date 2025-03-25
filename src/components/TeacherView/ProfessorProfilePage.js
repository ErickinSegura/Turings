import {
  GraduationCap,
  Mail,
  Award,
  BookOpen,
  Building,
  Calendar,
  Users,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/authContext';

const TeacherProfilePage = () => {
  const { logOut } = useAuth();

  const academicInfo = {
    title: "Dr. Jesús Guillermo Falcón Cardona",
    positions: [
      "Profesor investigador, Tecnológico de Monterrey",
      "Investigador Nacional CONACyT (SNI)",
      "Miembro del cuerpo académico 'Inteligencia Computacional' (SEP)",
      "Profesor visitante, Universidad Autónoma Metropolitana"
    ],
    education: [
      "Doctor en Ciencias en Computación - CINVESTAV-IPN",
      "Maestro en Ciencias en Computación - CINVESTAV-IPN",
      "Ingeniero en telemática - UPIITA-IPN"
    ],
    awards: [
      "Premio 'José Negrete' - Mejor tesis doctoral en IA en México",
      "Premio a la mejor tesis doctoral en Latinoamérica - CLEI"
    ],
    researchAreas: [
      "Computación evolutiva",
      "Optimización numérica",
      "Optimización evolutiva multi-objetivo",
      "Neuroevolución",
      "Aprendizaje automático multi-objetivo",
      "Aprendizaje automático evolutivo"
    ],
    contact: {
      office: "CETEC Torre Sur 5to piso – Cúbiculo CT530",
      email: "jfalcon@tec.mx",
      zoom: "jguillermof",
      officeHours: "Miércoles 13:00 – 14:40 hrs"
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-50 mb-3">
                Perfil Académico
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                  href="https://github.com/ErickinSegura/Turings/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-[#24292F] text-white rounded-2xl hover:bg-[#2C3338]
                 transition-all duration-300 space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Reportar en GitHub</span>
              </a>
              <button
                  onClick={logOut}
                  className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-50 border border-gray-800 rounded-2xl hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                 dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                 transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Main Profile Card */}
          <div className="rounded-3xl border border-black shadow-sm p-8 mb-8 dark:border-white">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-2xl">
                <GraduationCap className="w-16 h-16 text-gray-50 dark:text-gray-800" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-4">
                  {academicInfo.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-500">
                    <Mail className="w-5 h-5 mr-3" />
                    {academicInfo.contact.email}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-500">
                    <Video className="w-5 h-5 mr-3" />
                    Zoom: {academicInfo.contact.zoom}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Positions */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black dark:border-white p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-2xl">
                  <Building className="w-6 h-6 text-gray-50 dark:text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 ml-2">
                  Posiciones Actuales
                </h3>
              </div>
              <ul className="space-y-2">
                {academicInfo.positions.map((position, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {position}
                    </li>
                ))}
              </ul>
            </div>

            {/* Awards */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black dark:border-white p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-2xl">
                  <Award className="w-6 h-6 text-gray-50 dark:text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 ml-2">
                  Premios y Reconocimientos
                </h3>
              </div>
              <ul className="space-y-2">
                {academicInfo.awards.map((award, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {award}
                    </li>
                ))}
              </ul>
            </div>

            {/* Research Areas */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black dark:border-white p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-gray-50 dark:text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 ml-2">
                  Áreas de Investigación
                </h3>
              </div>
              <ul className="space-y-2">
                {academicInfo.researchAreas.map((area, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-300">
                      {area}
                    </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-black rounded-2xl border border-black dark:border-white p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 dark:bg-gray-50 rounded-2xl">
                  <Users className="w-6 h-6 text-gray-50 dark:text-gray-800" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 ml-2">
                  Información de Contacto
                </h3>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300">
                  <Building className="w-4 h-4 inline mr-2 stroke-current" />
                  Oficina: {academicInfo.contact.office}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 inline mr-2 stroke-current" />
                  Horario de asesorías: {academicInfo.contact.officeHours}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default TeacherProfilePage;