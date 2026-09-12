'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  RadarIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, AlertIcon,
} from '@/app/components/icons';

type Role = 'LEA' | 'Citizen';

const THEMES: Record<Role, {
  accent: string; accent2: string; glow: string; heading: string; tagline: string;
  idLabel: string; idPlaceholder: string; passPlaceholder: string; target: string; lines: string[];
}> = {
  LEA: {
    accent: '#f59e0b', accent2: '#ef4444', glow: 'rgba(245, 158, 11, 0.45)',
    heading: 'LEA / Admin Login', tagline: 'COMMAND & CONTROL CLEARANCE',
    idLabel: 'OFFICER ID / EMAIL', idPlaceholder: 'Enter officer ID or email',
    passPlaceholder: 'Enter service passphrase', target: '/dashboard',
    lines: ['> VERIFYING LEA CLEARANCE…', '> BIOMETRIC HASH :: MATCHED', '> COMMAND TOKEN :: ISSUED', '> ACCESS GRANTED'],
  },
  Citizen: {
    accent: '#22d3ee', accent2: '#0ea5e9', glow: 'rgba(34, 211, 238, 0.45)',
    heading: 'Citizen Access', tagline: 'PUBLIC GRIEVANCE TERMINAL',
    idLabel: 'CITIZEN EMAIL', idPlaceholder: 'Enter citizen email',
    passPlaceholder: 'Enter password', target: '/citizen',
    lines: ['> VERIFYING CITIZEN SESSION…', '> DEVICE FINGERPRINT :: TRUSTED', '> GRIEVANCE TOKEN :: ISSUED', '> ACCESS GRANTED'],
  },
};

