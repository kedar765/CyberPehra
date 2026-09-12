'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  RadarIcon, ShieldAlertIcon, MapPinIcon, BrainIcon, FileTextIcon,
  ActivityIcon, PlusCircleIcon, RefreshCwIcon, ExternalLinkIcon,
  LogOutIcon, MenuIcon, XIcon, LockIcon,
} from '@/app/components/icons';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const BOOT = ['AUTHENTICATING LEA SESSION', 'VERIFYING CLEARANCE', 'LOADING INTEL FEEDS', 'READY'];

type Tab = 'prediction' | 'hotspots' | 'complaints';
type Tone = 'cyan' | 'emerald' | 'amber' | 'red';

const TONE: Record<Tone, { icon: string; tag: string; border: string; glow: string }> = {
  cyan:    { icon: 'text-cyan-400',    tag: 'text-cyan-400',    border: 'border-cyan-500/20',    glow: 'bg-cyan-500/10' },
  emerald: { icon: 'text-emerald-400', tag: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'bg-emerald-500/10' },
  amber:   { icon: 'text-amber-400',   tag: 'text-amber-400',   border: 'border-amber-500/20',   glow: 'bg-amber-500/10' },
  red:     { icon: 'text-red-400',     tag: 'text-red-400',     border: 'border-red-500/20',     glow: 'bg-red-500/10' },
};

const SCENARIO_TONE: Record<Tone, string> = {
  cyan:    'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25',
  emerald: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25',
  amber:   'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25',
  red:     'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25',
};

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'prediction', label: 'AI Risk Predictor', icon: BrainIcon },
  { key: 'hotspots',   label: 'Map Hotspots',      icon: MapPinIcon },
  { key: 'complaints', label: 'Complaints',        icon: FileTextIcon },
];

const SCENARIOS: { label: string; tone: Tone; v: string[] }[] = [
  { label: 'High Risk ATM (₹85k, 1AM)',     tone: 'red',     v: ['85000', '1', '12', '5', '19.0760', '72.8777'] },
  { label: 'Moderate UPI (₹35k, 2PM)',      tone: 'amber',   v: ['35000', '14', '4', '1', '19.1383', '77.3210'] },
  { label: 'Low Risk Normal (₹4.5k, 11AM)', tone: 'emerald', v: ['4500', '11', '1', '0', '18.5204', '73.8567'] },
];

const riskColor = (s: number) => (s > 70 ? '#ef4444' : s > 30 ? '#f59e0b' : '#10b981');
const riskBadge = (s: number) => (s > 70 ? 'badge-danger' : s > 30 ? 'badge-warning' : 'badge-success');
const money = (n: number | null) => (n != null ? `₹${n.toLocaleString('en-IN')}` : 'N/A');
const mapLink = (la: number, lo: number) => `https://www.google.com/maps?q=${la},${lo}`;

async function api<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, init);
    return res.ok ? ((await res.json()) as T) : null;
  } catch { return null; }
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <input {...p} className="input-field" />
    </div>
  );
}

