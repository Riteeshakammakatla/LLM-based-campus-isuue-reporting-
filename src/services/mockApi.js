import { initialIssues } from '../data/mockData';

// In-memory store (resets on page refresh — simulates backend state)
let issuesStore = [...initialIssues];
let nextId = issuesStore.length + 1;

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// ─── LLM Analysis Mock ────────────────────────────────────────────
const priorityKeywords = {
    High: ['leak', 'flood', 'fire', 'broken', 'hazard', 'danger', 'security', 'pothole', 'offline', 'not working', 'unsafe', 'slipping'],
    Medium: ['flickering', 'slow', 'wifi', 'ac', 'projector', 'dirty', 'smell', 'noise'],
    Low: ['dustbin', 'paint', 'minor', 'cosmetic', 'stain', 'small'],
};

function detectPriority(description) {
    const text = description.toLowerCase();
    if (priorityKeywords.High.some(k => text.includes(k))) return 'High';
    if (priorityKeywords.Medium.some(k => text.includes(k))) return 'Medium';
    return 'Low';
}

function detectDuplicate(title) {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const incoming = normalize(title);
    return issuesStore.some(issue => {
        const existing = normalize(issue.title);
        const overlap = incoming.split(' ').filter(w => w.length > 3 && existing.includes(w));
        return overlap.length >= 2;
    });
}

export async function analyzeLLM(title, description) {
    await delay(1400);
    return {
        priority: detectPriority(description),
        isDuplicate: detectDuplicate(title),
        confidence: Math.floor(Math.random() * 20) + 78, // 78–97%
        suggestedCategory: null,
    };
}

// ─── Issues CRUD ──────────────────────────────────────────────────
export async function getIssues(filters = {}) {
    await delay(400);
    let result = [...issuesStore];
    if (filters.status && filters.status !== 'All') result = result.filter(i => i.status === filters.status);
    if (filters.category && filters.category !== 'All') result = result.filter(i => i.category === filters.category);
    if (filters.priority && filters.priority !== 'All') result = result.filter(i => i.priority === filters.priority);
    if (filters.reportedBy) result = result.filter(i => i.reportedBy === filters.reportedBy);
    if (filters.assignedTo) result = result.filter(i => i.assignedTo === filters.assignedTo);
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getIssueById(id) {
    await delay(300);
    return issuesStore.find(i => i.id === id) || null;
}

export async function createIssue(data) {
    await delay(700);
    const padded = String(nextId).padStart(3, '0');
    const issue = {
        id: `ISS-${padded}`,
        ...data,
        status: 'Pending',
        assignedTo: null,
        reportedByName: data.reportedByName || 'Campus User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        resolutionNote: '',
        images: [],
    };
    nextId++;
    issuesStore = [issue, ...issuesStore];
    return issue;
}

export async function assignIssue(issueId, staffId) {
    await delay(500);
    issuesStore = issuesStore.map(i =>
        i.id === issueId
            ? { ...i, assignedTo: staffId, status: 'Assigned', updatedAt: new Date().toISOString() }
            : i
    );
    return issuesStore.find(i => i.id === issueId);
}

export async function updateIssueStatus(issueId, status, resolutionNote = '') {
    await delay(500);
    issuesStore = issuesStore.map(i =>
        i.id === issueId
            ? { ...i, status, resolutionNote, updatedAt: new Date().toISOString() }
            : i
    );
    return issuesStore.find(i => i.id === issueId);
}
