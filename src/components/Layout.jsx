import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-paper">
            <Navbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="pt-16 lg:pl-60 min-h-screen">
                <div className="p-5 sm:p-7 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
