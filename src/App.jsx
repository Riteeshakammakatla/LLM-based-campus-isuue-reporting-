import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import IssueDetailPage from './pages/IssueDetailPage';

// Protected route — redirect to /login if not authenticated
function ProtectedRoute({ children, allowedRoles }) {
    const { currentUser, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-ink/40 font-medium">Loading…</p>
                </div>
            </div>
        );
    }
    if (!currentUser) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Redirect to their own dashboard if wrong role
        const redirects = { student: '/student', admin: '/admin', maintenance: '/maintenance' };
        return <Navigate to={redirects[currentUser.role] || '/login'} replace />;
    }
    return children;
}

function AppRoutes() {
    const { currentUser } = useAuth();
    const defaultRedirect = currentUser
        ? { student: '/student', admin: '/admin', maintenance: '/maintenance' }[currentUser.role]
        : '/login';

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/student"
                element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}
            />
            <Route
                path="/student/report"
                element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard initialTab="report" /></ProtectedRoute>}
            />
            <Route
                path="/student/issues"
                element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard initialTab="issues" /></ProtectedRoute>}
            />

            <Route
                path="/admin"
                element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
                path="/admin/issues"
                element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
                path="/admin/analytics"
                element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
                path="/admin/staff"
                element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />

            <Route
                path="/maintenance"
                element={<ProtectedRoute allowedRoles={['maintenance']}><MaintenanceDashboard /></ProtectedRoute>}
            />
            <Route
                path="/maintenance/assigned"
                element={<ProtectedRoute allowedRoles={['maintenance']}><MaintenanceDashboard /></ProtectedRoute>}
            />
            <Route
                path="/maintenance/resolved"
                element={<ProtectedRoute allowedRoles={['maintenance']}><MaintenanceDashboard /></ProtectedRoute>}
            />

            <Route
                path="/issues/:id"
                element={<ProtectedRoute><IssueDetailPage /></ProtectedRoute>}
            />

            <Route
                path="/settings"
                element={<ProtectedRoute><div className="p-8 text-slate-500 text-sm">Settings coming soon…</div></ProtectedRoute>}
            />

            <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
            <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
