'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'LEA' | 'Citizen';
type LoginStatus = 'idle' | 'loading' | 'error' | 'success';

const RadarIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <line x1="12" y1="12" x2="12" y2="2" />
    <line x1="12" y1="12" x2="22" y2="12" />
  </svg>
);

const UserIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const AlertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MapPinIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BrainIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5.7.5 1.2 1.3 1.5 2.2a4 4 0 0 1-6.5 4.1A4 4 0 0 1 3 14c0-1.2.5-2.3 1.3-3.1C4.2 9.3 4 8.4 4 7.5a4 4 0 0 1 4-4z" />
  </svg>
);

export default function CyberPehraLogin() {
  const router = useRouter();

  const [role, setRole] = useState<Role>('LEA');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formTouched, setFormTouched] = useState(false);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setErrorMessage('');
    setFormTouched(false);
    setLoginStatus('idle');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    setFormTouched(true);
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setLoginStatus('error');
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoginStatus('loading');

    setTimeout(() => {
      localStorage.setItem('cyberpehra_role', role);
      localStorage.setItem('cyberpehra_user', username.trim());
      localStorage.setItem('cyberpehra_authenticated', 'true');

      setLoginStatus('success');

      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-slate-200 flex flex-col">

      <style>{`
        @keyframes gridMove {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 100px 100px, 100px 100px;
          }
        }

        @keyframes radarSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scanLine {
          0% {
            top: -10%;
          }
          100% {
            top: 110%;
          }
        }

        @keyframes dataFlow {
          0% {
            left: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1330] via-[#091022] to-black" />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 200, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 200, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />

        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <RadarIcon className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                CYBERPEHRA
              </h1>

              <p className="text-xs text-slate-400 tracking-widest uppercase">
                Predictive Cyber Intelligence
              </p>
            </div>

          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-slate-300 font-medium tracking-wide">
                SYSTEM ONLINE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <LockIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium tracking-wide">
                SECURE CONNECTION
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>

              <span className="text-slate-300 font-medium tracking-wide">
                INTELLIGENCE ENGINE ACTIVE
              </span>
            </div>

          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 flex flex-col lg:flex-row gap-8 px-6 py-8 lg:px-12 lg:py-12 max-w-7xl mx-auto w-full">

          {/* LEFT */}
          <div className="flex-1 flex flex-col justify-center space-y-8">

            <div className="space-y-4 animate-fadeInUp">

              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Predict <span className="text-cyan-400">Before</span>
                <br />
                It <span className="text-cyan-400">Happens</span>
              </h2>

              <p className="text-lg text-slate-400 max-w-md">
                AI-powered prediction of cybercrime cash withdrawal
                hotspots, enabling proactive intervention.
              </p>

            </div>

            <div className="space-y-6">

              <div className="flex flex-col md:flex-row gap-6">

                {/* RADAR */}
                <div className="relative w-64 h-64 mx-auto md:mx-0 shrink-0 animate-fadeInUp delay-200">

                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 bg-cyan-500/5 shadow-[0_0_30px_rgba(0,200,255,0.1)]" />

                  <div className="absolute inset-4 rounded-full border border-cyan-500/10" />
                  <div className="absolute inset-10 rounded-full border border-cyan-500/10" />
                  <div className="absolute inset-16 rounded-full border border-cyan-500/10" />

                  <div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      animation: 'radarSpin 4s linear infinite',
                    }}
                  >
                    <div className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left bg-gradient-to-r from-cyan-400/40 to-transparent" />
                  </div>

                  {/* Red point */}
                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                  </div>

                  {/* Yellow point */}
                  <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                  </div>

                  {/* Green point */}
                  <div className="absolute bottom-1/4 left-2/3">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,200,255,0.8)]" />

                  <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                    <div
                      className="absolute w-full h-0.5 bg-cyan-400/30 left-0"
                      style={{
                        animation: 'scanLine 3s linear infinite',
                      }}
                    />
                  </div>

                </div>

                {/* INDICATORS */}
                <div className="grid grid-cols-2 gap-3 flex-1 animate-fadeInUp delay-300">

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <BrainIcon className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-xs text-slate-400">AI Prediction</p>
                    <p className="text-sm font-semibold text-white">Active</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <RadarIcon className="w-5 h-5 text-cyan-400 mb-2" />
                    <p className="text-xs text-slate-400">Risk Analysis</p>
                    <p className="text-sm font-semibold text-white">Live</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <MapPinIcon className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-xs text-slate-400">GIS Hotspots</p>
                    <p className="text-sm font-semibold text-white">Active</p>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <AlertIcon className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-400">Real-Time Alerts</p>
                    <p className="text-sm font-semibold text-white">Enabled</p>
                  </div>

                </div>

              </div>

              {/* PIPELINE */}
              <div className="animate-fadeInUp delay-400">

                <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Intelligence Pipeline
                </p>

                <div className="flex items-center justify-between flex-wrap gap-2">

                  {[
                    ['Complaint Data', 'text-slate-300'],
                    ['AI/ML Engine', 'text-purple-400'],
                    ['Risk Score', 'text-amber-400'],
                    ['Hotspot Prediction', 'text-cyan-400'],
                    ['Actionable Intel', 'text-emerald-400'],
                    ['Alert', 'text-red-400'],
                  ].map(([label, color], index) => (
                    <React.Fragment key={label}>

                      {index > 0 && (
                        <div className="relative flex-1 min-w-[20px] max-w-[40px] h-px bg-cyan-400/20">
                          <span
                            className="absolute top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full"
                            style={{
                              animation: `dataFlow 2s ease-in-out ${
                                index * 0.5
                              }s infinite`,
                            }}
                          />
                        </div>
                      )}

                      <div className={`text-xs font-medium ${color} whitespace-nowrap`}>
                        {label}
                      </div>

                    </React.Fragment>
                  ))}

                </div>
              </div>

            </div>
          </div>

          {/* RIGHT LOGIN */}
          <div className="w-full lg:w-[420px] flex items-center justify-center animate-slideInRight">

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl">

              <h2 className="text-2xl font-bold text-white mb-6">
                Secure Access
              </h2>

              {/* ROLE */}
              <div className="flex rounded-lg bg-slate-800/50 p-1 mb-6 border border-white/5">

                {(['LEA', 'Citizen'] as Role[]).map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() => handleRoleChange(item)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      role === item
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {item === 'LEA' ? 'LEA / Admin' : 'Citizen'}
                  </button>

                ))}

              </div>

              <form onSubmit={handleSubmit} noValidate>

                <div className="space-y-5">

                  {/* USERNAME */}
                  <div>

                    <label
                      htmlFor="username"
                      className="block text-xs font-medium text-slate-400 mb-2"
                    >
                      Username / Email
                    </label>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <UserIcon className="w-4 h-4" />
                      </span>

                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your ID"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800/60 border text-white placeholder-slate-500 outline-none transition-all ${
                          formTouched && !username.trim()
                            ? 'border-red-500'
                            : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                        }`}
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <label
                      htmlFor="password"
                      className="block text-xs font-medium text-slate-400 mb-2"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <LockIcon className="w-4 h-4" />
                      </span>

                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full pl-10 pr-12 py-3 rounded-lg bg-slate-800/60 border text-white placeholder-slate-500 outline-none transition-all ${
                          formTouched && !password.trim()
                            ? 'border-red-500'
                            : 'border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* ERROR */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      <AlertIcon className="w-4 h-4" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* LOGIN */}
                  <button
                    type="submit"
                    disabled={loginStatus === 'loading'}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-semibold tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >

                    {loginStatus === 'loading' ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>

                        Authenticating...
                      </>
                    ) : loginStatus === 'success' ? (
                      'Access Granted ✓'
                    ) : (
                      'Login to Secure Console'
                    )}

                  </button>

                </div>

              </form>

              <p className="text-xs text-slate-500 mt-6 text-center">
                Restricted access • Authorized personnel only
              </p>

            </div>

          </div>

        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/5 py-4 px-6 text-center text-xs text-slate-600">
          CyberPehra • Predictive Cyber Intelligence Platform • ©{' '}
          {new Date().getFullYear()}
        </footer>

      </div>
    </div>
  );
}