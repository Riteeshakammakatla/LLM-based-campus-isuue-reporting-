import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
    {
        id: 'student',
        emoji: '🎓',
        title: 'Student',
        subtitle: 'Student & Staff',
        blurb: 'Spotted something broken?\nReport it in 60 seconds.',
        accent: 'from-indigo-500 to-violet-600',
        ring: 'ring-indigo-200',
        hover: 'hover:border-indigo-300 hover:shadow-indigo-100',
        tag: 'Reporter',
        tagBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        gradientText: 'from-indigo-500 to-violet-600',
        btnBg: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700',
        googleBorder: 'border-indigo-200 hover:border-indigo-400',
        linkColor: 'text-indigo-600 hover:text-indigo-700',
        placeholderEmail: 'priya@campus.edu',
    },
    {
        id: 'admin',
        emoji: '🛡️',
        title: 'Admin',
        subtitle: 'Administrator',
        blurb: 'Total visibility.\nAssign, track, close.',
        accent: 'from-violet-500 to-purple-700',
        ring: 'ring-violet-200',
        hover: 'hover:border-violet-300 hover:shadow-violet-100',
        tag: 'Admin',
        tagBg: 'bg-violet-50 text-violet-600 border-violet-100',
        gradientText: 'from-violet-500 to-purple-700',
        btnBg: 'bg-gradient-to-r from-violet-500 to-purple-700 hover:from-violet-600 hover:to-purple-800',
        googleBorder: 'border-violet-200 hover:border-violet-400',
        linkColor: 'text-violet-600 hover:text-violet-700',
        placeholderEmail: 'admin@campus.edu',
    },
    {
        id: 'maintenance',
        emoji: '🔧',
        title: 'Maintenance',
        subtitle: 'Maintenance Staff',
        blurb: 'Your queue.\nYour tools.\nGet it done.',
        accent: 'from-amber-500 to-orange-500',
        ring: 'ring-amber-200',
        hover: 'hover:border-amber-300 hover:shadow-amber-100',
        tag: 'Field Staff',
        tagBg: 'bg-amber-50 text-amber-600 border-amber-100',
        gradientText: 'from-amber-500 to-orange-500',
        btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
        googleBorder: 'border-amber-200 hover:border-amber-400',
        linkColor: 'text-amber-600 hover:text-amber-700',
        placeholderEmail: 'suresh@campus.edu',
    },
];

const redirectMap = { student: '/student', admin: '/admin', maintenance: '/maintenance' };

// ── Google SVG icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

// ── Eye / Eye-off SVG icons ──────────────────────────────────────────────────
function EyeIcon({ open }) {
    return open ? (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ) : (
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

// ── Role selection card ──────────────────────────────────────────────────────
function RoleCard({ role, index, onSelect }) {
    return (
        <button
            onClick={() => onSelect(role)}
            style={{ animationDelay: `${index * 80}ms` }}
            className={`
                animate-fade-up group text-left rounded-card p-5 border bg-white
                shadow-card card-lift transition-all duration-300 cursor-pointer
                border-canvas ${role.hover}
            `}
        >
            <div className={`h-1 rounded-full bg-gradient-to-r ${role.accent} mb-5 opacity-80`} />
            <div className="text-3xl mb-4 transition-transform duration-200 group-hover:scale-110 inline-block">
                {role.emoji}
            </div>
            <span className={`chip text-[10px] border mb-3 block w-fit ${role.tagBg}`}>{role.tag}</span>
            <h3 className="font-display text-lg font-bold text-ink mb-2">{role.subtitle}</h3>
            <p className="text-sm text-ink/45 leading-relaxed whitespace-pre-line">{role.blurb}</p>
            <div className="mt-4 pt-3 border-t border-canvas flex items-center gap-1.5 text-xs text-ink/35 font-medium">
                <span>Sign in</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </button>
    );
}

// ── Role-specific login form ─────────────────────────────────────────────────
function LoginForm({ role, onBack }) {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const doLogin = async () => {
        setLoading(true);
        setError('');
        // Simulate auth delay
        await new Promise(r => setTimeout(r, 800));
        login(role.id);
        navigate(redirectMap[role.id], { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        if (!password.trim()) { setError('Please enter your password.'); return; }
        await doLogin();
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 900));
        login(role.id);
        navigate(redirectMap[role.id], { replace: true });
    };

    return (
        <div className="w-full max-w-md animate-fade-up">
            {/* Back button */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink/70 transition-colors duration-150 font-medium group"
            >
                <svg className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to role selection
            </button>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-canvas shadow-card p-8">

                {/* Role badge + heading */}
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.accent} flex items-center justify-center text-xl shadow-sm select-none`}>
                        {role.emoji}
                    </div>
                    <div>
                        <span className={`chip text-[10px] border mb-0.5 block w-fit ${role.tagBg}`}>{role.tag}</span>
                        <h2 className="font-display text-xl font-bold text-ink">{role.subtitle} Login</h2>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Google sign-in */}
                <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading || googleLoading}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border ${role.googleBorder} bg-white text-ink text-sm font-semibold transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-5`}
                >
                    {googleLoading
                        ? <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                        : <GoogleIcon />
                    }
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-canvas" />
                    <span className="text-[11px] text-ink/30 font-medium uppercase tracking-wider">or sign in with email</span>
                    <div className="flex-1 h-px bg-canvas" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-ink/50 mb-1.5 uppercase tracking-wide">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            placeholder={role.placeholderEmail}
                            disabled={loading || googleLoading}
                            className="w-full px-4 py-2.5 rounded-xl border border-canvas bg-paper text-ink text-sm placeholder-ink/25 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-150 disabled:opacity-50"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wide">
                                Password
                            </label>
                            <button
                                type="button"
                                className={`text-xs font-medium ${role.linkColor} transition-colors duration-150`}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError(''); }}
                                placeholder="••••••••"
                                disabled={loading || googleLoading}
                                className="w-full px-4 py-2.5 pr-10 rounded-xl border border-canvas bg-paper text-ink text-sm placeholder-ink/25 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-150 disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
                                tabIndex={-1}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className={`w-full py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm transition-all duration-200 ${role.btnBg} disabled:opacity-50 disabled:cursor-not-allowed mt-1`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Signing in…
                            </span>
                        ) : (
                            `Sign in as ${role.title}`
                        )}
                    </button>
                </form>

                {/* Sign up link */}
                <p className="mt-5 text-center text-sm text-ink/40">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        className={`font-semibold ${role.linkColor} transition-colors duration-150`}
                    >
                        Create account
                    </button>
                </p>
            </div>
        </div>
    );
}

