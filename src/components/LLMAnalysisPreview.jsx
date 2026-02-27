import { CheckCircle, AlertTriangle, Brain, Sparkles } from 'lucide-react';

const PC = {
    High: { cls: 'bg-rose-50 border-rose-200', txt: 'text-rose-700', icon: '🔴' },
    Medium: { cls: 'bg-amber-50 border-amber-200', txt: 'text-amber-700', icon: '🟡' },
    Low: { cls: 'bg-emerald-50 border-emerald-200', txt: 'text-emerald-700', icon: '🟢' },
};

export default function LLMAnalysisPreview({ loading, result }) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 animate-pop-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-200">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-indigo-900">Thinking…</p>
                        <p className="text-xs text-indigo-500/70">LLM reading your description</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                        {[0, 0.15, 0.3].map((d, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                                style={{ animationDelay: `${d}s` }} />
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="shimmer h-5 w-3/4" />
                    <div className="shimmer h-5 w-1/2" />
                    <div className="shimmer h-5 w-2/3" />
                </div>
            </div>
        );
    }

    if (!result) return null;

    const pc = PC[result.priority] || PC.Low;

    return (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4 animate-pop-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-indigo-900">Analysis done</p>
                    <p className="text-xs text-indigo-500/70">{result.confidence}% confidence</p>
                </div>
                <span className="chip bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px]">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className={`rounded-xl border p-3 ${pc.cls}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">Priority</p>
                    <div className={`flex items-center gap-1.5 font-bold text-sm ${pc.txt}`}>
                        <span className="text-base">{pc.icon}</span> {result.priority}
                    </div>
                    <p className="text-[10px] text-ink/30 mt-1">From description keywords</p>
                </div>

                {/* Duplicate */}
                <div className={`rounded-xl border p-3 ${result.isDuplicate ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1.5">Duplicate?</p>
                    <div className={`flex items-center gap-1.5 font-bold text-sm ${result.isDuplicate ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {result.isDuplicate
                            ? <><AlertTriangle className="w-4 h-4" /> Likely</>
                            : <><CheckCircle className="w-4 h-4" /> Unique</>
                        }
                    </div>
                    <p className="text-[10px] text-ink/30 mt-1">
                        {result.isDuplicate ? 'Similar report exists' : 'No similar reports'}
                    </p>
                </div>
            </div>
        </div>
    );
}
