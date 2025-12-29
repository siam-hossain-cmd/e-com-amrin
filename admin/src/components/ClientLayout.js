'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';

// Layout wrapper that conditionally shows sidebar
function LayoutContent({ children }) {
    const pathname = usePathname();
    const { admin, loading } = useAdminAuth();

    // Pages that should not show sidebar
    const noSidebarPages = ['/login', '/register', '/forgot-password'];
    const isAuthPage = noSidebarPages.some(page => pathname.startsWith(page));

    // Show loading spinner while checking auth
    if (loading && !isAuthPage) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e5e7eb',
                    borderTopColor: '#c4a77d',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Auth pages (login, register) - no sidebar
    if (isAuthPage) {
        return <>{children}</>;
    }

    // Dashboard pages - show sidebar
    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default function ClientLayout({ children }) {
    return (
        <AdminAuthProvider>
            <LayoutContent>{children}</LayoutContent>
        </AdminAuthProvider>
    );
}
