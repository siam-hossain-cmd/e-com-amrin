'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';

// Layout wrapper that conditionally shows sidebar and protects routes
function LayoutContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { admin, loading } = useAdminAuth();

    // Pages that should not require authentication
    const publicPages = ['/login', '/register', '/forgot-password'];
    const isPublicPage = publicPages.some(page => pathname.startsWith(page));

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (!loading && !admin && !isPublicPage) {
            router.replace('/login');
        }
    }, [admin, loading, isPublicPage, router]);

    // Show loading spinner while checking auth
    if (loading) {
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

    // Public pages (login, register) - no sidebar, no auth required
    if (isPublicPage) {
        return <>{children}</>;
    }

    // Not logged in and not on public page - show loading (will redirect)
    if (!admin) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f9fa'
            }}>
                <div>Redirecting to login...</div>
            </div>
        );
    }

    // Dashboard pages - user is authenticated, show sidebar
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
