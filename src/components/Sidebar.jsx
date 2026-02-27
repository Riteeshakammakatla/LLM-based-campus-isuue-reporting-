import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, ClipboardList, Wrench,
    BarChart2, Users, Settings, X,
} from 'lucide-react';

const navConfig = {
    student: [
        { to: '/student', icon: LayoutDashboard, label: 'Overview' },
        { to: '/student/report', icon: PlusCircle, label: 'Report Issue', hot: true },
        { to: '/student/issues', icon: ClipboardList, label: 'My Issues' },
    ],
    admin: [
        { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { to: '/admin/issues', icon: ClipboardList, label: 'All Issues' },
        { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
        { to: '/admin/staff', icon: Users, label: 'Staff' },
    ],
    maintenance: [
        { to: '/maintenance', icon: LayoutDashboard, label: 'Overview' },
        { to: '/maintenance/assigned', icon: Wrench, label: 'My Queue', hot: true },
        { to: '/maintenance/resolved', icon: ClipboardList, label: 'Completed' },
    ],
};

const roleMeta = {
    student: { label: 'Student Portal', dot: 'bg-indigo-500' },
    admin: { label: 'Admin Console', dot: 'bg-violet-500' },
    maintenance: { label: 'Field Dashboard', dot: 'bg-amber-500' },
};

export default function Sidebar({ open, onClose }) {
    const { currentUser } = useAuth();
    const links = navConfig[currentUser?.role] || [];
    const meta = roleMeta[currentUser?.role] || roleMeta.student;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />
            )}

            <aside className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-60 flex flex-col z-20
        bg-paper border-r border-canvas transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

                {/* Role label */}
                <div className="px-4 py-3 border-b border-canvas lg:flex hidden items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-widest">{meta.label}</span>
                </div>

                {/* Mobile close */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-canvas lg:hidden">
                    <span className="text-xs font-semibold text-ink/50 uppercase tracking-widest">Navigation</span>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-canvas text-ink/40">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    {links.map(({ to, icon: Icon, label, hot }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to.split('/').length <= 2}
                            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative
                ${isActive
                                    ? 'bg-ink text-white shadow-sm'
                                    : 'text-ink/60 hover:bg-canvas hover:text-ink'}`
                            }
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{label}</span>
                            {hot && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose flex-shrink-0">
                                    <span className="sr-only">Active</span>
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-canvas">
                    <NavLink
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink/40 hover:bg-canvas hover:text-ink transition-all"
                    >
                        <Settings className="w-4 h-4" /> Settings
                    </NavLink>
                </div>
            </aside>
        </>
    );
}