// ── Main LoginPage ────────────────────────────────────────────────────────────
export default function LoginPage() {
    const [activeRole, setActiveRole] = useState(null);

    return (
        <div className="min-h-screen bg-paper flex flex-col">

            {/* Top nav bar */}
            <header className="border-b border-canvas bg-white px-6 py-4 flex items-center gap-3">
                <button
                    onClick={() => setActiveRole(null)}
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </button>
                <span className="font-display text-base font-bold text-ink">CampusAlert</span>
                <span className="ml-auto flex items-center gap-2 text-xs text-ink/40 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    System Operational
                </span>
            </header>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-14">

                {activeRole ? (
                    /* ── Login form for selected role ── */
                    <LoginForm role={activeRole} onBack={() => setActiveRole(null)} />
                ) : (
                    /* ── Role selection ── */
                    <>
                        {/* Hero */}
                        <div className="text-center mb-12 animate-fade-up max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                LLM Priority Classification · Duplicate Detection
                            </div>
                            <h1 className="font-display text-5xl sm:text-6xl font-bold text-ink leading-[1.05] mb-5">
                                Campus issues,{' '}
                                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                                    fixed faster.
                                </span>
                            </h1>
                            <p className="text-base text-ink/50 leading-relaxed max-w-md mx-auto">
                                AI-powered reporting system for your campus. Spot a problem, report it in under a minute — the system does the rest.
                            </p>
                        </div>

                        {/* Role label */}
                        <p className="text-xs uppercase tracking-[0.18em] text-ink/30 font-semibold mb-5">
                            — Choose your role to sign in —
                        </p>

                        {/* Role cards */}
                        <div className="grid md:grid-cols-3 gap-5 w-full max-w-3xl mb-12">
                            {roles.map((role, i) => (
                                <RoleCard key={role.id} role={role} index={i} onSelect={setActiveRole} />
                            ))}
                        </div>

                        {/* Stats strip */}
                        <div className="flex items-center gap-10 sm:gap-16 animate-fade-up" style={{ animationDelay: '250ms' }}>
                            {[
                                ['48', 'Issues Reported', 'text-indigo-600'],
                                ['6', 'Staff Members', 'text-violet-600'],
                                ['94%', 'SLA Compliance', 'text-emerald-600'],
                            ].map(([val, label, cls]) => (
                                <div key={label} className="text-center">
                                    <div className={`font-display text-2xl font-bold ${cls}`}>{val}</div>
                                    <div className="text-xs text-ink/30 mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-canvas px-6 py-4 text-center">
                <p className="text-xs text-ink/25">Demo environment · No real data transmitted · CampusAlert Smart Issue Reporting</p>
            </footer>
        </div>
    );
}
