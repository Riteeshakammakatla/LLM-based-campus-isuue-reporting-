import { useState, useRef, useEffect } from 'react';
import { Bell, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { initialNotifications } from '../data/mockData';

const roleChip = {
    student: { label: 'Student', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    admin: { label: 'Admin', cls: 'bg-violet-100 text-violet-700 border-violet-200' },
    maintenance: { label: 'Field Staff', cls: 'bg-amber-100  text-amber-700  border-amber-200' },
};

export default function Navbar({ onToggleSidebar }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [notifs, setNotifs] = useState(initialNotifications);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notifRef = useRef();
    const profileRef = useRef();

    const unread = notifs.filter(n => !n.read).length;
    const chip = roleChip[currentUser?.role] || roleChip.student;

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
            if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

    return (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center px-4 gap-4
      bg-paper/80 backdrop-blur-xl border-b border-canvas shadow-[0_1px_0_rgba(13,15,26,0.06)]">

            {/* Hamburger */}
            <button
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded-xl hover:bg-canvas transition-colors text-ink/60"
                aria-label="Toggle sidebar"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Wordmark */}
            <div className="flex items-center gap-2.5 select-none">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div className="hidden sm:block leading-none">
                    <span className="font-display text-base font-bold text-ink">CampusAlert</span>
                    <span className="hidden md:block text-[10px] text-ink/40 tracking-wide mt-0.5">Issue Reporting System</span>
                </div>
            </div>

            <div className="flex-1" />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
                <button
                    onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
                    className="relative w-9 h-9 rounded-xl hover:bg-canvas transition-colors flex items-center justify-center text-ink/60 hover:text-ink"
                >
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose opacity-60" />
                        </span>
                    )}
                </button>

                {showNotifs && (
                    <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-lift border border-canvas animate-pop-in z-50 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-canvas">
                            <div>
                                <p className="text-sm font-bold text-ink">Notifications</p>
                                {unread > 0 && <p className="text-xs text-ink/40">{unread} unread</p>}
                            </div>
                            {unread > 0 && (
                                <button onClick={markAllRead} className="text-xs text-accent font-semibold hover:underline">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-canvas/50">
                            {notifs.map(n => (
                                <div key={n.id}
                                    className={`px-4 py-3 flex gap-3 items-start hover:bg-paper/80 transition-colors
                    ${!n.read ? 'bg-indigo-50/60' : ''}`}>
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-accent' : 'bg-canvas'}`} />
                                    <div>
                                        <p className="text-sm text-ink/80 leading-snug">{n.message}</p>
                                        <p className="text-xs text-ink/30 mt-1">{n.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
                <button
                    onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-canvas transition-colors"
                >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {currentUser?.avatar || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-xs font-semibold text-ink leading-none">{currentUser?.name?.split(' ')[0]}</p>
                        <span className={`chip text-[10px] border mt-0.5 ${chip.cls}`}>{chip.label}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-ink/40 hidden sm:block" />
                </button>

                {showProfile && (
                    <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-lift border border-canvas animate-pop-in z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-canvas">
                            <p className="text-sm font-bold text-ink">{currentUser?.name}</p>
                            <p className="text-xs text-ink/40 truncate mt-0.5">{currentUser?.email}</p>
                        </div>
                        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink/70 hover:bg-paper transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                        </button>
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose hover:bg-rose/5 transition-colors border-t border-canvas"
                        >
                            <LogOut className="w-4 h-4" /> Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