function Modal({ title, onClose, onSubmit, submitLabel, submitting, accent, children }: {
  title: string; onClose: () => void; onSubmit: (e: FormEvent) => void;
  submitLabel: string; submitting: boolean; accent: 'primary' | 'danger'; children: React.ReactNode;
}) {
  return (
    <div className="modal-overlay cp-fade" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content cp-rise border border-red-500/20 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-bold tracking-tight text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><XIcon className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          {children}
          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" disabled={submitting} className={`btn-${accent} text-xs`}>
              {submitting ? 'Processing…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead><tr>{head.map((h, i) => <th key={i} className={i === head.length - 1 ? 'text-right' : ''}>{h}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Empty({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="empty-state cp-fade">
      <Icon className="w-10 h-10 text-slate-600" />
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}

function Stat({ icon: Icon, tone, tag, label, value, note, delay }: {
  icon: any; tone: Tone; tag: string; label: string; value: string; note: string; delay: number;
}) {
  const t = TONE[tone];
  return (
    <div className={`cp-rise cp-delay-${delay} cp-card-hover group relative card p-4 border ${t.border} overflow-hidden`}>
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${t.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className="relative flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${t.icon} cp-glow-pulse`} />
        <span className={`text-[10px] font-mono ${t.tag} font-bold tracking-widest`}>{tag}</span>
      </div>
      <p className="relative text-[10px] font-mono text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="relative font-display tabular text-lg font-bold text-white mt-0.5 tracking-tight">{value}</p>
      <p className={`relative text-[10px] ${t.tag} font-mono mt-1`}>{note}</p>
    </div>
  );
}



export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState('LEA-OFFICER-409');
  const [ready, setReady] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [tab, setTab] = useState<Tab>('prediction');
  const [navOpen, setNavOpen] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    amount: '85000', hour: '1', freq: '12', prev: '5', lat: '19.0760', lng: '72.8777',
  });
  const [predicting, setPredicting] = useState(false);
  const [predictErr, setPredictErr] = useState('');
  const [result, setResult] = useState<any>(null);

  const [hotspots, setHotspots] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [newComplaint, setNewComplaint] = useState({
    crime_type: 'UPI Fraud', fraud_amount: '45000',
    location: 'Mumbai Cyber Cell', latitude: '19.076', longitude: '72.877',
  });
  const [complaintOpen, setComplaintOpen] = useState(false);


  const load = useCallback(async (kind: Tab) => {
    setLoading(true);
    if (kind === 'hotspots')   setHotspots((await api<any>('/hotspot/'))?.hotspots || []);
    if (kind === 'complaints') setComplaints((await api<any[]>('/complaints/')) || []);
    setLoading(false);
  }, []);



  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setBootStep(i);
      if (i >= BOOT.length) clearInterval(id);
    }, 240);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const isAuth = localStorage.getItem('cyberpehra_authenticated');
    const role = localStorage.getItem('cyberpehra_role');
    if (!isAuth || role !== 'LEA') { router.push('/login'); return; }
    setUser(localStorage.getItem('cyberpehra_user') || 'LEA-OFFICER-409');
    setReady(true);
    api('/health').then((d) => setOnline(!!d));
    load('hotspots');
    load('complaints');
  }, [router, load]);

  const switchTab = (k: Tab) => {
    setTab(k); setNavOpen(false);
    if (k === 'hotspots')   load('hotspots');
    if (k === 'complaints') load('complaints');
  };

  const logout = () => {
    ['cyberpehra_authenticated', 'cyberpehra_user', 'cyberpehra_role'].forEach((k) => localStorage.removeItem(k));
    router.push('/login');
  };

  const predict = async (e: FormEvent) => {
    e.preventDefault();
    setPredicting(true); setPredictErr('');
    const payload = {
      transaction_amount: +form.amount, transaction_hour: +form.hour,
      transaction_frequency: +form.freq, previous_fraud_count: +form.prev,
      latitude: +form.lat, longitude: +form.lng,
    };
    const data = await api<any>('/withdrawal/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!data) setPredictErr(`Unable to complete prediction. Ensure FastAPI backend is active at ${API}`);
    else setResult({
      risk_score: data.risk_score ?? 0, risk_level: data.risk_level ?? 'Unknown',
      latitude: data.latitude ?? payload.latitude, longitude: data.longitude ?? payload.longitude,
      hotspot_status: data.hotspot_status ?? 'Monitored Location',
      recommendation: data.recommendation ?? 'Review transaction logs.',
      evaluated_at: new Date().toLocaleTimeString(),
    });
    setPredicting(false);
  };

  const createComplaint = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await api('/complaints/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newComplaint, fraud_amount: +newComplaint.fraud_amount,
        latitude: +newComplaint.latitude, longitude: +newComplaint.longitude,
      }),
    });
    if (ok !== null) { setComplaintOpen(false); load('complaints'); load('hotspots'); }
  };

  if (!ready) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] cyber-grid-secure gap-3">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 cp-glow-pulse">
        <RadarIcon className="w-8 h-8 animate-radar-sweep" />
        <span className="absolute inset-0 rounded-2xl border border-red-500/40" style={{ animation: 'cp-pulse-ring 2s ease-out infinite' }} />
      </div>
      <div className="font-mono text-[11px] tracking-[0.2em] text-red-300">
        {BOOT[Math.min(bootStep, BOOT.length - 1)]}
        <span className="cp-blink">_</span>
      </div>
    </div>
  );

  const score = result?.risk_score ?? 0;
  const color = riskColor(score);
  const dashOffset = 289 - (289 * Math.min(100, Math.max(0, score))) / 100;

  return (
    <div className="min-h-screen flex cyber-grid-secure relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-red-500/10 blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[140px]" />
      </div>

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-950/90 backdrop-blur-xl border-r border-red-500/20 flex flex-col transition-transform duration-300 ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="relative flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <RadarIcon className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(239,68,68,0.7)]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[17px] font-bold tracking-tight text-white cp-flicker">CyberPehra</span>
                <span className="text-[9px] font-mono px-1 rounded border border-red-500/40 bg-red-500/10 text-red-400 font-bold">LEA</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">Command Console</p>
            </div>
          </div>
          <button onClick={() => setNavOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><XIcon className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1.5">
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Operations</p>
          {TABS.map(({ key, label, icon: Icon }, i) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => switchTab(key)}
                className={`cp-rise cp-delay-${i + 1} group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${active ? 'bg-red-500/15 border-red-500/40 text-white font-bold shadow-lg shadow-red-500/10' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border-transparent'}`}>
                <Icon className={`w-4 h-4 transition-transform ${active ? 'text-red-400' : 'text-slate-500 group-hover:scale-110'}`} />
                <span className="text-xs font-mono">{label}</span>
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-red-400 cp-glow-pulse" />}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/10 bg-slate-950/60 text-xs font-mono">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="tracking-widest">API ENGINE</span>
            <span className="relative flex h-2 w-2">
              {online && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? 'bg-emerald-400' : 'bg-red-500'}`} />
            </span>
          </div>
          <p className={online ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {online ? 'FastAPI Connected' : 'Engine Offline'}
          </p>
        </div>

        <div className="px-3 py-3 border-t border-white/10 bg-slate-950/80">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-mono">
            <span className="text-slate-300 font-bold truncate max-w-[130px]">{user}</span>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors" title="Logout">
              <LogOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {navOpen && <div className="fixed inset-0 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden" onClick={() => setNavOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between px-5 lg:px-8 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 cp-fade">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="flex items-center gap-3">
            <button onClick={() => setNavOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1"><MenuIcon className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider">
              <span className="text-slate-500">CYBERPEHRA</span>
              <span className="text-slate-700">/</span>
              <span className="text-red-400 font-bold cp-glow-pulse">LEA COMMAND</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-300">{TABS.find((t) => t.key === tab)?.label}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
            <LockIcon className="w-3.5 h-3.5" /><span>LEA COMMAND ACCESS</span>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Stat icon={BrainIcon}    tone="cyan"    tag="AI MODEL"     label="Risk Classifier" value="Random Forest"                note="Amount · Hour · Freq"    delay={1} />
            <Stat icon={MapPinIcon}   tone="emerald" tag="HOTSPOTS"     label="Active Zones"    value={`${hotspots.length} Zones`}   note="Incident Density Mapping" delay={2} />
            <Stat icon={FileTextIcon} tone="amber"   tag="COMPLAINTS"   label="Total Received"  value={`${complaints.length} Cases`} note="National Registry Feed"   delay={3} />
          </div>

          {tab === 'prediction' && (
            <div className="space-y-6 cp-fade">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-slate-400 font-bold whitespace-nowrap tracking-widest">SCENARIO:</span>
                {SCENARIOS.map((p) => (
                  <button key={p.label} type="button"
                    onClick={() => setForm({ amount: p.v[0], hour: p.v[1], freq: p.v[2], prev: p.v[3], lat: p.v[4], lng: p.v[5] })}
                    className={`px-3 py-1.5 rounded-lg border hover:scale-[1.02] transition-all whitespace-nowrap ${SCENARIO_TONE[p.tone]}`}>
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="cp-rise cp-delay-1 card p-6 lg:col-span-7 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl" />
                  <div className="relative flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                    <h3 className="font-display text-[15px] font-semibold tracking-tight text-white flex items-center gap-2">
                      <BrainIcon className="w-5 h-5 text-cyan-400 cp-glow-pulse" /> AI Cashout & Fraud Risk Assessment
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 tracking-widest">POST /withdrawal/</span>
                  </div>
                  <form onSubmit={predict} className="relative space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Transaction Amount (₹)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                      <Field label="Hour of Day (0–23)" type="number" min="0" max="23" value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} required />
                      <Field label="Velocity / Frequency (24h)" type="number" value={form.freq} onChange={(e) => setForm({ ...form, freq: e.target.value })} required />
                      <Field label="Prior Fraud Incidents" type="number" value={form.prev} onChange={(e) => setForm({ ...form, prev: e.target.value })} required />
                      <Field label="Latitude" type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
                      <Field label="Longitude" type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
                    </div>
                    <button type="submit" disabled={predicting}
                      className="relative w-full btn-danger h-11 font-mono text-xs font-bold uppercase mt-2 overflow-hidden">
                      {predicting ? 'Computing Random Forest Inference…' : 'Run AI Prediction Engine'}
                    </button>
                  </form>
                  {predictErr && <div className="relative mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 cp-fade">{predictErr}</div>}
                </div>

                <div className="cp-rise cp-delay-2 card p-6 lg:col-span-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                  <div>
                    <h3 className="font-display text-[15px] font-semibold tracking-tight text-white mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 cp-glow-pulse" /> Predictive Flow Architecture
                    </h3>
                    <div className="space-y-3">
                      {[
                        ['1', 'Feature Extraction', 'Nocturnal hours, frequency velocity, past fraud records'],
                        ['2', 'Random Forest Inference', 'Calculates cash withdrawal probability (0–100)'],
                        ['3', 'GIS Density Match', 'Correlates coordinates against high-risk clusters'],
                        ['4', 'Proactive Alert', 'Triggers alert for bank/patrol dispatch if risk > 70%'],
                      ].map(([n, t, d], i) => (
                        <div key={n} className={`cp-rise cp-delay-${i + 3} flex items-start gap-2.5 text-xs group`}>
                          <span className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">{n}</span>
                          <div><p className="font-display font-semibold text-slate-200 tracking-tight">{t}</p><p className="text-[11px] text-slate-400">{d}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>STATUS: <span className="text-emerald-400">OPERATIONAL</span></span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> READY
                    </span>
                  </div>
                </div>
              </div>

              {result && (
                <div className="cp-rise card p-6 border border-cyan-500/30 bg-slate-900/80 space-y-4 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none cp-glow-pulse" />
                  <div className="relative flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="font-display text-[15px] font-semibold tracking-tight text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" /> Prediction Assessment Result
                    </h3>
                    <span className="text-xs font-mono text-slate-400">Evaluated at {result.evaluated_at}</span>
                  </div>
                  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="46" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="46" fill="transparent" stroke={color} strokeWidth="8" strokeDasharray="289" strokeDashoffset={dashOffset} strokeLinecap="round"
                            style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="font-display tabular text-5xl font-bold leading-none" style={{ color, textShadow: `0 0 20px ${color}` }}>{result.risk_score}</span>
                          <span className="text-[9px] font-mono text-slate-400 tracking-widest mt-1">OUT OF 100</span>
                        </div>
                      </div>
                      <span className={`badge ${riskBadge(result.risk_score)} mt-2 text-xs font-mono`}>{result.risk_level.toUpperCase()}</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono p-4 rounded-xl bg-slate-950/80 border border-white/10">
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-slate-400">LATITUDE:</span><span className="text-cyan-400 font-bold tabular">{result.latitude.toFixed(4)}° N</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-slate-400">LONGITUDE:</span><span className="text-cyan-400 font-bold tabular">{result.longitude.toFixed(4)}° E</span></div>
                      <div className="flex justify-between pt-1"><span className="text-slate-400">CLUSTER:</span><span className="text-amber-400 font-semibold">{result.hotspot_status}</span></div>
                      <div className="pt-2">
                        <a href={mapLink(result.latitude, result.longitude)} target="_blank" rel="noreferrer" className="btn-secondary text-xs w-full flex items-center justify-center gap-1.5">
                          <MapPinIcon className="w-3.5 h-3.5 text-cyan-400" /> View on Google Maps <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${result.risk_score > 70 ? 'border-red-500/40 bg-red-950/20' : result.risk_score > 30 ? 'border-amber-500/40 bg-amber-950/20' : 'border-emerald-500/40 bg-emerald-950/20'}`}>
                      <ShieldAlertIcon className="w-5 h-5 shrink-0 text-red-400 mt-0.5 cp-glow-pulse" />
                      <div>
                        <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">LEA Action Protocol</p>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed">{result.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'hotspots' && (
            <div className="cp-rise card p-6 space-y-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-white flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-emerald-400 cp-glow-pulse" /> Cybercrime Map Hotspots</h3>
                  <p className="text-xs text-slate-400">Clustered coordinates calculated from complaint density</p>
                </div>
                <button onClick={() => load('hotspots')} disabled={loading} className="btn-secondary text-xs">
                  <RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Hotspots
                </button>
              </div>
              {loading ? <div className="text-center py-8 text-xs font-mono text-emerald-400 tracking-widest">LOADING CLUSTERS<span className="cp-blink">_</span></div>
                : hotspots.length === 0 ? <Empty icon={MapPinIcon} label="No Hotspot Clusters Detected" />
                : <Table head={['Coordinates', 'Incident Count', 'Risk Level', 'Maps']}>
                    {hotspots.map((h, i) => (
                      <tr key={i}>
                        <td className="font-mono text-cyan-400">{h.latitude.toFixed(4)}° N, {h.longitude.toFixed(4)}° E</td>
                        <td className="font-mono font-bold text-white">{h.incident_count} complaints</td>
                        <td><span className={`badge ${h.risk_level.toLowerCase().includes('high') ? 'badge-danger' : 'badge-warning'}`}>{h.risk_level}</span></td>
                        <td className="text-right">
                          <a href={mapLink(h.latitude, h.longitude)} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline font-mono inline-flex items-center gap-1">
                            Pin <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </Table>}
            </div>
          )}

          {tab === 'complaints' && (
            <div className="cp-rise card p-6 space-y-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-white flex items-center gap-2"><FileTextIcon className="w-4 h-4 text-amber-400 cp-glow-pulse" /> Cybercrime Complaints</h3>
                  <p className="text-xs text-slate-400">All complaints received from citizens and police stations</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setComplaintOpen(true)} className="btn-primary text-xs py-1.5 px-3"><PlusCircleIcon className="w-4 h-4" /> Add Complaint</button>
                  <button onClick={() => load('complaints')} disabled={loading} className="btn-secondary text-xs py-1.5 px-3"><RefreshCwIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
                </div>
              </div>
              {loading ? <div className="text-center py-8 text-xs font-mono text-amber-400 tracking-widest">LOADING COMPLAINTS<span className="cp-blink">_</span></div>
                : complaints.length === 0 ? <Empty icon={FileTextIcon} label="No Complaints Recorded" />
                : <Table head={['Case #', 'Type', 'Amount', 'Location', 'Coordinates', 'Date', 'Status']}>
                    {complaints.map((c) => (
                      <tr key={c.id}>
                        <td className="font-mono text-cyan-400 font-bold">#{c.id}</td>
                        <td className="font-semibold text-white">{c.crime_type}</td>
                        <td className="font-mono text-emerald-400 font-bold">{money(c.fraud_amount)}</td>
                        <td className="text-slate-300">{c.location || 'Unknown'}</td>
                        <td className="font-mono text-xs text-slate-400">{c.latitude && c.longitude ? `${c.latitude.toFixed(4)}°, ${c.longitude.toFixed(4)}°` : 'N/A'}</td>
                        <td className="text-xs font-mono text-slate-400">{new Date(c.complaint_time).toLocaleDateString()}</td>
                        <td><span className="badge badge-info">{c.status}</span></td>
                      </tr>
                    ))}
                  </Table>}
            </div>
          )}
        </main>

        <footer className="border-t border-white/10 py-3 px-8 text-center text-xs font-mono text-slate-500 bg-slate-950/70 backdrop-blur-xl tracking-widest">
          CYBERPEHRA <span className="mx-1.5 text-slate-700">·</span> PREDICTIVE DEFENSE COMMAND <span className="mx-1.5 text-slate-700">·</span> © {new Date().getFullYear()}
        </footer>
      </div>

      {complaintOpen && (
        <Modal title="Add Cybercrime Complaint" onClose={() => setComplaintOpen(false)} onSubmit={createComplaint} submitLabel="Add Complaint" submitting={false} accent="primary">
          <div>
            <label className="label-text">Crime Type</label>
            <select value={newComplaint.crime_type} onChange={(e) => setNewComplaint({ ...newComplaint, crime_type: e.target.value })} className="input-field">
              {['UPI Fraud', 'ATM Cloning', 'SIM Swap & OTP', 'Phishing Syndicate', 'Investment Scam'].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <Field label="Amount (₹)" type="number" value={newComplaint.fraud_amount} onChange={(e) => setNewComplaint({ ...newComplaint, fraud_amount: e.target.value })} required />
          <Field label="Location" type="text" value={newComplaint.location} onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" type="number" step="any" value={newComplaint.latitude} onChange={(e) => setNewComplaint({ ...newComplaint, latitude: e.target.value })} required />
            <Field label="Longitude" type="number" step="any" value={newComplaint.longitude} onChange={(e) => setNewComplaint({ ...newComplaint, longitude: e.target.value })} required />
          </div>
        </Modal>
      )}
    </div>
  );
}