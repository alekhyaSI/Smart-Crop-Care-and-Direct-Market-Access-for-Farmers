import { User } from '../../data';
import { useLanguage } from '../../i18n';

type Page = 'buyer-profile' | 'requirements' | 'farmer-requests';

interface Props {
  user: User;
  pendingCount: number;
  onNav: (page: Page) => void;
}

export default function BuyerDashboard({ user, pendingCount, onNav }: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      page: 'buyer-profile' as Page,
      icon: '👤',
      title: t('myProfile'),
      desc: t('manageBuyerInformation'),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      page: 'requirements' as Page,
      icon: '📝',
      title: t('myRequirements'),
      desc: t('manageProduceRequirements'),
      color: 'bg-amber-50 border-amber-200'
    },
    {
      page: 'farmer-requests' as Page,
      icon: '📨',
      title: t('farmerRequests'),
      desc: t('viewRequestsFromFarmers'),
      color: 'bg-green-50 border-green-200'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F7FAF7]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="font-display text-3xl text-[#1A2E1A]">
            {t('welcomeBuyer')} 🛒
          </h1>

          <p className="text-[#7A8C7A] mt-1">
            {t('manageRequirementsAndRequests')}
          </p>
        </div>

        <div className="bg-[#2D6A4F] text-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">

          <div className="flex-1">
            <p className="text-white/70 text-sm mb-1">
              {t('loggedInAs')}
            </p>

            <p className="font-bold text-lg">
              {user.username}
            </p>

            <p className="text-white/70 text-sm">
              {user.location || t('notSet')}
            </p>
          </div>

          {user.businessName && (
            <div className="bg-white/10 rounded-xl px-4 py-3 text-sm">
              <p className="text-white/70 mb-1">
                {t('business')}
              </p>

              <p className="font-semibold">
                {user.businessName}
              </p>
            </div>
          )}

          {pendingCount > 0 && (
            <button
              type="button"
              onClick={() => onNav('farmer-requests')}
              className="bg-amber-400 text-amber-900 rounded-xl px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-amber-300 transition-colors"
            >
              📨 {pendingCount} {pendingCount === 1 ? t('pendingRequest') : t('pendingRequests')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {cards.map((card) => (
            <button
              key={card.page}
              type="button"
              onClick={() => onNav(card.page)}
              className={`${card.color} border rounded-2xl p-6 text-left hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>

              <h2 className="font-bold text-base text-[#1A2E1A] mb-1">
                {card.title}
              </h2>

              <p className="text-[#7A8C7A] text-sm">
                {card.desc}
              </p>

              <div className="mt-4 text-[#2D6A4F] text-sm font-semibold">
                {t('open')} →
              </div>
            </button>
          ))}

        </div>
      </div>
    </main>
  );
}