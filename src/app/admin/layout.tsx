"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AdminLoginModal } from '@/components/AdminLoginModal';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    const authStatus = sessionStorage.getItem('is_admin_authenticated') === 'true';
    if (authStatus) {
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      setIsAuthenticated(false);
      setShowLogin(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initial check
    checkAuth();
    
    // Listen for the custom login event for INSTANT activation without refresh
    const handleLoginSuccess = () => {
      checkAuth();
    };

    window.addEventListener('admin-login-success', handleLoginSuccess);
    
    // Safety interval just in case
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('admin-login-success', handleLoginSuccess);
      clearInterval(interval);
    };
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-[#01a3a4] animate-spin" />
        <p className="text-[10px] font-black text-[#01a3a4] uppercase tracking-widest">Accessing Terminal...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-600/10 border border-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 font-black text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">UNAUTHORIZED ACCESS</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">SECURE SESSION REQUIRED TO ACCESS ADMIN PANEL</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-[#01a3a4] hover:bg-white hover:text-black transition-all text-white px-10 py-4 font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl"
          >
            OPEN LOGIN TERMINAL
          </button>
        </div>
        <AdminLoginModal 
          isOpen={showLogin} 
          onClose={() => {
            const status = sessionStorage.getItem('is_admin_authenticated') === 'true';
            if (status) {
              setIsAuthenticated(true);
              setShowLogin(false);
            }
          }} 
        />
      </div>
    );
  }

  return <>{children}</>;
}