const BOOT = [
  '> INITIALIZING CYBERPEHRA SECURE SHELL...',
  '> HANDSHAKE :: AES-256-GCM / TLS 1.3',
  '> NODE CLUSTER :: MUM-01 · DEL-03 · BLR-07',
  '> THREAT INTEL FEEDS :: ONLINE',
  '> AWAITING OPERATOR CREDENTIALS_',
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('LEA');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [statusLines, setStatusLines] = useState<string[]>([]);
  const [granted, setGranted] = useState(false);


  const isLeaRole = role === 'LEA';
  const theme = THEMES[role];
  const accentVars = { '--accent': theme.accent, '--accent-2': theme.accent2, '--glow': theme.glow } as React.CSSProperties;

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setBootStep(i);
      if (i >= BOOT.length) { clearInterval(id); setTimeout(() => setReady(true), 300); }
    }, 300);
    return () => clearInterval(id);
  }, []);



  const handleRoleChange = (newRole: Role) => {
    if (loading || newRole === role) return;
    setRole(newRole); setErrorMessage(''); setFormTouched(false); setStatusLines([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setFormTouched(true); setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage(isLeaRole
        ? 'Please enter your Officer ID or email and password.'
        : 'Please enter your email and password.');
      return;
    }

    setLoading(true); setStatusLines([]);
    theme.lines.forEach((line, i) =>
      setTimeout(() => setStatusLines((prev) => [...prev, line]), 340 * (i + 1))
    );
    const doneAt = 340 * theme.lines.length + 200;

    setTimeout(() => {
      localStorage.setItem('cyberpehra_authenticated', 'true');
      localStorage.setItem('cyberpehra_role', role);
      localStorage.setItem('cyberpehra_user', username.trim());
      setGranted(true);
    }, doneAt);

    setTimeout(() => router.push(theme.target), doneAt + 1000);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] px-4 py-12" style={accentVars}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[280px] left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full blur-[130px] transition-all duration-700" style={{ background: 'var(--glow)', opacity: 0.55 }} />
        <div className="absolute -bottom-[240px] -right-[160px] h-[560px] w-[560px] rounded-full blur-[150px] transition-all duration-700" style={{ background: 'var(--glow)', opacity: 0.35 }} />
      </div>

      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-4 py-2.5 font-mono text-xs tracking-wider backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-2.5">
          <RadarIcon className="h-4 w-4 text-[color:var(--accent)]" />
          <span className="font-bold tracking-tight text-white font-display">CYBERPEHRA</span>
          <span className="hidden text-slate-600 sm:inline">|</span>
          <span className="hidden text-[11px] text-slate-400 sm:inline">PREDICTIVE CYBER INTELLIGENCE</span>
        </div>
        <Link href="/" className="flex items-center gap-1 text-xs font-medium text-[color:var(--accent)] transition-colors hover:brightness-125">
          ← Return to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-px rounded-[20px] opacity-60 blur-[3px] transition-all duration-700"
          style={{ background: 'linear-gradient(135deg, var(--accent), transparent 42%, transparent 58%, var(--accent-2))' }} />

        <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-slate-950/85 p-6 backdrop-blur-2xl sm:p-8">
          <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: 'var(--accent)' }} />
          <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2" style={{ borderColor: 'var(--accent)' }} />
          <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2" style={{ borderColor: 'var(--accent)' }} />
          <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2" style={{ borderColor: 'var(--accent)' }} />
          <div className="absolute inset-x-8 top-0 h-px transition-all duration-700"
            style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
              <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'var(--accent)', opacity: .2 }} />
              <span className="absolute inset-0 rounded-full"
                style={{ background: `conic-gradient(from 0deg, transparent 0deg, ${theme.accent}66 45deg, transparent 70deg)`, animation: 'cpSweep 3s linear infinite' }} />
              <span className="absolute inset-[6px] rounded-full border border-dashed" style={{ borderColor: 'var(--accent)', opacity: .18 }} />
              <span className="absolute inset-0 rounded-full"
                style={{ animation: 'cp-pulse-ring 3s ease-out infinite', border: '1px solid var(--accent)', opacity: 0 }} />
              <RadarIcon className="relative z-10 h-6 w-6 text-[color:var(--accent)]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold leading-none tracking-tight text-white sm:text-2xl"
                style={{ textShadow: '0 0 22px var(--glow)' }}>
                {theme.heading}
              </h1>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Secure Access Terminal
              </p>
            </div>
          </div>

          <div className="mt-6 min-h-[104px] rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[10px] leading-[1.75]">
            {BOOT.slice(0, bootStep).map((line, i) => {
              const isLast = i === BOOT.length - 1;
              return (
                <p key={line} className="truncate" style={{ color: isLast ? 'var(--accent)' : '#64748b' }}>{line}</p>
              );
            })}
            {!ready && (
              <span className="ml-0.5 inline-block h-3 w-1.5 align-middle"
                style={{ background: 'var(--accent)', animation: 'cp-blink 1s steps(1) infinite' }} />
            )}
          </div>

          {ready && (
            <form onSubmit={handleSubmit} noValidate className="cp-rise mt-6 space-y-4">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Select Access Channel</p>
                <div className="flex rounded-xl border border-white/10 bg-black/40 p-1.5">
                  {(['LEA', 'Citizen'] as Role[]).map((item) => {
                    const isSelected = role === item;
                    const t = THEMES[item];
                    return (
                      <button key={item} type="button" onClick={() => handleRoleChange(item)} disabled={loading}
                        className="relative flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 disabled:cursor-not-allowed"
                        style={isSelected ? { color: t.accent, background: `${t.accent}1f`, boxShadow: `inset 0 0 0 1px ${t.accent}66, 0 0 20px -8px ${t.accent}` } : { color: '#64748b' }}>
                        <span className="h-1.5 w-1.5 rounded-full transition-colors duration-300"
                          style={{ background: isSelected ? t.accent : '#475569', boxShadow: isSelected ? `0 0 8px ${t.accent}` : 'none' }} />
                        {item === 'LEA' ? 'LEA / Admin' : 'Citizen'}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 font-mono text-[10px] tracking-[0.18em] transition-colors duration-500" style={{ color: 'var(--accent)' }}>
                  ▸ {theme.tagline}
                </p>
              </div>

              <div>
                <label htmlFor="username" className="label-text">{theme.idLabel}</label>
                <div className="cp-inputwrap flex items-center gap-2.5 rounded-xl border bg-white/[0.03] px-3.5"
                  style={{ borderColor: formTouched && !username.trim() ? '#ef4444' : 'rgba(255,255,255,.1)' }}>
                  <UserIcon className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <input id="username" type="text" autoComplete="username" value={username}
                    onChange={(e) => setUsername(e.target.value)} disabled={loading} placeholder={theme.idPlaceholder}
                    className="w-full bg-transparent py-3 text-xs text-slate-100 placeholder-slate-600 outline-none disabled:opacity-60 sm:text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label-text">PASSWORD</label>
                <div className="cp-inputwrap flex items-center gap-2.5 rounded-xl border bg-white/[0.03] px-3.5"
                  style={{ borderColor: formTouched && !password.trim() ? '#ef4444' : 'rgba(255,255,255,.1)' }}>
                  <LockIcon className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading}
                    placeholder={theme.passPlaceholder}
                    className="w-full bg-transparent py-3 text-xs text-slate-100 placeholder-slate-600 outline-none disabled:opacity-60 sm:text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 p-1 text-slate-400 transition-colors hover:text-[color:var(--accent)]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/40 p-2.5 text-xs text-red-300 animate-fadeIn">
                  <AlertIcon className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="cp-btn group relative mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl text-xs font-extrabold uppercase tracking-[0.18em] text-[#020617] disabled:opacity-80 sm:text-sm">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Authenticating…</span>
                    </>
                  ) : 'LOGIN'}
                </span>
                <span className="cp-shimmer absolute inset-y-0 -left-1/3 w-1/3 bg-white/45 blur-md" />
              </button>

              {statusLines.length > 0 && (
                <div className="space-y-1 rounded-lg border border-white/10 bg-black/50 p-2.5 font-mono text-[10px] leading-relaxed"
                  style={{ animation: 'cp-rise .4s ease both' }}>
                  {statusLines.map((line, i) => (
                    <p key={line} className="cp-rise"
                      style={{ animationDelay: `${i * 40}ms`, color: i === statusLines.length - 1 ? 'var(--accent)' : '#64748b' }}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </form>
          )}

          {granted && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-slate-950/95 backdrop-blur-xl"
              style={{ animation: 'cp-grant .55s ease both' }}>
              <svg className="h-14 w-14 text-[color:var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.5 4 6v6c0 5 3.4 8.6 8 9.5 4.6-.9 8-4.5 8-9.5V6z" />
                <path d="m8.8 12 2.2 2.2 4.2-4.4" />
              </svg>
              <p className="font-display text-sm font-bold tracking-[0.3em] text-[color:var(--accent)]"
                style={{ textShadow: '0 0 24px var(--glow)' }}>
                ACCESS GRANTED
              </p>
              <p className="font-mono text-[10px] tracking-widest text-slate-500">
                ROUTING → {theme.tagline}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="absolute bottom-3 left-1/2 z-10 w-full -translate-x-1/2 px-6 text-center font-mono text-[10px] leading-relaxed tracking-widest text-slate-600">
        CYBERPEHRA • SECURE ACCESS • UNAUTHORIZED ACCESS IS PROSECUTABLE
      </p>
    </div>
  );
}