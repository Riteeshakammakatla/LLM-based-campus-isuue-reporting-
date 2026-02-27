import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/* Each building on the fictional campus layout */
const BUILDINGS = [
    { id: 'block-a', label: 'Block A', x: 20, y: 20, w: 110, h: 70, keywords: ['block a', 'block-a'] },
    { id: 'block-b', label: 'Block B', x: 150, y: 20, w: 110, h: 70, keywords: ['block b', 'block-b'] },
    { id: 'block-c', label: 'Block C', x: 280, y: 20, w: 110, h: 70, keywords: ['block c', 'block-c'] },
    { id: 'block-d', label: 'Block D', x: 410, y: 20, w: 110, h: 70, keywords: ['block d', 'block-d'] },
    { id: 'library', label: 'Library', x: 20, y: 120, w: 130, h: 80, keywords: ['library', 'reading hall'] },
    { id: 'cafeteria', label: 'Cafeteria', x: 170, y: 120, w: 110, h: 80, keywords: ['cafeteria', 'canteen'] },
    { id: 'seminar', label: 'Seminar Hall', x: 300, y: 120, w: 110, h: 80, keywords: ['seminar', 'hall'] },
    { id: 'labs', label: 'Computer Labs', x: 430, y: 120, w: 90, h: 80, keywords: ['lab', 'labs', 'computer'] },
    { id: 'parking', label: 'Parking', x: 20, y: 230, w: 100, h: 60, keywords: ['parking', 'park'] },
    { id: 'gate', label: 'Main Gate', x: 140, y: 230, w: 120, h: 60, keywords: ['gate', 'entrance', 'main gate'] },
    { id: 'sports', label: 'Sports Ground', x: 280, y: 230, w: 240, h: 60, keywords: ['sports', 'ground', 'field'] },
];

function countIssues(building, issues) {
    return issues.filter(issue => {
        const loc = (issue.location || '').toLowerCase();
        return building.keywords.some(kw => loc.includes(kw));
    }).length;
}

function heatColor(count, isDark) {
    if (count === 0) return isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
    if (count === 1) return isDark ? 'rgba(251,191,36,0.18)' : 'rgba(251,191,36,0.22)';
    if (count <= 3) return isDark ? 'rgba(249,115,22,0.28)' : 'rgba(249,115,22,0.26)';
    return isDark ? 'rgba(248,113,113,0.40)' : 'rgba(220,38,38,0.30)';
}

function heatBorder(count, isDark) {
    if (count === 0) return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.10)';
    if (count === 1) return isDark ? 'rgba(251,191,36,0.45)' : 'rgba(251,191,36,0.55)';
    if (count <= 3) return isDark ? 'rgba(249,115,22,0.55)' : 'rgba(249,115,22,0.55)';
    return isDark ? 'rgba(248,113,113,0.70)' : 'rgba(220,38,38,0.60)';
}

function heatGlow(count, isDark) {
    if (!isDark || count === 0) return 'none';
    if (count === 1) return '0 0 12px rgba(251,191,36,0.25)';
    if (count <= 3) return '0 0 16px rgba(249,115,22,0.35)';
    return '0 0 24px rgba(248,113,113,0.50)';
}

export default function CampusHeatMap({ issues }) {
    const { isDark } = useTheme();

    const buildingData = useMemo(() =>
        BUILDINGS.map(b => ({ ...b, count: countIssues(b, issues) })),
        [issues]
    );

    const maxCount = Math.max(...buildingData.map(b => b.count), 1);

    return (
        <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div>
                    <p className="font-display" style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)' }}>Campus Issue Heat Map</p>
                    <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>
                        Active complaints by location — darker = more issues
                    </p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-2">
                    {[
                        { label: 'None', color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' },
                        { label: '1', color: isDark ? 'rgba(251,191,36,0.35)' : 'rgba(251,191,36,0.45)' },
                        { label: '2–3', color: isDark ? 'rgba(249,115,22,0.45)' : 'rgba(249,115,22,0.45)' },
                        { label: '4+', color: isDark ? 'rgba(248,113,113,0.55)' : 'rgba(220,38,38,0.45)' },
                    ].map(l => (
                        <div key={l.label} className="flex items-center gap-1">
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                            <span style={{ fontSize: 10, color: 'var(--txt-3)', fontWeight: 500 }}>{l.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '16px 16px 12px', overflowX: 'auto' }}>
                <svg viewBox="0 0 540 310" style={{ width: '100%', minWidth: 480, height: 'auto' }}>
                    {/* Background */}
                    <rect x="0" y="0" width="540" height="310" rx="10"
                        fill={isDark ? '#141720' : '#f4f1eb'} />

                    {/* Grid lines */}
                    {[60, 120, 180, 240, 300, 360, 420, 480].map(x => (
                        <line key={x} x1={x} y1="0" x2={x} y2="310"
                            stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                    ))}
                    {[60, 120, 180, 240].map(y => (
                        <line key={y} x1="0" y1={y} x2="540" y2={y}
                            stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} strokeWidth="1" />
                    ))}

                    {buildingData.map(b => (
                        <g key={b.id}>
                            {/* Building fill */}
                            <rect
                                x={b.x} y={b.y} width={b.w} height={b.h}
                                rx="8"
                                fill={heatColor(b.count, isDark)}
                                stroke={heatBorder(b.count, isDark)}
                                strokeWidth="1.5"
                                style={{ filter: heatGlow(b.count, isDark) !== 'none' ? `drop-shadow(${heatGlow(b.count, isDark)})` : 'none' }}
                            />

                            {/* Building label */}
                            <text
                                x={b.x + b.w / 2} y={b.y + b.h / 2 - (b.count > 0 ? 8 : 0)}
                                textAnchor="middle" dominantBaseline="middle"
                                fill={isDark ? 'rgba(255,255,255,0.65)' : 'rgba(13,15,26,0.65)'}
                                style={{ fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                            >
                                {b.label}
                            </text>

                            {/* Issue count bubble */}
                            {b.count > 0 && (
                                <>
                                    <circle
                                        cx={b.x + b.w / 2} cy={b.y + b.h / 2 + 12} r="12"
                                        fill={b.count >= 4 ? 'var(--s-crimson)' : b.count >= 2 ? '#f97316' : 'var(--s-amber)'}
                                        opacity={0.9}
                                    />
                                    <text
                                        x={b.x + b.w / 2} y={b.y + b.h / 2 + 12}
                                        textAnchor="middle" dominantBaseline="middle"
                                        fill="white"
                                        style={{ fontSize: 10, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {b.count}
                                    </text>
                                </>
                            )}
                        </g>
                    ))}

                    {/* Campus label */}
                    <text x="270" y="295" textAnchor="middle"
                        fill={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)'}
                        style={{ fontSize: 9, fontFamily: 'Inter', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        CAMPUS FLOOR PLAN — ISSUE DENSITY VIEW
                    </text>
                </svg>
            </div>
        </div>
    );
}
