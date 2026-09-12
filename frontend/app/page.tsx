'use client';

import React from 'react';
import Link from 'next/link';
import {
  RadarIcon, MapPinIcon, BrainIcon, ActivityIcon, ShieldAlertIcon,
  ShieldCheckIcon, CrosshairIcon, LockIcon,
} from '@/app/components/icons';

/* explicit class maps — Tailwind JIT requires literal class strings */
const TONE = {
  cyan: {
    icon: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    iconBorder: 'border-cyan-500/25',
    hoverBorder: 'hover:border-cyan-500/40',
    glow: 'bg-cyan-500/10',
    hoverShadow: 'hover:shadow-cyan-500/25',
    sub: 'text-cyan-300',
    dot: 'bg-cyan-400',
    pipelineText: 'text-cyan-300',
    pipelineBorder: 'border-cyan-500/20',
    pipelineHover: 'hover:border-cyan-500/40',
  },
  emerald: {
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-500/40',
    glow: 'bg-emerald-500/10',
    hoverShadow: 'hover:shadow-emerald-500/25',
    sub: 'text-emerald-300',
    dot: 'bg-emerald-400',
    pipelineText: 'text-emerald-300',
    pipelineBorder: 'border-emerald-500/20',
    pipelineHover: 'hover:border-emerald-500/40',
  },
  amber: {
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-500/40',
    glow: 'bg-amber-500/10',
    hoverShadow: 'hover:shadow-amber-500/25',
    sub: 'text-amber-300',
    dot: 'bg-amber-400',
    pipelineText: 'text-amber-300',
    pipelineBorder: 'border-amber-500/20',
    pipelineHover: 'hover:border-amber-500/40',
  },
  red: {
    icon: 'text-red-400',
    iconBg: 'bg-red-500/10',
    iconBorder: 'border-red-500/25',
    hoverBorder: 'hover:border-red-500/40',
    glow: 'bg-red-500/10',
    hoverShadow: 'hover:shadow-red-500/25',
    sub: 'text-red-300',
    dot: 'bg-red-400',
    pipelineText: 'text-red-300',
    pipelineBorder: 'border-red-500/20',
    pipelineHover: 'hover:border-red-500/40',
  },
  slate: {
    icon: 'text-slate-400',
    iconBg: 'bg-slate-500/10',
    iconBorder: 'border-slate-500/25',
    hoverBorder: 'hover:border-slate-500/40',
    glow: 'bg-slate-500/10',
    hoverShadow: 'hover:shadow-slate-500/25',
    sub: 'text-slate-300',
    dot: 'bg-slate-400',
    pipelineText: 'text-slate-300',
    pipelineBorder: 'border-slate-500/20',
    pipelineHover: 'hover:border-slate-500/40',
  },
  blue: {
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    iconBorder: 'border-blue-500/25',
    hoverBorder: 'hover:border-blue-500/40',
    glow: 'bg-blue-500/10',
    hoverShadow: 'hover:shadow-blue-500/25',
    sub: 'text-blue-300',
    dot: 'bg-blue-400',
    pipelineText: 'text-blue-300',
    pipelineBorder: 'border-blue-500/20',
    pipelineHover: 'hover:border-blue-500/40',
  },
} as const;

type ToneKey = keyof typeof TONE;

const FEATURES: { icon: any; tone: ToneKey; title: string; sub: string; desc: string }[] = [
  { icon: BrainIcon,       tone: 'cyan',    title: 'AI Prediction',        sub: 'Predict withdrawal risk', desc: 'Random Forest evaluation of amount, nocturnal hours, velocity, and fraud history.' },
  { icon: MapPinIcon,      tone: 'emerald', title: 'GIS Hotspots',         sub: 'Locate high-risk zones',  desc: 'Geospatial clustering of complaints to surface probable cash-out ATM clusters.' },
  { icon: ActivityIcon,    tone: 'amber',   title: 'Transaction Analysis', sub: 'Detect mule patterns',    desc: 'Monitors rapid money-mule hops, unusual velocities, and extraction channels.' },
  { icon: ShieldAlertIcon, tone: 'red',     title: 'LEA Alerts',           sub: 'Enable proactive action', desc: 'Instant tactical dispatch to nearby police units and partner banking nodes.' },
];

