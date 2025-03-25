import {Route, Routes, useLocation} from "react-router-dom";
import NavBar from "./components/Basics/NavBar";
import ProtectedRoute from "./components/ProtectedRoutes";
import HomePage from "./components/StudentView/HomePage";
import TeacherHomepage from "./components/TeacherView/TeacherHomepage";
import TiendaPage from "./components/TiendaPage";
import PuntajesPage from "./components/PuntajesPage";
import StudentProfilePage from "./components/StudentView/StudentProfilePage";
import TeacherProfilePage from "./components/TeacherView/ProfessorProfilePage";
import GroupsPage from "./components/TeacherView/GroupsPage";
import {GroupsProvider} from "./context/groupsContext";
import CreateGroupPage from "./components/Groups/CreateGroup";
import CreateActivity from "./components/Groups/CreateActivity";
import StudentsListPage from "./components/TeacherView/Students/StudentsListPage";
import StudentDetailPage from "./components/TeacherView/Students/StudentDetailPage";
import GroupDetailView from "./components/Groups/GroupDetailView";
import EditGroupForm from "./components/Groups/EditGroupForm";
import GroupShopPage from "./components/Groups/GroupShopPage";
import ActivityDetailView from "./components/TeacherView/ActivityDetailView";
import ScanActivity from "./components/StudentView/ScanActivity";
import GroupLeaderboardPage from "./components/Groups/GroupLeaderboardPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import PasswordResetPage from "./components/PasswordResetPage";

export function AppContent() {
    const location = useLocation();

    // Lista de rutas sin NavBar
    const routesWithoutNavbar = ['/login', '/register', '/reset-password'];
    const showNavbar = !routesWithoutNavbar.includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50">
            {showNavbar && <NavBar />}
            <Routes>
                {/* Rutas accesibles para cualquier usuario autenticado */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />

                <Route path="/profesor" element={
                    <ProtectedRoute>
                        <TeacherHomepage />
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

                {/* Rutas exclusivas de grupos */}
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

                <Route path="/actividades/:activityId" element={
                    <ProtectedRoute allowedRoles={['teacher']}>
                        <ActivityDetailView />
                    </ProtectedRoute>
                } />


                <Route path="/scan" element={
                    <ProtectedRoute allowedRoles={['student']}>
                        <ScanActivity />
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
                <Route path="/reset-password" element={<PasswordResetPage />} />

            </Routes>
        </div>
    );
}