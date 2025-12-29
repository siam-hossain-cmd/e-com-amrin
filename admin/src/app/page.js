'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function Home() {
  const router = useRouter();
  const { admin, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (admin) {
        // User is logged in, go to dashboard
        router.push('/dashboard');
      } else {
        // User is not logged in, go to login
        router.push('/login');
      }
    }
  }, [admin, loading, router]);

  // Show loading spinner while checking auth
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-main)'
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