const PIPELINE: { step: string; title: string; desc: string; tone: ToneKey }[] = [
  { step: '01', title: 'Incident Ingestion', desc: 'Complaints logged with GPS & amounts',  tone: 'slate'   },
  { step: '02', title: 'AI/ML Evaluation',   desc: 'Random Forest evaluates live patterns', tone: 'cyan'    },
  { step: '03', title: 'Risk Prediction',    desc: 'Cashout probability scored 0–100',      tone: 'amber'   },
  { step: '04', title: 'GIS Hotspot',        desc: 'Coordinate clustering detects zones',   tone: 'blue'    },
  { step: '05', title: 'Actionable Intel',   desc: 'Recommendations formulated for LEA',    tone: 'emerald' },
  { step: '06', title: 'LEA Alert',          desc: 'Field alert when risk exceeds 70%',     tone: 'red'     },
];

const TELEMETRY: { k: string; v: string; meta: string; tone: ToneKey; pulse?: boolean }[] = [
  { k: 'PRIMARY REGION',      v: 'Mumbai Metro',             meta: '19.076° N · 72.877° E', tone: 'slate'   },
  { k: 'HOTSPOT DETECTION',   v: '3 High-Risk Clusters',     meta: 'Live',                  tone: 'red',    pulse: true },
  { k: 'ML INFERENCE ENGINE', v: 'Random Forest Classifier', meta: 'Online',                tone: 'emerald' },
  { k: 'DISPATCH TRIGGER',    v: 'Automatic Alert',          meta: 'Risk > 70%',            tone: 'cyan'    },
];

function ArrowIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function SectionHead({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      {kicker && (
        <p className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-[0.25em] mb-3">
          <span className="w-1 h-1 rounded-full bg-cyan-400" />
          {kicker}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
      {sub && <p className="text-sm text-slate-400 mt-2 leading-relaxed">{sub}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col cyber-grid relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px]" />
      </div>

      <div className="border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl px-4 sm:px-8 py-2 flex items-center justify-between text-[10.5px] font-mono tracking-[0.15em] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-cyan-400 font-semibold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            INTELLIGENCE GRID ONLINE
          </span>
          <span className="hidden sm:inline text-slate-700">/</span>
          <span className="hidden sm:inline">NODE · MUMBAI CYBER DIVISION</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
            <ShieldCheckIcon className="w-3 h-3" /> SECURE LEA CHANNEL
          </span>
          <span className="hidden lg:inline text-slate-600">v4.2</span>
        </div>
      </div>

      <header className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/5 to-blue-600/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/10 group-hover:shadow-cyan-500/25 transition-shadow duration-500">
            <RadarIcon className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white leading-none">CyberPehra</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 uppercase tracking-[0.15em] font-bold">
                Intel
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 tracking-[0.08em] font-mono mt-1">
              Predictive Cybercrime Defense
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wider">SYSTEM ONLINE</span>
          </div>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-300"
          >
            <LockIcon className="w-4 h-4" />
            <span>Officer Access</span>
            <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 py-12 lg:py-20 flex flex-col gap-16 lg:gap-24 animate-fadeIn">
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/[0.08] border border-cyan-400/25 text-cyan-300 text-[11px] font-mono font-semibold tracking-[0.2em] shadow-lg shadow-cyan-500/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            AI-DRIVEN CYBERCRIME PREDICTION PLATFORM
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
            Predict Where{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">
                Cybercrime Funds
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            </span>{' '}
            <span className="block sm:inline">Will Move Next</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered predictive intelligence to identify high-risk cash withdrawal locations before fraudulent funds are withdrawn.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300"
            >
              <LockIcon className="w-4 h-4" />
              Enter Command Console
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#pipeline"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-200 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              Explore Pipeline ↓
            </a>
          </div>
        </section>

        <section className="relative card p-6 sm:p-8 border border-white/[0.08] bg-slate-950/60 backdrop-blur-2xl max-w-5xl mx-auto w-full shadow-2xl shadow-cyan-950/20 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <CrosshairIcon className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs sm:text-sm font-mono font-bold tracking-[0.15em] text-slate-200 uppercase">
                Withdrawal Hotspots · GIS Clustering
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/25 font-semibold tracking-widest">
              SCAN · ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 flex justify-center py-2">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-cyan-500/25 bg-slate-950/90 flex items-center justify-center overflow-hidden shadow-[inset_0_0_40px_rgba(34,211,238,0.08)]">
                {[6, 14, 22, 30].map((inset) => (
                  <div key={inset} className="absolute rounded-full border border-cyan-500/15" style={{ inset }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-cyan-500/15" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-px bg-cyan-500/15" />
                </div>
                <div
                  className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none"
                  style={{ background: 'conic-gradient(from 0deg, rgba(34,211,238,0.35) 0deg, rgba(34,211,238,0) 70deg, transparent 360deg)' }}
                />
                <div className="absolute top-9 right-11 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.7)]">
                  <span className="absolute -inset-1 rounded-full bg-red-500/50 animate-ping" />
                </div>
                <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.6)]">
                  <span className="absolute -inset-1 rounded-full bg-amber-400/50 animate-ping" />
                </div>
                <div className="absolute top-14 left-14 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 z-10 border-2 border-slate-950 shadow-[0_0_10px_2px_rgba(34,211,238,0.7)]" />
              </div>
            </div>

            <div className="md:col-span-7 space-y-1 text-xs font-mono">
              {TELEMETRY.map(({ k, v, meta, tone, pulse }) => {
                const t = TONE[tone];
                return (
                  <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] transition-colors px-2 -mx-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      <span className="text-slate-500 tracking-[0.1em]">{k}</span>
                    </div>
                    <div className="text-right">
                      <p className={`${t.sub} font-semibold tracking-wide`}>{v}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">{meta}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHead
            kicker="Core Capabilities"
            title="Built for Law Enforcement"
            sub="Engineered to preempt financial drain before funds exit the system."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, tone, title, sub, desc }) => {
              const t = TONE[tone];
              return (
                <div
                  key={title}
                  className={`group relative card p-6 border border-white/[0.08] ${t.hoverBorder} bg-slate-950/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-1`}
                >
                  <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full ${t.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className={`relative w-11 h-11 rounded-xl ${t.iconBg} border ${t.iconBorder} flex items-center justify-center mb-4 ${t.icon} group-hover:scale-110 ${t.hoverShadow} transition-all duration-500`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="relative text-sm font-bold text-white tracking-wide">{title}</h3>
                  <p className={`relative text-[11px] ${t.sub} font-medium mt-1 tracking-wide uppercase font-mono`}>{sub}</p>
                  <p className="relative text-xs text-slate-400 mt-3 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="pipeline" className="space-y-8 pt-2 scroll-mt-24">
          <SectionHead
            kicker="Operational Flow"
            title="Autonomous Defense Pipeline"
            sub="How CyberPehra converts complaints into proactive LEA intercepts."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PIPELINE.map(({ step, title, desc, tone }, i) => {
              const t = TONE[tone];
              return (
                <div
                  key={step}
                  className={`relative card p-4 border ${t.pipelineBorder} ${t.pipelineHover} bg-slate-950/50 backdrop-blur-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-600 tracking-[0.15em]">STEP {step}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                  </div>
                  <h4 className={`text-[12px] font-bold font-mono tracking-wide ${t.pipelineText}`}>{title}</h4>
                  <p className="text-[10.5px] text-slate-500 mt-2 leading-snug">{desc}</p>
                  {i < PIPELINE.length - 1 && (
                    <span className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative card p-8 sm:p-12 border border-cyan-500/25 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-blue-500/[0.06]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-[10px] font-mono tracking-[0.2em]">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              READY TO DEPLOY
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inspect the Live Predictive System
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Access the secure Law Enforcement Command Console to run model inferences, inspect GIS clusters, and review the incident registry.
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 text-sm font-bold px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300"
              >
                <LockIcon className="w-4 h-4" />
                Access Secure Portal
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-4 px-6 text-center text-[11px] font-mono text-slate-600 bg-slate-950/60 backdrop-blur-xl tracking-wider">
        <span className="text-slate-500">CyberPehra</span>
        <span className="mx-2 text-slate-700">·</span>
        Predictive Cybercrime Defense Platform
        <span className="mx-2 text-slate-700">·</span>
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}