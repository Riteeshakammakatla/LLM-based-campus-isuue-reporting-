import { MapPin, Tag, Calendar, User, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { staff } from '../data/mockData';

const categoryAccent = {
    'Electrical': 'accent-bar-amber',
    'Plumbing': 'accent-bar-indigo',
    'IT & Network': 'accent-bar-violet',
    'Cleaning': 'accent-bar-sage',
    'Infrastructure': 'accent-bar-rose',
    'Safety & Security': 'accent-bar-rose',
    'HVAC': 'accent-bar-indigo',
    'Other': 'accent-bar-indigo',
};

function fmt(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function IssueCard({ issue, actions }) {
    const assignedStaff = staff.find(s => s.id === issue.assignedTo);
    const bar = categoryAccent[issue.category] || 'accent-bar-indigo';

    return (
        <div className={`group relative bg-white rounded-card border border-canvas card-lift
      overflow-hidden animate-fade-up ${bar}`}>

            <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <Link
                            to={`/issues/${issue.id}`}
                            className="block text-sm font-bold text-ink hover:text-accent transition-colors line-clamp-2 leading-snug"
                        >
                            {issue.title}
                        </Link>
                        <span className="text-[10px] font-mono text-ink/30 mt-1 block">{issue.id}</span>
                    </div>
                    <Link
                        to={`/issues/${issue.id}`}
                        className="flex-shrink-0 w-7 h-7 rounded-lg border border-canvas flex items-center justify-center text-ink/30 opacity-0 group-hover:opacity-100 hover:border-accent hover:text-accent transition-all"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <StatusBadge value={issue.status} type="status" size="xs" />
                    <StatusBadge value={issue.priority} type="priority" size="xs" />
                    {issue.duplicate && (
                        <span className="chip text-[10px] bg-amber-50 text-amber-600 border border-amber-200">⚠ Duplicate</span>
                    )}
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-[11px] text-ink/45">
                    <div className="flex items-center gap-1.5"><Tag className="w-3 h-3 flex-shrink-0" /><span>{issue.category}</span></div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{issue.location}</span></div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{fmt(issue.createdAt)}</span>
                        {assignedStaff && <><span className="mx-1 text-ink/20">·</span><User className="w-3 h-3 flex-shrink-0" /><span>{assignedStaff.name}</span></>}
                    </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-ink/50 line-clamp-2 leading-relaxed border-t border-canvas pt-3">
                    {issue.description}
                </p>

                {actions && <div className="mt-3 pt-3 border-t border-canvas">{actions}</div>}
            </div>
        </div>
    );
}
