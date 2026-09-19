import { User } from '../../data';

type Page = 'diagnosis' | 'market' | 'buyers' | 'storage' | 'logistics' | 'requests' | 'farmer-profile';

interface Props {
  user: User;
  onNav: (p: Page) => void;
}

const cards = [
  { page: 'diagnosis' as Page, icon: '🔬', title: 'Crop Diagnosis', desc: 'Check your crop health', color: 'bg-green-50 border-green-200' },
  { page: 'market' as Page, icon: '📊', title: 'Market Prices', desc: 'Check current market prices', color: 'bg-blue-50 border-blue-200' },
  { page: 'buyers' as Page, icon: '🤝', title: 'Find Buyers', desc: 'Find buyers for your produce', color: 'bg-amber-50 border-amber-200' },
  { page: 'storage' as Page, icon: '🏪', title: 'Cold Storage', desc: 'Find nearby storage', color: 'bg-purple-50 border-purple-200' },
  { page: 'logistics' as Page, icon: '🚛', title: 'Logistics', desc: 'Find transportation', color: 'bg-orange-50 border-orange-200' },
  { page: 'requests' as Page, icon: '📋', title: 'My Requests', desc: 'Track your selling requests', color: 'bg-teal-50 border-teal-200' },
];

export default function FarmerDashboard({ user, onNav }: Props) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#1A2E1A]">Welcome, Farmer! 🌾</h1>
        <p className="text-[#7A8C7A] mt-1">What would you like to do today?</p>
      </div>

      {/* Quick info */}
      <div className="bg-[#2D6A4F] text-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-white/70 text-sm mb-0.5">Logged in as</p>
          <p className="font-700 text-lg">{user.username}</p>
          <p className="text-white/70 text-sm">{user.location}</p>
        </div>
        <div className="bg-white/10 rounded-xl px-4 py-3 text-sm">
          <p className="text-white/70 mb-0.5">Crops Grown</p>
          <p className="font-600">{user.cropsGrown || 'Not set'}</p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <button
            key={c.page}
            onClick={() => onNav(c.page)}
            className={`${c.color} border rounded-2xl p-6 text-left hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{c.icon}</div>
            <h2 className="font-700 text-lg text-[#1A2E1A] mb-1">{c.title}</h2>
            <p className="text-[#7A8C7A] text-sm">{c.desc}</p>
            <div className="mt-4 text-[#2D6A4F] text-sm font-600">Open →</div>
          </button>
        ))}
      </div>

      {/* Journey reminder */}
      <div className="mt-8 bg-[#F0E6D3] rounded-2xl p-5 border border-[#C8A96A]/30">
        <p className="text-sm font-600 text-[#A07048] mb-2">Your Journey</p>
        <div className="flex flex-wrap gap-2 text-xs font-600 text-[#3D5A3D]">
          {['Diagnose', 'Treat', 'Check Price', 'Find Buyer', 'Sell', 'Store', 'Transport'].map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className="bg-white px-2 py-1 rounded-lg border border-[#D4E6C3]">{s}</span>
              {i < 6 && <span className="text-[#A07048]">→</span>}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
