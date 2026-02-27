import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import AnalyticsCard from '../components/AnalyticsCard';
import { getIssues, assignIssue } from '../services/mockApi';
import { categories, staff } from '../data/mockData';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved'];
const priorities = ['All', 'High', 'Medium', 'Low'];

function getSLA(issue) {
    if (issue.status === 'Resolved') return { label: 'Resolved', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    const pct = (Date.now() - new Date(issue.createdAt)) / (new Date(issue.slaDeadline) - new Date(issue.createdAt)) * 100;
    if (pct < 60) return { label: 'On Track', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (pct < 100) return { label: 'At Risk', cls: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: '⚠ Overdue', cls: 'text-rose-700   bg-rose-50   border-rose-200' };
}

function fmt(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const selectCls = "border border-canvas bg-white rounded-xl px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30";

export default function AdminDashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: 'All', category: 'All', priority: 'All' });
    const [assigning, setAssigning] = useState({});

    const load = async () => {
        setLoading(true);
        const data = await getIssues({
            status: filters.status !== 'All' ? filters.status : undefined,
            category: filters.category !== 'All' ? filters.category : undefined,
            priority: filters.priority !== 'All' ? filters.priority : undefined,
        });
        setIssues(data); setLoading(false);
    };
    useEffect(() => { load(); }, [filters]);

    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'Resolved').length;
    const pending = issues.filter(i => i.status === 'Pending').length;
    const highPri = issues.filter(i => i.priority === 'High').length;

    const handleAssign = async (issueId, staffId) => {
        if (!staffId) return;
        setAssigning(a => ({ ...a, [issueId]: true }));
        await assignIssue(issueId, staffId);
        setAssigning(a => ({ ...a, [issueId]: false }));
        await load();
    };

    return (
        <Layout>
            {/* Header */}
            <div className="flex items-start justify-between mb-7 gap-4">
                <div>
                    <p className="text-xs uppercase tracking-widest text-ink/30 font-semibold mb-1">Admin Console</p>
                    <h1 className="font-display text-2xl font-bold text-ink">All Issues</h1>
                    <p className="text-sm text-ink/50 mt-1">Assign, track, and close every complaint on campus.</p>
                </div>
                <button onClick={load}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-canvas bg-white hover:bg-canvas transition-colors text-sm font-semibold text-ink/60 hover:text-ink shadow-sm">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <AnalyticsCard title="Total" value={loading ? '—' : total} icon={ClipboardList} color="blue" subtitle="All time" />
                <AnalyticsCard title="Resolved" value={loading ? '—' : resolved} icon={CheckCircle} color="green" subtitle="Closed successfully" />
                <AnalyticsCard title="Pending" value={loading ? '—' : pending} icon={Clock} color="yellow" subtitle="Needs assignment" />
                <AnalyticsCard title="High Priority" value={loading ? '—' : highPri} icon={AlertTriangle} color="red" subtitle="Urgent" />
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-card border border-canvas shadow-card p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-ink/40" />
                    <span className="text-xs font-bold text-ink/50 uppercase tracking-widest">Filter</span>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div>
                        <p className="text-[10px] text-ink/30 font-semibold uppercase tracking-widest mb-1">Status</p>
                        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className={selectCls}>
                            {statuses.map(s => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <p className="text-[10px] text-ink/30 font-semibold uppercase tracking-widest mb-1">Category</p>
                        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} className={selectCls}>
                            <option>All</option>
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <p className="text-[10px] text-ink/30 font-semibold uppercase tracking-widest mb-1">Priority</p>
                        <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} className={selectCls}>
                            {priorities.map(p => <option key={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="self-end">
                        <button onClick={() => setFilters({ status: 'All', category: 'All', priority: 'All' })}
                            className="px-3 py-1.5 rounded-xl border border-canvas text-xs font-semibold text-ink/40 hover:text-ink hover:bg-canvas transition-colors">
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-card border border-canvas shadow-card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-canvas flex items-center justify-between">
                    <span className="text-sm font-bold text-ink">Issue List</span>
                    <span className="text-xs font-semibold text-ink/30 bg-canvas px-2.5 py-1 rounded-full">
                        {loading ? '…' : `${issues.length} result${issues.length !== 1 ? 's' : ''}`}
                    </span>
                </div>

                {loading ? (
                    <div className="p-5 space-y-3">
                        {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-12 rounded-xl" />)}
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-3">🎉</div>
                        <p className="font-display text-lg font-bold text-ink/30">Nothing matches these filters</p>
                        <p className="text-xs text-ink/20 mt-1">Try relaxing the filters above</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-canvas bg-paper/60">
                                    {['ID', 'Title', 'Category', 'Status', 'Priority', 'SLA', 'Date', 'Assign'].map(h => (
                                        <th key={h} className="text-left text-[10px] font-bold text-ink/30 uppercase tracking-widest px-4 py-3 whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-canvas/60">
                                {issues.map((issue, i) => {
                                    const sla = getSLA(issue);
                                    return (
                                        <tr key={issue.id} className="tbl-row hover:bg-indigo-50/30 transition-colors group animate-fade-up"
                                            style={{ animationDelay: `${i * 30}ms` }}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link to={`/issues/${issue.id}`}
                                                    className="font-mono text-xs font-bold text-accent hover:underline">{issue.id}</Link>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs">
                                                <Link to={`/issues/${issue.id}`}
                                                    className="font-semibold text-ink hover:text-accent transition-colors line-clamp-1 text-xs">
                                                    {issue.title}
                                                </Link>
                                                <p className="text-[10px] text-ink/30 mt-0.5 truncate">{issue.location}</p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-xs text-ink/50">{issue.category}</td>
                                            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={issue.status} type="status" size="xs" /></td>
                                            <td className="px-4 py-3 whitespace-nowrap"><StatusBadge value={issue.priority} type="priority" size="xs" /></td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`chip text-[10px] border ${sla.cls}`}>{sla.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] text-ink/40 whitespace-nowrap">{fmt(issue.createdAt)}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {issue.status === 'Resolved' ? (
                                                    <span className="text-[11px] text-emerald-600 font-semibold">✓ Done</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            defaultValue={issue.assignedTo || ''}
                                                            onChange={e => handleAssign(issue.id, e.target.value)}
                                                            disabled={assigning[issue.id]}
                                                            className="border border-canvas rounded-lg px-2 py-1 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white disabled:opacity-40 max-w-[140px]"
                                                        >
                                                            <option value="">Assign to…</option>
                                                            {staff.map(s => (
                                                                <option key={s.id} value={s.id}>{s.name} {!s.available ? '(busy)' : ''}</option>
                                                            ))}
                                                        </select>
                                                        {assigning[issue.id] && (
                                                            <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
