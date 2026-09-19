import { LanguageSelector, ConnectivityIndicator } from './shared';

type Page = 'home' | 'about' | 'login' | 'register';

interface Props {
  current: Page;
  onNav: (p: Page) => void;
  language: string;
  onLanguage: (l: string) => void;
}

export default function PublicHeader({ current, onNav, language, onLanguage }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#D4E6C3] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button onClick={() => onNav('home')} className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl">🌱</span>
          <span className="font-display text-xl text-[#2D6A4F]">KisanSetu</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {(['home', 'about', 'login', 'register'] as Page[]).map(p => (
            <button
              key={p}
              onClick={() => onNav(p)}
              className={`px-4 py-2 rounded-lg text-sm font-600 capitalize cursor-pointer transition-colors ${
                current === p ? 'bg-[#D8F3DC] text-[#2D6A4F]' : 'text-[#3D5A3D] hover:bg-[#F0E6D3]'
              }`}
            >
              {p === 'login' ? 'Login' : p === 'register' ? 'Register' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ConnectivityIndicator />
          <LanguageSelector value={language} onChange={onLanguage} compact />
          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1">
            <button onClick={() => onNav('login')} className="px-3 py-1.5 text-sm font-600 text-[#2D6A4F] border border-[#2D6A4F] rounded-lg hover:bg-[#D8F3DC] cursor-pointer">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
