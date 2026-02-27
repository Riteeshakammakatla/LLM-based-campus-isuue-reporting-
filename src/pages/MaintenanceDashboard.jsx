import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { getIssues, updateIssueStatus } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { Wrench, CheckCircle, Loader2, MapPin, Tag, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const barMap = {
    Pending: 'border-l-4 border-l-amber-400',
    Assigned: 'border-l-4 border-l-indigo-400',
    'In Progress': 'border-l-4 border-l-violet-400',
    Resolved: 'border-l-4 border-l-emerald-400',
};

function fmt(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function IssueRow({ issue, onUpdate }) {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState(issue.resolutionNote || '');
    const [updating, setUpdating] = useState(false);

    const act = async (status) => {
        setUpdating(true);
        await onUpdate(issue.id, status, note);
        setUpdating(false);
    };

    const bar = barMap[issue.status] || 'border-l-4 border-l-indigo-400';

    return (
        <div className={`bg-white rounded-card border border-canvas shadow-card overflow-hidden ${bar} animate-fade-up`}>
            {/* Header */}
            <button
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-paper/60 transition-colors text-left"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-accent/70">{issue.id}</span>
                        <StatusBadge value={issue.status} type="status" size="xs" />
                        <StatusBadge value={issue.priority} type="priority" size="xs" />
                    </div>
                    <p className="text-sm font-bold text-ink line-clamp-1">{issue.title}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-[11px] text-ink/40">
                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{issue.category}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{issue.location}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmt(issue.createdAt)}</span>
                    </div>
                </div>
                <div className="text-ink/30 flex-shrink-0">
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded */}
            {open && (
                <div className="px-4 pb-4 pt-2 border-t border-canvas space-y-4 animate-fade-in">
                    <div>
                        <p className="text-[10px] text-ink/30 font-semibold uppercase tracking-widest mb-1.5">Description</p>
                        <p className="text-sm text-ink/70 leading-relaxed">{issue.description}</p>
                    </div>

                    {issue.status !== 'Resolved' && (
                        <div>
                            <p className="text-[10px] text-ink/30 font-semibold uppercase tracking-widest mb-1.5">Resolution Note</p>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                rows={3}
                                placeholder="Describe what you fixed…"
                                className="w-full border border-canvas rounded-xl px-3.5 py-2.5 text-sm text-ink bg-paper placeholder-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/60 transition-all resize-none"
                            />
                        </div>
                    )}

                    {issue.status !== 'Resolved' && (
                        <div className="flex gap-3 flex-wrap">
                            {issue.status !== 'In Progress' && (
                                <button
                                    onClick={() => act('In Progress')}
                                    disabled={updating}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700
                    text-white text-sm font-bold transition-colors disabled:opacity-50 shadow-sm shadow-violet-200"
                                >
                                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                                    Mark In Progress
                                </button>
                            )}
                            <button
                                onClick={() => act('Resolved')}
                                disabled={updating}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700
                  text-white text-sm font-bold transition-colors disabled:opacity-50 shadow-sm shadow-emerald-200"
                            >
                                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Mark Resolved
                            </button>
                        </div>
                    )}

                    {issue.status === 'Resolved' && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Resolved
                            </p>
                            {issue.resolutionNote && (
                                <p className="text-xs text-emerald-700/80 leading-relaxed">{issue.resolutionNote}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MaintenanceDashboard() {
    const { currentUser } = useAuth();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('active');

    const load = async () => {
        setLoading(true);
        const data = await getIssues({ assignedTo: currentUser?.id });
        setIssues(data); setLoading(false);
    };

    useEffect(() => { load(); }, [currentUser?.id]);

    const update = async (id, status, note) => {
        await updateIssueStatus(id, status, note);
        await load();
    };

    const active = issues.filter(i => i.status !== 'Resolved');
    const resolved = issues.filter(i => i.status === 'Resolved');
    const inProg = issues.filter(i => i.status === 'In Progress');

    return (
        <Layout>
            <div className="mb-7">
                <p className="text-xs uppercase tracking-widest text-ink/30 font-semibold mb-1">Field Dashboard</p>
                <h1 className="font-display text-2xl font-bold text-ink">Your Queue</h1>
                <p className="text-sm text-ink/50 mt-1">Work through these, note what you did, mark it done.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Assigned', count: issues.length, bg: 'bg-indigo-50', brd: 'border-indigo-100', txt: 'text-indigo-700' },
                    { label: 'In Progress', count: inProg.length, bg: 'bg-violet-50', brd: 'border-violet-100', txt: 'text-violet-700' },
                    { label: 'Completed', count: resolved.length, bg: 'bg-emerald-50', brd: 'border-emerald-100', txt: 'text-emerald-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.brd} rounded-card p-4 text-center animate-fade-up`}>
                        <div className={`font-display text-4xl font-bold ${s.txt} leading-none`}>
                            {loading ? '—' : s.count}
                        </div>
                        <div className={`text-xs font-semibold uppercase tracking-widest ${s.txt} mt-2 opacity-70`}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-canvas p-1 rounded-xl w-fit mb-5">
                {[
                    { id: 'active', icon: Wrench, label: `Active (${active.length})` },
                    { id: 'resolved', icon: CheckCircle, label: `Done (${resolved.length})` },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${tab === t.id ? 'bg-white text-ink shadow-sm' : 'text-ink/40 hover:text-ink/70'}`}>
                        <t.icon className="w-4 h-4" /> {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="shimmer h-20 rounded-card" />)}
                </div>
            ) : (
                <div className="space-y-3">
                    {(tab === 'active' ? active : resolved).length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-3">{tab === 'active' ? '🎉' : '📋'}</div>
                            <p className="font-display text-xl font-bold text-ink/40">
                                {tab === 'active' ? 'Queue is clear! Nice work.' : 'No completed issues yet.'}
                            </p>
                        </div>
                    ) : (
                        (tab === 'active' ? active : resolved).map((issue, i) => (
                            <div key={issue.id} style={{ animationDelay: `${i * 50}ms` }}>
                                <IssueRow issue={issue} onUpdate={update} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </Layout>
    );
}
