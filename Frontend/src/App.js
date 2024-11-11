import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import NavBar from './components/NavBar';
import TeacherProfilePage from './components/ProfessorProfilePage';
import ProtectedRoute from './components/ProtectedRoutes';
import PuntajesPage from './components/PuntajesPage';
import QRPage from './components/QRPage';
import RegisterPage from './components/RegisterPage';
import StudentProfilePage from './components/StudentProfilePage';
import TiendaPage from './components/TiendaPage';
import CreateGroupPage from './components/CreateGroup'; 
import { AuthProvider } from './context/authContext';
import { GroupsProvider } from './context/groupsContext'; 
import StudentsListPage from './components/StudentsListPage';
import StudentDetailPage from './components/StudentDetailPage';
import GroupDetailView from './components/GroupDetailView';


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
        <Route path="/crear-grupo" element={
          <ProtectedRoute>
            <GroupsProvider>
              <CreateGroupPage />
            </GroupsProvider>
          </ProtectedRoute>
        } />
        <Route path="/estudiantes" element={<StudentsListPage />} />
        <Route path="/estudiantes/:studentId" element={<StudentDetailPage />} />
        <Route path="/grupos/:groupId" element={<GroupDetailView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;