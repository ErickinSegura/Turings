  import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
  import HomePage from './components/StudentView/HomePage';
  import LoginPage from './components/LoginPage';
  import NavBar from './components/Basics/NavBar';
  import TeacherProfilePage from './components/TeacherView/ProfessorProfilePage';
  import ProtectedRoute from './components/ProtectedRoutes';
  import PuntajesPage from './components/PuntajesPage';
  import RegisterPage from './components/RegisterPage';
  import StudentProfilePage from './components/StudentView/StudentProfilePage';
  import TiendaPage from './components/TiendaPage';
  import CreateGroupPage from './components/Groups/CreateGroup';
  import { AuthProvider } from './context/authContext';
  import { GroupsProvider } from './context/groupsContext';
  import StudentsListPage from './components/TeacherView/Students/StudentsListPage';
  import StudentDetailPage from './components/TeacherView/Students/StudentDetailPage';
  import GroupDetailView from './components/Groups/GroupDetailView';
  import EditGroupForm from "./components/Groups/EditGroupForm";
  import CreateActivity from './components/Groups/CreateActivity';
  import GroupShopPage from './components/Groups/GroupShopPage';
  import GroupsPage from "./components/TeacherView/GroupsPage";
  import ActivityDetailView from "./components/TeacherView/ActivityDetailView";
  import ScanActivity from "./components/StudentView/ScanActivity";
  import GroupLeaderboardPage from "./components/Groups/GroupLeaderboardPage";
  import {ThemeProvider} from "./context/themeContext";


  function App() {
    return (
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <AppContent />
            </Router>
          </AuthProvider>
        </ThemeProvider>
    );
  }

  function AppContent() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50">
          {location.pathname !== '/login' && location.pathname !== '/register' && <NavBar />}
          <Routes>
            {/* Rutas accesibles para cualquier usuario autenticado */}
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
            <Route path="/perfil-estudiante" element={
              <ProtectedRoute>
                <StudentProfilePage />
              </ProtectedRoute>
            } />

            {/* Rutas exclusivas para profesores */}
            <Route path="/perfil" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherProfilePage />
              </ProtectedRoute>
            } />
              <Route path="/grupos" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                      <GroupsPage />
                  </ProtectedRoute>
              } />
            <Route path="/crear-grupo" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <GroupsProvider>
                  <CreateGroupPage />
                </GroupsProvider>
              </ProtectedRoute>
            } />
            <Route path="/grupos/:groupId/nueva-actividad" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateActivity />
              </ProtectedRoute>
            } />
            <Route path="/estudiantes" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <StudentsListPage />
              </ProtectedRoute>
            } />
            <Route path="/estudiantes/:studentId" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <StudentDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/grupos/:groupId" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <GroupDetailView />
              </ProtectedRoute>
            } />
            <Route path="/grupos/:groupId/editar" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <EditGroupForm />
              </ProtectedRoute>
            } />

              {/* Rutas exclusivas para grupos */}
            <Route path="/grupos/:groupId/tienda" element={
              <ProtectedRoute allowedRoles={['student']}>
                <GroupShopPage />
              </ProtectedRoute>
            } />

            <Route path="/grupos/:groupId/tienda/admin" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <GroupShopPage isTeacher={true} />
              </ProtectedRoute>
            } />

              <Route path="/grupos/:groupId/leaderboard" element={
                <ProtectedRoute allowedRoles={['teacher', 'student']}>
                  <GroupLeaderboardPage />
                </ProtectedRoute>
              } />

            {/* Rutas públicas (no autenticación necesaria) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path={"/scan"} element={<ScanActivity />} />
            <Route path="/actividades/:activityId" element={<ActivityDetailView />} />
          </Routes>
        </div>
    );
  }

  export default App;
