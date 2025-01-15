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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Perfil Académico
              </h1>
            </div>
            <button
                onClick={logOut}
                className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-50 border border-gray-800 rounded-2xl hover:bg-gray-50 hover:text-gray-800 hover:border hover:border-black
                                                                dark:bg-gray-50 dark:text-gray-800 dark:border dark:border-black dark:hover:border-gray-50 dark:hover:bg-black dark:hover:text-gray-50
                 transition-all duration-300"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-3xl border border-black shadow-sm p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-gray-800 rounded-2xl">
                <GraduationCap className="w-16 h-16 text-gray-50" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {academicInfo.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    {academicInfo.contact.email}
                  </div>
                  <div className="flex items-center text-gray-600">
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
            <div className="bg-white rounded-2xl border border-black p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 rounded-2xl">
                  <Building className="w-6 h-6 text-gray-50"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900 ml-2">Posiciones Actuales</h3>
              </div>
              <ul className="space-y-2">
                {academicInfo.positions.map((position, index) => (
                    <li key={index} className="text-gray-600">{position}</li>
                ))}
              </ul>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-2xl border border-black p-6">
              <div className="flex items-center mb-4">
                <div className="p-4 bg-gray-800 rounded-2xl">

                  <Award className="w-6 h-6 text-gray-50"/>
                </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-2">Premios y Reconocimientos</h3>
                </div>
                <ul className="space-y-2">
                  {academicInfo.awards.map((award, index) => (
                      <li key={index} className="text-gray-600">{award}</li>
                  ))}
                </ul>
              </div>

              {/* Research Areas */}
              <div className="bg-white rounded-2xl border border-black p-6">
                <div className="flex items-center mb-4">
                  <div className="p-4 bg-gray-800 rounded-2xl">

                    <BookOpen className="w-6 h-6 text-gray-50"/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 ml-2">Áreas de Investigación</h3>
                  </div>
                  <ul className="space-y-2">
                    {academicInfo.researchAreas.map((area, index) => (
                        <li key={index} className="text-gray-600">{area}</li>
                    ))}
                  </ul>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl border border-black p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-4 bg-gray-800 rounded-2xl">

                      <Users className="w-6 h-6 text-gray-50"/>
                    </div>
                      <h3 className="text-xl font-bold text-gray-900 ml-2">Información de Contacto</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-600">
                        <Building className="w-4 h-4 inline mr-2"/>
                        Oficina: {academicInfo.contact.office}
                      </p>
                      <p className="text-gray-600">
                        <Calendar className="w-4 h-4 inline mr-2"/>
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