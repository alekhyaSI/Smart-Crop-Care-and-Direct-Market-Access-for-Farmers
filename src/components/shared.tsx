import { useState, useEffect } from 'react';
import { LANGUAGES } from '../data';

// ─── Status Badge ──────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Accepted: 'bg-green-100 text-green-800 border-green-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-600 border ${colors[status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#D4E6C3] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ─── Button ────────────────────────────────────────────────────────────────
export function Btn({
  children, onClick, variant = 'primary', className = '', disabled = false, type = 'button'
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-600 text-base px-5 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-[#2D6A4F] text-white hover:bg-[#40916C] active:bg-[#1B4332]',
    secondary: 'bg-[#D8F3DC] text-[#2D6A4F] hover:bg-[#B7E4C7]',
    outline: 'bg-transparent border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#D8F3DC]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────
export function Input({
  label, value, onChange, type = 'text', placeholder = '', required = false, children
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-600 text-[#3D5A3D]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children ?? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] text-base focus:outline-none focus:ring-2 focus:ring-[#74C69D] placeholder:text-[#7A8C7A]"
        />
      )}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────
export function Select({
  label, value, onChange, options, required = false
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-600 text-[#3D5A3D]">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] text-base focus:outline-none focus:ring-2 focus:ring-[#74C69D] cursor-pointer"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Language Selector ─────────────────────────────────────────────────────
export function LanguageSelector({
  value, onChange, compact = false
}: {
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {!compact && <span className="text-sm font-500 text-[#3D5A3D]">🌐</span>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm font-500 text-[#2D6A4F] border border-[#D4E6C3] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#74C69D] cursor-pointer"
      >
        {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
}

// ─── Connectivity Indicator ────────────────────────────────────────────────
export function ConnectivityIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [simOffline, setSimOffline] = useState(false);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const isOnline = online && !simOffline;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setSimOffline(v => !v)}
        title="Click to simulate offline mode"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 cursor-pointer border ${
          isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
        {isOnline ? 'Online' : 'Offline'}
      </button>
    </div>
  );
}

// ─── Section Title ─────────────────────────────────────────────────────────
export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl text-[#1A2E1A] mb-1">{title}</h1>
      {subtitle && <p className="text-[#7A8C7A] text-base">{subtitle}</p>}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-[#7A8C7A]">
      <span className="text-5xl">{icon}</span>
      <p className="text-base text-center">{message}</p>
    </div>
  );
}
