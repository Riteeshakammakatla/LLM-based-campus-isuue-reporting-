/* Status */
const S = {
    Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    Assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    'In Progress': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    Resolved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};
/* Priority */
const P = {
    High: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Low: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

export default function StatusBadge({ value, type = 'status', size = 'sm' }) {
    const config = type === 'priority' ? (P[value] || P.Low) : (S[value] || S.Pending);
    const sz = size === 'xs' ? 'text-[10px] px-2 py-0.5 gap-1' : 'text-[11px] px-2.5 py-1 gap-1.5';

    return (
        <span className={`chip border font-semibold ${sz} ${config.bg} ${config.text} ${config.border}`}>
            {type === 'status' && 'dot' in config && (
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
            )}
            {value}
        </span>
    );
}
