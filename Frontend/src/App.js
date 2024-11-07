import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import TiendaPage from './components/TiendaPage';
import PuntajesPage from './components/PuntajesPage';
import HomePage from './components/HomePage';
import { AuthProvider } from './context/authContext';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import QRPage from './components/QRPage';
import StudentProfilePage from './components/StudentProfilePage';
import TeacherProfilePage from './components/ProfessorProfilePage';
import ProtectedRoute from './components/ProtectedRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {location.pathname !== '/login' && location.pathname !== '/register' && <NavBar />}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        
        <Route path="/tienda" element={
          <ProtectedRoute>
            <TiendaPage />
          </ProtectedRoute>
        } />

        <Route path="/puntajes" element={
          <ProtectedRoute>
            <PuntajesPage />
          </ProtectedRoute>
        } />

        <Route path="/perfil" element={
          <ProtectedRoute>
            <TeacherProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/perfil-estudiante" element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        } />

        <Route path="/qr" element={
          <ProtectedRoute>
            <QRPage />
          </ProtectedRoute>
        } />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
