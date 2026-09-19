import { User } from '../data';
import { LanguageSelector, ConnectivityIndicator } from './shared';

type FarmerPage = 'farmer-dashboard' | 'diagnosis' | 'treatment' | 'market' | 'buyers' | 'buyer-detail' | 'storage' | 'logistics' | 'requests' | 'farmer-profile';
type BuyerPage = 'buyer-dashboard' | 'buyer-profile' | 'requirements' | 'farmer-requests';
type AppPage = FarmerPage | BuyerPage;

interface Props {
  user: User;
  language: string;
  onLanguage: (l: string) => void;
  onNav: (p: AppPage) => void;
  onLogout: () => void;
  current: AppPage;
}

export default function AppHeader({ user, language, onLanguage, onNav, onLogout, current }: Props) {
  const farmerLinks: { page: FarmerPage; label: string; icon: string }[] = [
    { page: 'farmer-dashboard', label: 'Dashboard', icon: '🏠' },
    { page: 'diagnosis', label: 'Diagnosis', icon: '🔬' },
    { page: 'market', label: 'Market', icon: '📊' },
    { page: 'buyers', label: 'Buyers', icon: '🤝' },
    { page: 'storage', label: 'Storage', icon: '🏪' },
    { page: 'logistics', label: 'Transport', icon: '🚛' },
    { page: 'requests', label: 'Requests', icon: '📋' },
    { page: 'farmer-profile', label: 'Profile', icon: '👤' },
  ];

  const buyerLinks: { page: BuyerPage; label: string; icon: string }[] = [
    { page: 'buyer-dashboard', label: 'Dashboard', icon: '🏠' },
    { page: 'requirements', label: 'Requirements', icon: '📝' },
    { page: 'farmer-requests', label: 'Requests', icon: '📨' },
    { page: 'buyer-profile', label: 'Profile', icon: '👤' },
  ];

  const links = user.role === 'farmer' ? farmerLinks : buyerLinks;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#D4E6C3] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => onNav(user.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="text-2xl">🌱</span>
            <span className="font-display text-xl text-[#2D6A4F]">KisanSetu</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <ConnectivityIndicator />
            <LanguageSelector value={language} onChange={onLanguage} compact />
            <div className="hidden sm:flex items-center gap-2 text-sm text-[#3D5A3D] font-500">
              <span>{user.role === 'farmer' ? '🌾' : '🛒'}</span>
              <span>{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-sm font-600 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Bottom nav on mobile / sidebar-like nav on desktop */}
      <nav className="bg-[#FAFAF5] border-b border-[#D4E6C3]">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex items-center gap-1 py-1.5">
            {links.map(l => (
              <button
                key={l.page}
                onClick={() => onNav(l.page as AppPage)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-500 whitespace-nowrap cursor-pointer transition-colors ${
                  current === l.page ? 'bg-[#2D6A4F] text-white' : 'text-[#3D5A3D] hover:bg-[#D8F3DC]'
                }`}
              >
                <span className="text-base">{l.icon}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
