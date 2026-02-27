const colorMap = {
    blue: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-100', val: 'text-indigo-700', bar: 'accent-bar-indigo' },
    green: { bg: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100', val: 'text-emerald-700', bar: 'accent-bar-sage' },
    yellow: { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-100', val: 'text-amber-700', bar: 'accent-bar-amber' },
    red: { bg: 'bg-rose-600', light: 'bg-rose-50', border: 'border-rose-100', val: 'text-rose-700', bar: 'accent-bar-rose' },
    purple: { bg: 'bg-violet-600', light: 'bg-violet-50', border: 'border-violet-100', val: 'text-violet-700', bar: 'accent-bar-violet' },
};

export default function AnalyticsCard({ title, value, icon: Icon, color, subtitle }) {
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className={`relative group rounded-card border overflow-hidden card-lift animate-fade-up ${c.light} ${c.border} ${c.bar}`}>
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shadow-sm
            group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-ink/30 font-semibold">{title}</span>
                </div>
                <div className={`font-display text-4xl font-bold ${c.val} leading-none`}>{value}</div>
                {subtitle && <p className="text-[11px] text-ink/40 mt-2 font-medium">{subtitle}</p>}
            </div>
        </div>
    );
}
