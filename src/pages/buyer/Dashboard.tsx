import { User, Request } from '../../data';

type Page = 'buyer-profile' | 'requirements' | 'farmer-requests';

interface Props {
  user: User;
  pendingCount: number;
  onNav: (p: Page) => void;
}

const cards = [
  { page: 'buyer-profile' as Page, icon: '👤', title: 'My Profile', desc: 'Manage buyer information', color: 'bg-blue-50 border-blue-200' },
  { page: 'requirements' as Page, icon: '📝', title: 'My Requirements', desc: 'Add and manage produce requirements', color: 'bg-amber-50 border-amber-200' },
  { page: 'farmer-requests' as Page, icon: '📨', title: 'Farmer Requests', desc: 'View requests from farmers', color: 'bg-green-50 border-green-200' },
];

export default function BuyerDashboard({ user, pendingCount, onNav }: Props) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-[#1A2E1A]">Welcome, Buyer! 🛒</h1>
        <p className="text-[#7A8C7A] mt-1">Manage your requirements and farmer requests</p>
      </div>

      <div className="bg-[#2D6A4F] text-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-white/70 text-sm mb-0.5">Logged in as</p>
          <p className="font-700 text-lg">{user.username}</p>
          <p className="text-white/70 text-sm">{user.location}</p>
        </div>
        {user.businessName && (
          <div className="bg-white/10 rounded-xl px-4 py-3 text-sm">
            <p className="text-white/70 mb-0.5">Business</p>
            <p className="font-600">{user.businessName}</p>
          </div>
        )}
        {pendingCount > 0 && (
          <button
            onClick={() => onNav('farmer-requests')}
            className="bg-amber-400 text-amber-900 rounded-xl px-4 py-3 text-sm font-600 cursor-pointer hover:bg-amber-300 transition-colors"
          >
            📨 {pendingCount} Pending Request{pendingCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map(c => (
          <button
            key={c.page}
            onClick={() => onNav(c.page)}
            className={`${c.color} border rounded-2xl p-6 text-left hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{c.icon}</div>
            <h2 className="font-700 text-base text-[#1A2E1A] mb-1">{c.title}</h2>
            <p className="text-[#7A8C7A] text-sm">{c.desc}</p>
            <div className="mt-4 text-[#2D6A4F] text-sm font-600">Open →</div>
          </button>
        ))}
      </div>
    </main>
  );
}
