import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const mockUsers = {
    student: { id: 'u1', name: 'Priya Sharma', email: 'priya@campus.edu', role: 'student', avatar: 'PS' },
    admin: { id: 'u2', name: 'Dr. Rajesh Kumar', email: 'admin@campus.edu', role: 'admin', avatar: 'RK' },
    maintenance: { id: 'u3', name: 'Suresh Mehta', email: 'suresh@campus.edu', role: 'maintenance', avatar: 'SM' },
};

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('campusUser');
        if (stored) {
            try { setCurrentUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        const user = mockUsers[role];
        setCurrentUser(user);
        localStorage.setItem('campusUser', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('campusUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
