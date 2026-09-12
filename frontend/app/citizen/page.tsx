'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RadarIcon, ShieldCheckIcon, LogOutIcon, LockIcon } from '@/app/components/icons';

export default function CitizenAccessPage() {
  const router = useRouter();
  const [user, setUser] = useState('citizen@cyberpehra.in');

  useEffect(() => {
    const isAuth = localStorage.getItem('cyberpehra_authenticated');
    if (!isAuth) { router.push('/login'); return; }
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('cyberpehra_user');
      if (storedUser) setUser(storedUser);
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cyberpehra_authenticated');
    localStorage.removeItem('cyberpehra_user');
    localStorage.removeItem('cyberpehra_role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between cyber-grid">
      <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-cyan-500/15 bg-slate-950/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <RadarIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white leading-none">CyberPehra</span>
            <p className="text-[10px] font-mono text-cyan-400">Citizen Services Portal</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
          <LogOutIcon className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <div className="w-full card p-7 sm:p-9 border border-cyan-500/30 bg-slate-900/80 backdrop-blur-xl text-center space-y-5 shadow-2xl shadow-cyan-950/30">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/20">
            <ShieldCheckIcon className="w-9 h-9" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10">
              Verified Public Session
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight">
              CITIZEN ACCESS
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Citizen services allow users to report and track cybercrime complaints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
              <span>AUTHENTICATED USER:</span>
              <span className="text-slate-200 font-semibold">{user}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-1.5">
              <span>ACCESS LEVEL:</span>
              <span className="text-cyan-400 font-semibold">PUBLIC CITIZEN REPORTING</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>SECURITY STATUS:</span>
              <span className="text-emerald-400 font-semibold">GRIEVANCE REGISTRY ACTIVE</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-400 leading-relaxed text-left">
            <p className="text-[11px] font-mono text-cyan-300 font-semibold mb-1">DEMONSTRATION NOTICE:</p>
            Citizen reporting telemetry feeds directly into the AI Cashout Prediction and Hotspot Detection engine used by Law Enforcement Agencies.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link href="/login" className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5">
              <LockIcon className="w-3.5 h-3.5" />
              Switch to LEA Command Portal
            </Link>
            <button onClick={handleLogout} className="w-full btn-secondary text-xs py-2.5">
              Terminate Session
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-cyan-500/10 py-2.5 px-6 text-center text-[10px] font-mono text-slate-500 bg-slate-950/85">
        CyberPehra • Secure Access
      </footer>
    </div>
  );
}