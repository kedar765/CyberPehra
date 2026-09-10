'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Icons
const RadarIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
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

const ShieldAlertIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
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

const FileTextIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ActivityIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const PlusCircleIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
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
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const RefreshCwIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const ExternalLinkIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

type ActiveTab = 'prediction' | 'hotspots' | 'complaints' | 'transactions';

interface PredictionData {
  risk_score: number;
  risk_level: string;
  latitude: number;
  longitude: number;
  hotspot_status: string;
  recommendation: string;
  evaluated_at?: string;
}

interface HotspotItem {
  latitude: number;
  longitude: number;
  incident_count: number;
  risk_level: string;
}

interface ComplaintItem {
  id: number;
  crime_type: string;
  fraud_amount: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  complaint_time: string;
  status: string;
}

interface TransactionItem {
  id: number;
  transaction_id: string;
  complaint_id: number;
  amount: number;
  transaction_type: string | null;
  transaction_time: string;
  source_account: string | null;
  destination_account: string | null;
}

export default function DashboardPage() {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState<string>('Commander');
  const [role, setRole] = useState<string>('LEA');
  const [authReady, setAuthReady] = useState(false);

  // Tab State
  const [tab, setTab] = useState<ActiveTab>('prediction');

  // Backend Health
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Prediction Form State
  const [amount, setAmount] = useState('65000');
  const [hour, setHour] = useState('2');
  const [frequency, setFrequency] = useState('8');
  const [previousFraud, setPreviousFraud] = useState('3');
  const [lat, setLat] = useState('19.0760');
  const [lng, setLng] = useState('72.8777');

  const [predictLoading, setPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState('');
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  // Hotspots State
  const [hotspots, setHotspots] = useState<HotspotItem[]>([]);
  const [hotspotsLoading, setHotspotsLoading] = useState(false);

  // Complaints State
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [newComplaintCrimeType, setNewComplaintCrimeType] = useState('UPI Fraud');
  const [newComplaintAmount, setNewComplaintAmount] = useState('45000');
  const [newComplaintLocation, setNewComplaintLocation] = useState('Mumbai Cyber Cell');
  const [newComplaintLat, setNewComplaintLat] = useState('19.076');
  const [newComplaintLng, setNewComplaintLng] = useState('72.877');
  const [createComplaintLoading, setCreateComplaintLoading] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [newTxId, setNewTxId] = useState('TXN-8492');
  const [newTxComplaintId, setNewTxComplaintId] = useState('1');
  const [newTxAmount, setNewTxAmount] = useState('25000');
  const [newTxType, setNewTxType] = useState('ATM Cash Withdrawal');
  const [newTxSource, setNewTxSource] = useState('AC-98321049');
  const [newTxDest, setNewTxDest] = useState('ATM-WEST-402');
  const [createTxLoading, setCreateTxLoading] = useState(false);

  // Ping backend health
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  }, []);

  // Fetch Hotspots
  const fetchHotspots = useCallback(async () => {
    setHotspotsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/hotspot/`);
      if (res.ok) {
        const data = await res.json();
        setHotspots(data.hotspots || []);
      }
    } catch (e) {
      console.error('Failed to fetch hotspots', e);
    } finally {
      setHotspotsLoading(false);
    }
  }, []);

  // Fetch Complaints
  const fetchComplaints = useCallback(async () => {
    setComplaintsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/complaints/`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch complaints', e);
    } finally {
      setComplaintsLoading(false);
    }
  }, []);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/transactions/`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch transactions', e);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Check auth and bootstrap dashboard
  useEffect(() => {
    const isAuth = typeof window !== 'undefined' ? localStorage.getItem('cyberpehra_authenticated') : null;
    if (!isAuth) {
      router.push('/');
      return;
    }
    const storedUser = localStorage.getItem('cyberpehra_user') || 'Officer';
    const storedRole = localStorage.getItem('cyberpehra_role') || 'LEA';

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setUser(storedUser);
        setRole(storedRole);
        setAuthReady(true);
        checkHealth();
        fetchHotspots();
        fetchComplaints();
        fetchTransactions();
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [router, checkHealth, fetchHotspots, fetchComplaints, fetchTransactions]);

  const handleLogout = () => {
    localStorage.removeItem('cyberpehra_authenticated');
    localStorage.removeItem('cyberpehra_user');
    localStorage.removeItem('cyberpehra_role');
    router.push('/');
  };

  // Run Prediction
  const handlePrediction = async (e: FormEvent) => {
    e.preventDefault();
    setPredictLoading(true);
    setPredictError('');

    try {
      const payload = {
        transaction_amount: Number(amount),
        transaction_hour: Number(hour),
        transaction_frequency: Number(frequency),
        previous_fraud_count: Number(previousFraud),
        latitude: Number(lat),
        longitude: Number(lng),
      };

      // Call withdrawal prediction API
      const res = await fetch(`${API_BASE}/withdrawal/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setPrediction({
        risk_score: data.risk_score ?? 0,
        risk_level: data.risk_level ?? 'Unknown',
        latitude: data.latitude ?? payload.latitude,
        longitude: data.longitude ?? payload.longitude,
        hotspot_status: data.hotspot_status ?? 'Monitored Location',
        recommendation: data.recommendation ?? 'Review transaction logs.',
        evaluated_at: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error(err);
      setPredictError(
        'Unable to complete prediction. Ensure FastAPI backend is active at ' +
          API_BASE
      );
    } finally {
      setPredictLoading(false);
    }
  };

  // Set Preset
  const applyPreset = (
    amt: string,
    hr: string,
    freq: string,
    prev: string,
    la: string,
    lo: string
  ) => {
    setAmount(amt);
    setHour(hr);
    setFrequency(freq);
    setPreviousFraud(prev);
    setLat(la);
    setLng(lo);
  };

  // Handle Create Complaint
  const handleCreateComplaint = async (e: FormEvent) => {
    e.preventDefault();
    setCreateComplaintLoading(true);
    try {
      const res = await fetch(`${API_BASE}/complaints/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crime_type: newComplaintCrimeType,
          fraud_amount: Number(newComplaintAmount),
          location: newComplaintLocation,
          latitude: Number(newComplaintLat),
          longitude: Number(newComplaintLng),
        }),
      });
      if (res.ok) {
        setShowNewComplaintModal(false);
        fetchComplaints();
        fetchHotspots();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreateComplaintLoading(false);
    }
  };

  // Handle Create Transaction
  const handleCreateTx = async (e: FormEvent) => {
    e.preventDefault();
    setCreateTxLoading(true);
    try {
      const res = await fetch(`${API_BASE}/transactions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id: newTxId,
          complaint_id: Number(newTxComplaintId),
          amount: Number(newTxAmount),
          transaction_type: newTxType,
          source_account: newTxSource,
          destination_account: newTxDest,
        }),
      });
      if (res.ok) {
        setShowNewTxModal(false);
        setNewTxId('TXN' + Math.floor(1000 + Math.random() * 9000));
        fetchTransactions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreateTxLoading(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#050914] flex items-center justify-center text-cyan-400">
        <div className="flex items-center gap-3">
          <RadarIcon className="w-8 h-8 animate-spin" />
          <span className="tracking-widest font-mono text-sm">INITIALIZING CYBERPEHRA CONSOLE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="background-grid" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      {/* TOP HEADER */}
      <header className="dashboard-header">
        <div className="brand">
          <div className="brand-icon">
            <RadarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1>CYBERPEHRA</h1>
            <p>Predictive Cybercrime Intelligence</p>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="connection">
            <span
              className={`status-dot ${backendOnline === false ? 'danger' : ''}`}
            />
            <span>
              {backendOnline === null
                ? 'CONNECTING...'
                : backendOnline
                ? 'API ENGINE ONLINE'
                : 'OFFLINE'}
            </span>
          </div>

          <div className="role-badge">
            {role === 'LEA' ? 'LEA COMMAND' : 'CITIZEN AGENT'}
          </div>

          <div className="text-xs text-slate-400 font-mono px-2 py-1 bg-white/5 rounded border border-white/10">
            {user}
          </div>

          <button onClick={handleLogout} className="logout-button hover:bg-white/10 transition-all">
            Log Out
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="dashboard">
        {/* TITLE & LIVE TICKER */}
        <div className="dashboard-title">
          <div>
            <h2>
              Operational <span>Console</span>
            </h2>
            <p>
              Predictive fraud monitoring, GIS cash withdrawal cluster analysis & forensic ledger.
            </p>
          </div>

          <div className="live-indicator">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>SYSTEM MONITORING ACTIVE</span>
          </div>
        </div>

        {/* TOP METRICS ROW */}
        <div className="stats-row">
          <div className="stat-card">
            <BrainIcon className="w-6 h-6 text-purple-400 mb-2" />
            <span>AI Risk Classifier</span>
            <strong>Random Forest v1.0</strong>
          </div>

          <div className="stat-card">
            <MapPinIcon className="w-6 h-6 text-cyan-400 mb-2" />
            <span>Active Hotspots</span>
            <strong>{hotspots.length} Clusters Detected</strong>
          </div>

          <div className="stat-card">
            <FileTextIcon className="w-6 h-6 text-emerald-400 mb-2" />
            <span>Ingested Complaints</span>
            <strong>{complaints.length} Records</strong>
          </div>

          <div className="stat-card">
            <ActivityIcon className="w-6 h-6 text-amber-400 mb-2" />
            <span>Monitored Transactions</span>
            <strong>{transactions.length} Traced</strong>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-white/10 mb-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setTab('prediction')}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              tab === 'prediction'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainIcon className="w-4 h-4" />
            AI Risk & Hotspot Predictor
          </button>

          <button
            onClick={() => {
              setTab('hotspots');
              fetchHotspots();
            }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              tab === 'hotspots'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPinIcon className="w-4 h-4" />
            Live GIS Hotspots ({hotspots.length})
          </button>

          <button
            onClick={() => {
              setTab('complaints');
              fetchComplaints();
            }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              tab === 'complaints'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileTextIcon className="w-4 h-4" />
            Incident Registry ({complaints.length})
          </button>

          <button
            onClick={() => {
              setTab('transactions');
              fetchTransactions();
            }}
            className={`flex items-center gap-2 pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
              tab === 'transactions'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ActivityIcon className="w-4 h-4" />
            Forensic Transactions ({transactions.length})
          </button>
        </div>

        {/* TAB 1: PREDICTION */}
        {tab === 'prediction' && (
          <div>
            {/* Quick Presets */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto text-xs">
              <span className="text-slate-500 font-medium whitespace-nowrap">Load Simulation:</span>
              <button
                type="button"
                onClick={() => applyPreset('85000', '1', '12', '5', '19.0760', '72.8777')}
                className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 transition-all whitespace-nowrap"
              >
                High Risk ATM Syndicate (₹85k, 1AM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('35000', '14', '4', '1', '19.1383', '77.3210')}
                className="px-3 py-1.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all whitespace-nowrap"
              >
                Moderate Risk UPI Inflow (₹35k, 2PM)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('4500', '11', '1', '0', '18.5204', '73.8567')}
                className="px-3 py-1.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all whitespace-nowrap"
              >
                Low Risk Standard Transfer (₹4.5k, 11AM)
              </button>
            </div>

            <div className="prediction-layout">
              {/* FORM */}
              <div className="prediction-card">
                <div className="card-heading">
                  <div>
                    <h3>AI Fraud & Cash Withdrawal Prediction</h3>
                    <p>Enter transaction parameters to assess criminal withdrawal likelihood</p>
                  </div>
                  <span className="api-badge">ENDPOINT: POST /withdrawal/</span>
                </div>

                <form onSubmit={handlePrediction}>
                  <div className="form-grid">
                    <div className="field">
                      <label>Transaction Amount (₹)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 50000"
                        required
                      />
                    </div>

                    <div className="field">
                      <label>Hour of Day (0 - 23)</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hour}
                        onChange={(e) => setHour(e.target.value)}
                        placeholder="e.g. 2"
                        required
                      />
                    </div>

                    <div className="field">
                      <label>Transaction Velocity / Freq (past 24h)</label>
                      <input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder="e.g. 8"
                        required
                      />
                    </div>

                    <div className="field">
                      <label>Prior Fraud Incidents on Account</label>
                      <input
                        type="number"
                        value={previousFraud}
                        onChange={(e) => setPreviousFraud(e.target.value)}
                        placeholder="e.g. 3"
                        required
                      />
                    </div>

                    <div className="field">
                      <label>Latitude (Target Location)</label>
                      <input
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="19.0760"
                        required
                      />
                    </div>

                    <div className="field">
                      <label>Longitude (Target Location)</label>
                      <input
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="72.8777"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={predictLoading}
                    className="predict-button"
                  >
                    {predictLoading ? 'Analyzing Neural Patterns...' : 'Run Intelligence Model'}
                  </button>
                </form>

                {predictError && (
                  <div className="prediction-error error-box">
                    <ShieldAlertIcon className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{predictError}</span>
                  </div>
                )}
              </div>

              {/* HOW IT WORKS PIPELINE */}
              <div className="how-card">
                <div className="card-heading">
                  <div>
                    <h3>Predictive Workflow</h3>
                    <p>Architecture of CyberPehra&apos;s intelligence engine</p>
                  </div>
                </div>

                <div className="pipeline-vertical">
                  <div>
                    <span>01</span>
                    <section>
                      <strong>Ingestion & Feature Vector</strong>
                      <small>Telemetry on transaction volume, nocturnal hours & account velocity.</small>
                    </section>
                  </div>

                  <div>
                    <span>02</span>
                    <section>
                      <strong>Ensemble Random Forest</strong>
                      <small>Scikit-learn model evaluates probability of mule cash extraction.</small>
                    </section>
                  </div>

                  <div>
                    <span>03</span>
                    <section>
                      <strong>Geospatial Clustering</strong>
                      <small>Coordinates mapped against known financial extraction hotspots.</small>
                    </section>
                  </div>

                  <div>
                    <span>04</span>
                    <section>
                      <strong>Law Enforcement Dispatch</strong>
                      <small>Generates immediate preventive interception protocols for field officers.</small>
                    </section>
                  </div>
                </div>
              </div>
            </div>

            {/* RESULTS SECTION */}
            {prediction && (
              <div className="result-section animate-fadeInUp">
                <div className="result-title">
                  <span />
                  <h2>Prediction Analysis Report</h2>
                  <div className="result-time">EVALUATED AT: {prediction.evaluated_at}</div>
                </div>

                <div className="result-grid">
                  {/* RISK SCORE CARD */}
                  <div
                    className={`risk-card ${
                      prediction.risk_level.toLowerCase().includes('high') ? 'high-risk' : ''
                    }`}
                  >
                    <span>COMPUTED FRAUD RISK METRIC</span>
                    <div
                      className="risk-number"
                      style={{
                        color:
                          prediction.risk_score > 70
                            ? '#ff4d4f'
                            : prediction.risk_score > 30
                            ? '#ffc107'
                            : '#52c41a',
                      }}
                    >
                      {prediction.risk_score}
                      <small> / 100</small>
                    </div>
                    <strong
                      style={{
                        color:
                          prediction.risk_score > 70
                            ? '#ff4d4f'
                            : prediction.risk_score > 30
                            ? '#ffc107'
                            : '#52c41a',
                      }}
                    >
                      {prediction.risk_level.toUpperCase()}
                    </strong>
                  </div>

                  {/* LOCATION AND HOTSPOT CARD */}
                  <div className="location-card">
                    <MapPinIcon className="w-8 h-8 result-icon" />
                    <div>
                      <span>PREDICTED CASHOUT POINT</span>
                      <strong>
                        {prediction.latitude.toFixed(4)}, {prediction.longitude.toFixed(4)}
                      </strong>
                      <p>{prediction.hotspot_status}</p>

                      <a
                        href={`https://www.google.com/maps?q=${prediction.latitude},${prediction.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs text-cyan-400 hover:underline"
                      >
                        View on Satellite Map <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* RECOMMENDATION */}
                <div className="recommendation-card">
                  <ShieldAlertIcon className="w-6 h-6 shrink-0" />
                  <div>
                    <span>TACTICAL LAW ENFORCEMENT RECOMMENDATION</span>
                    <p>{prediction.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HOTSPOTS */}
        {tab === 'hotspots' && (
          <div className="bg-[#091123]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Live GIS Cybercrime Hotspots</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Aggregated clusters grouped by incident density from field complaints
                </p>
              </div>

              <button
                onClick={fetchHotspots}
                disabled={hotspotsLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300 hover:bg-white/10 transition-all"
              >
                <RefreshCwIcon className={hotspotsLoading ? 'animate-spin' : ''} />
                Refresh Data
              </button>
            </div>

            {hotspotsLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                Querying spatial database clusters...
              </div>
            ) : hotspots.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                No incident coordinates found. Ingest complaints with latitude/longitude to generate clusters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">Coordinates (Lat, Lng)</th>
                      <th className="py-3 px-4">Incident Count</th>
                      <th className="py-3 px-4">Threat Level</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {hotspots.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-cyan-300">
                          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {item.incident_count} reports
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.risk_level.toLowerCase().includes('high')
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : item.risk_level.toLowerCase().includes('medium')
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {item.risk_level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                          >
                            Open Map <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPLAINTS */}
        {tab === 'complaints' && (
          <div className="bg-[#091123]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">National Incident & Complaint Registry</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Database of reported cybercrime activities feeding the ML model
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNewComplaintModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Report Incident
                </button>

                <button
                  onClick={fetchComplaints}
                  disabled={complaintsLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300 hover:bg-white/10 transition-all"
                >
                  <RefreshCwIcon className={complaintsLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            {complaintsLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">Loading complaints registry...</div>
            ) : complaints.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">No complaints logged yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Crime Type</th>
                      <th className="py-3 px-4">Fraud Amount</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Coordinates</th>
                      <th className="py-3 px-4">Report Time</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {complaints.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-cyan-300">#{item.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{item.crime_type}</td>
                        <td className="py-3.5 px-4 text-emerald-400 font-mono">
                          {item.fraud_amount ? `₹${item.fraud_amount.toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{item.location || 'Unknown'}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                          {item.latitude && item.longitude
                            ? `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`
                            : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {new Date(item.complaint_time).toLocaleDateString()}{' '}
                          {new Date(item.complaint_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-xs uppercase font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRANSACTIONS */}
        {tab === 'transactions' && (
          <div className="bg-[#091123]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">Forensic Transaction Tracing</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mule accounts and illicit withdrawal transactions linked to active complaints
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNewTxModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  Log Transaction
                </button>

                <button
                  onClick={fetchTransactions}
                  disabled={transactionsLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-cyan-300 hover:bg-white/10 transition-all"
                >
                  <RefreshCwIcon className={transactionsLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            {transactionsLoading ? (
              <div className="py-16 text-center text-slate-400 text-sm">Querying ledger...</div>
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">No transactions traced yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">TXN ID</th>
                      <th className="py-3 px-4">Linked Case</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Source Account</th>
                      <th className="py-3 px-4">Destination / Node</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                          {tx.transaction_id}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">Case #{tx.complaint_id}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                          ₹{tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-300">{tx.transaction_type || 'Transfer'}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                          {tx.source_account || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-amber-300">
                          {tx.destination_account || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {new Date(tx.transaction_time).toLocaleDateString()}{' '}
                          {new Date(tx.transaction_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NEW COMPLAINT MODAL */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Report Cybercrime Incident</h3>
            <p className="text-xs text-slate-400 mb-5">
              Submit incident telemetry into the database for immediate AI hotspot processing.
            </p>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Crime Type</label>
                <select
                  value={newComplaintCrimeType}
                  onChange={(e) => setNewComplaintCrimeType(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                >
                  <option value="UPI Fraud">UPI Fraud</option>
                  <option value="ATM Cloning">ATM Cloning</option>
                  <option value="SIM Swap & OTP">SIM Swap & OTP</option>
                  <option value="Phishing Syndicate">Phishing Syndicate</option>
                  <option value="Investment Scam">Investment Scam</option>
                  <option value="Card Skimming">Card Skimming</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Fraud Amount (₹)</label>
                <input
                  type="number"
                  value={newComplaintAmount}
                  onChange={(e) => setNewComplaintAmount(e.target.value)}
                  placeholder="50000"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Region</label>
                <input
                  type="text"
                  value={newComplaintLocation}
                  onChange={(e) => setNewComplaintLocation(e.target.value)}
                  placeholder="e.g. Pune Central"
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newComplaintLat}
                    onChange={(e) => setNewComplaintLat(e.target.value)}
                    placeholder="18.5204"
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newComplaintLng}
                    onChange={(e) => setNewComplaintLng(e.target.value)}
                    placeholder="73.8567"
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewComplaintModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createComplaintLoading}
                  className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-400/20"
                >
                  {createComplaintLoading ? 'Registering...' : 'Register Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW TRANSACTION MODAL */}
      {showNewTxModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-1">Log Forensic Transaction</h3>
            <p className="text-xs text-slate-400 mb-5">
              Record suspicious withdrawal or transfer hop linked to an open investigation.
            </p>

            <form onSubmit={handleCreateTx} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Transaction Ref ID</label>
                <input
                  type="text"
                  value={newTxId}
                  onChange={(e) => setNewTxId(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Linked Case #</label>
                  <input
                    type="number"
                    value={newTxComplaintId}
                    onChange={(e) => setNewTxComplaintId(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Transaction Channel</label>
                <select
                  value={newTxType}
                  onChange={(e) => setNewTxType(e.target.value)}
                  className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                >
                  <option value="ATM Cash Withdrawal">ATM Cash Withdrawal</option>
                  <option value="IMPS Transfer">IMPS Transfer</option>
                  <option value="UPI P2P">UPI P2P</option>
                  <option value="Crypto On-Ramp">Crypto On-Ramp</option>
                  <option value="POS Swiping">POS Swiping</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Source Account</label>
                  <input
                    type="text"
                    value={newTxSource}
                    onChange={(e) => setNewTxSource(e.target.value)}
                    placeholder="e.g. AC-98124"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Destination Node / ATM</label>
                  <input
                    type="text"
                    value={newTxDest}
                    onChange={(e) => setNewTxDest(e.target.value)}
                    placeholder="e.g. ATM-MUM-40"
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewTxModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTxLoading}
                  className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-400/20"
                >
                  {createTxLoading ? 'Logging...' : 'Log Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        CyberPehra Predictive Defense Command • Secured via End-to-End Encryption • ©{' '}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}