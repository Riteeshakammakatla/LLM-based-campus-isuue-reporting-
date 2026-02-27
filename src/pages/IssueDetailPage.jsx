import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import LLMAnalysisPreview from '../components/LLMAnalysisPreview';
import { getIssueById } from '../services/mockApi';
import { staff } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, Tag, Calendar, User, Clock, FileText } from 'lucide-react';

function fmt(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const STATUS_ORDER = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
const TIMELINE = [
    { status: 'Pending', desc: 'Issue filed by reporter. LLM analysis run.' },
    { status: 'Assigned', desc: 'Reviewed by Admin and assigned to maintenance.' },
    { status: 'In Progress', desc: 'Maintenance staff started working on the issue.' },
    { status: 'Resolved', desc: 'Issue resolved. Resolution notes filed.' },
];

export default function IssueDetailPage() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getIssueById(id).then(d => { setIssue(d); setLoading(false); });
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="space-y-4 max-w-2xl">
                    {[1, 2, 3].map(i => <div key={i} className={`shimmer rounded-card ${i === 1 ? 'h-24' : 'h-36'}`} />)}
                </div>
            </Layout>
        );
    }

    if (!issue) {
        return (
            <Layout>
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="font-display text-xl font-bold text-ink/40">Issue not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-5 px-4 py-2 rounded-xl border border-canvas text-sm font-semibold text-ink/50 hover:bg-canvas transition-colors">
                        ← Go back
                    </button>
                </div>
            </Layout>
        );
    }

    const assignedStaff = staff.find(s => s.id === issue.assignedTo);
    const currStatusIdx = STATUS_ORDER.indexOf(issue.status);

    return (
        <Layout>
            {/* Back */}
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink font-semibold mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* ── Left — 3 cols ── */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Main info card */}
                    <div className="bg-white rounded-card border border-canvas shadow-card overflow-hidden animate-fade-up">
                        <div className="p-6 border-b border-canvas">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h1 className="font-display text-xl font-bold text-ink leading-snug">{issue.title}</h1>
                                <span className="font-mono text-xs font-bold text-accent/60 flex-shrink-0">{issue.id}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <StatusBadge value={issue.status} type="status" size="sm" />
                                <StatusBadge value={issue.priority} type="priority" size="sm" />
                                {issue.duplicate && (
                                    <span className="chip text-xs bg-amber-50 text-amber-600 border border-amber-200">⚠ Duplicate</span>
                                )}
                            </div>
                        </div>

                        {/* Meta grid */}
                        <div className="grid sm:grid-cols-2 gap-px bg-canvas">
                            {[
                                { icon: Tag, label: 'Category', val: issue.category },
                                { icon: MapPin, label: 'Location', val: issue.location },
                                { icon: Calendar, label: 'Reported', val: fmt(issue.createdAt) },
                                { icon: Clock, label: 'SLA Deadline', val: fmt(issue.slaDeadline) },
                                { icon: User, label: 'Reported By', val: issue.reportedByName || 'Campus User' },
                                { icon: User, label: 'Assigned To', val: assignedStaff?.name || 'Unassigned' },
                            ].map(m => (
                                <div key={m.label} className="bg-white p-4">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <m.icon className="w-3 h-3 text-ink/30" />
                                        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">{m.label}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-ink">{m.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="p-6">
                            <div className="flex items-center gap-1.5 mb-2">
                                <FileText className="w-3.5 h-3.5 text-ink/30" />
                                <p className="text-xs font-bold text-ink/30 uppercase tracking-widest">Description</p>
                            </div>
                            <p className="text-sm text-ink/70 leading-relaxed">{issue.description}</p>
                        </div>

                        {/* Resolution note */}
                        {issue.resolutionNote && (
                            <div className="mx-6 mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> Resolution Note
                                </p>
                                <p className="text-sm text-emerald-800 leading-relaxed">{issue.resolutionNote}</p>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-card border border-canvas shadow-card p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <h3 className="font-display text-base font-bold text-ink mb-6">Activity Timeline</h3>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-canvas" />
                            {TIMELINE.map((step, i) => {
                                const done = STATUS_ORDER.indexOf(step.status) <= currStatusIdx;
                                const curr = step.status === issue.status;
                                return (
                                    <div key={step.status} className={`flex gap-4 relative ${i < TIMELINE.length - 1 ? 'mb-6' : ''}`}>
                                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10
                      ${curr ? 'bg-accent border-accent text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]' :
                                                done ? 'bg-emerald-100 border-emerald-300 text-emerald-600' :
                                                    'bg-canvas border-canvas text-ink/20'}`}>
                                            {done && !curr && <span className="text-sm">✓</span>}
                                            {curr && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <div className="pt-1.5">
                                            <p className={`text-sm font-bold ${done ? 'text-ink' : 'text-ink/30'}`}>{step.status}</p>
                                            <p className="text-xs text-ink/40 mt-0.5 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Right — 2 cols ── */}
                <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '150ms' }}>
                    {issue.llmAnalysis ? (
                        <LLMAnalysisPreview loading={false} result={issue.llmAnalysis} />
                    ) : (
                        <div className="bg-white rounded-card border border-canvas shadow-card p-6 text-center text-ink/30">
                            <div className="text-4xl mb-3">🧠</div>
                            <p className="text-sm font-medium">No AI analysis on record</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
