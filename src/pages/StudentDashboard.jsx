import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import IssueCard from '../components/IssueCard';
import LLMAnalysisPreview from '../components/LLMAnalysisPreview';
import { getIssues, createIssue, analyzeLLM } from '../services/mockApi';
import { categories } from '../data/mockData';
import { PlusCircle, ClipboardList, Upload, Send, Loader2, CheckCircle, Sparkles } from 'lucide-react';

export default function StudentDashboard() {
    const { currentUser } = useAuth();
    const [tab, setTab] = useState('report');
    const [issues, setIssues] = useState([]);
    const [loadingIssues, setLoadingIssues] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', category: categories[0], location: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedIssue, setSubmittedIssue] = useState(null);
    const fileRef = useRef();
    const debRef = useRef();
    const [llmLoading, setLlmLoading] = useState(false);
    const [llmResult, setLlmResult] = useState(null);

    /* Debounced LLM analysis */
    useEffect(() => {
        if (form.description.length < 15) { setLlmResult(null); return; }
        clearTimeout(debRef.current);
        debRef.current = setTimeout(async () => {
            setLlmLoading(true); setLlmResult(null);
            const res = await analyzeLLM(form.title, form.description);
            setLlmResult(res); setLlmLoading(false);
        }, 1100);
        return () => clearTimeout(debRef.current);
    }, [form.description, form.title]);

    /* Load issues tab */
    useEffect(() => {
        if (tab !== 'issues') return;
        setLoadingIssues(true);
        getIssues({ reportedBy: currentUser?.id }).then(d => { setIssues(d); setLoadingIssues(false); });
    }, [tab, currentUser?.id]);

    const handleImage = (e) => {
        const file = e.target.files[0]; if (!file) return;
        const r = new FileReader();
        r.onload = ev => setImagePreview(ev.target.result);
        r.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim() || !form.location.trim()) return;
        setSubmitting(true);
        const issue = await createIssue({
            ...form,
            priority: llmResult?.priority || 'Medium',
            llmPriority: llmResult?.priority || 'Medium',
            duplicate: llmResult?.isDuplicate || false,
            reportedBy: currentUser?.id,
            reportedByName: currentUser?.name,
        });
        setSubmittedIssue(issue); setSubmitting(false); setSubmitted(true);
        setForm({ title: '', description: '', category: categories[0], location: '' });
        setImagePreview(null); setLlmResult(null);
    };

    const inputCls = "w-full border border-canvas rounded-xl px-3.5 py-2.5 text-sm text-ink bg-white placeholder-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/60 transition-all";

    return (
        <Layout>
            {/* Page header */}
            <div className="mb-7">
                <p className="text-xs uppercase tracking-widest text-ink/30 font-semibold mb-1">Student Portal</p>
                <h1 className="font-display text-2xl font-bold text-ink">
                    Hey {currentUser?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm text-ink/50 mt-1">See something broken? Get it fixed.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-canvas p-1 rounded-xl w-fit mb-6">
                {[
                    { id: 'report', icon: PlusCircle, label: 'Report Issue' },
                    { id: 'issues', icon: ClipboardList, label: 'My Issues' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${tab === t.id
                                ? 'bg-white text-ink shadow-sm shadow-ink/5'
                                : 'text-ink/40 hover:text-ink/70'}`}
                    >
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── REPORT TAB ── */}
            {tab === 'report' && (
                <div className="grid lg:grid-cols-5 gap-6 animate-fade-up">
                    {/* Form col — 3/5 */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-card border border-canvas shadow-card overflow-hidden">

                            {submitted ? (
                                <div className="flex flex-col items-center text-center py-12 px-6 gap-5 animate-pop-in">
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-ink">Submitted! 🎉</h3>
                                        <p className="text-sm text-ink/50 mt-2 leading-relaxed">
                                            <strong className="text-accent">{submittedIssue?.id}</strong> is in the queue.
                                            <br />We'll get someone on it ASAP.
                                        </p>
                                    </div>
                                    <div className="flex gap-3 w-full max-w-xs">
                                        <button onClick={() => { setSubmitted(false); setSubmittedIssue(null); }}
                                            className="flex-1 btn-glow px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold">
                                            Report Another
                                        </button>
                                        <button onClick={() => setTab('issues')}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-canvas text-ink text-sm font-bold hover:bg-canvas transition-colors">
                                            View Issues
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="px-6 pt-6 pb-4 border-b border-canvas">
                                        <h2 className="font-display text-lg font-bold text-ink">Report an Issue</h2>
                                        <p className="text-xs text-ink/40 mt-0.5">Takes less than a minute.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                        {/* Title */}
                                        <div>
                                            <label className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-2 block">Title *</label>
                                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                                placeholder="Short summary, e.g. 'Broken sink in Block A washroom'" required className={inputCls} />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-2 block flex items-center gap-1.5">
                                                Description *
                                                <span className="normal-case font-normal text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5" /> AI reads this
                                                </span>
                                            </label>
                                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                                rows={4} required placeholder="What's wrong? When did it start? Is it a safety risk?"
                                                className={`${inputCls} resize-none`} />
                                            {form.description.length > 0 && (
                                                <p className="text-[10px] text-ink/30 mt-1.5 text-right">
                                                    {form.description.length} chars — AI analysis fires automatically ⚡
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-2 block">Category</label>
                                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                    className={inputCls}>
                                                    {categories.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-2 block">Location *</label>
                                                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                                    placeholder="Block B, Room 204" required className={inputCls} />
                                            </div>
                                        </div>

                                        {/* Image upload */}
                                        <div>
                                            <label className="text-xs font-bold text-ink/50 uppercase tracking-widest mb-2 block">Photo (optional)</label>
                                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                                            <button type="button" onClick={() => fileRef.current.click()}
                                                className="w-full border-2 border-dashed border-canvas rounded-xl py-5 flex flex-col items-center gap-2
                          text-ink/30 hover:border-accent/40 hover:text-accent/50 hover:bg-indigo-50/40 transition-all">
                                                {imagePreview
                                                    ? <img src={imagePreview} alt="Preview" className="w-full max-h-32 object-cover rounded-lg" />
                                                    : <><Upload className="w-6 h-6" /><span className="text-xs font-medium">Drop or click to upload</span></>
                                                }
                                            </button>
                                        </div>

                                        <button type="submit" disabled={submitting}
                                            className="w-full btn-glow flex items-center justify-center gap-2.5
                        bg-ink text-white rounded-xl py-3 text-sm font-bold
                        disabled:opacity-50 transition-colors">
                                            {submitting
                                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                                                : <><Send className="w-4 h-4" /> Submit Issue</>
                                            }
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {/* AI panel col — 2/5 */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-card border border-canvas shadow-card overflow-hidden">
                            <div className="px-5 pt-5 pb-4 border-b border-canvas">
                                <h2 className="font-display text-base font-bold text-ink">AI Analysis</h2>
                                <p className="text-xs text-ink/40 mt-0.5">Auto-runs as you describe the issue.</p>
                            </div>
                            <div className="p-5">
                                {(llmLoading || llmResult) ? (
                                    <LLMAnalysisPreview loading={llmLoading} result={llmResult} />
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-8 text-ink/25 animate-fade-up">
                                        <div className="w-14 h-14 rounded-2xl bg-canvas flex items-center justify-center">
                                            <Sparkles className="w-7 h-7" />
                                        </div>
                                        <p className="text-xs text-center leading-relaxed max-w-[180px]">
                                            Start typing your description to see the AI predict priority & detect duplicates
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-card border border-indigo-100 p-4">
                            <p className="text-sm font-bold text-indigo-900 mb-2">💡 Better reports = faster fixes</p>
                            <ul className="space-y-1.5 text-xs text-indigo-700/80 leading-relaxed">
                                <li>• Name the exact room or area</li>
                                <li>• Mention when it started</li>
                                <li>• If it's a safety risk — say so explicitly</li>
                                <li>• AI uses your description to set priority</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MY ISSUES TAB ── */}
            {tab === 'issues' && (
                <div className="animate-fade-up">
                    {loadingIssues ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => <div key={i} className="shimmer h-44 rounded-card" />)}
                        </div>
                    ) : issues.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="font-display text-xl font-bold text-ink/40">All quiet on your end</h3>
                            <p className="text-sm text-ink/30 mt-2">Once you report an issue it'll show up here.</p>
                            <button onClick={() => setTab('report')}
                                className="mt-6 btn-glow px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-bold inline-flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Report your first issue
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-ink/30 uppercase tracking-widest font-semibold mb-4">
                                {issues.length} issue{issues.length !== 1 ? 's' : ''} reported by you
                            </p>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {issues.map((issue, i) => (
                                    <div key={issue.id} style={{ animationDelay: `${i * 50}ms` }}>
                                        <IssueCard issue={issue} />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </Layout>
    );
}
