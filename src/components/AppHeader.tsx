import { User } from '../data';
import { useLanguage } from '../i18n';

interface Props {
  user: User;
  language?: string;
  onLanguage?: (language: string) => void;
  onNav: (page: string) => void;
  onLogout: () => void;
  current: string;
}

export default function AppHeader({
  user,
  onNav,
  onLogout,
  current,
}: Props) {
  const { language, t } = useLanguage();

  const farmerNav = [
    {
      key: 'farmer-dashboard',
      label: t('dashboard'),
    },
    {
      key: 'diagnosis',
      label: t('diagnosis'),
    },
    {
      key: 'treatment',
      label: t('treatment'),
    },
    {
      key: 'market',
      label: t('market'),
    },
    {
      key: 'buyers',
      label: t('buyers'),
    },
    {
      key: 'storage',
      label: t('storage'),
    },
    {
      key: 'logistics',
      label: t('transport'),
    },
    {
      key: 'requests',
      label: t('requests'),
    },
  ];

  const buyerNav = [
    {
      key: 'buyer-dashboard',
      label: t('dashboard'),
    },
    {
      key: 'requirements',
      label: t('requirements'),
    },
    {
      key: 'farmer-requests',
      label: t('farmerRequests'),
    },
  ];

  const navItems =
    user.role === 'farmer'
      ? farmerNav
      : buyerNav;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">

        <button
          onClick={() =>
            onNav(
              user.role === 'farmer'
                ? 'farmer-dashboard'
                : 'buyer-dashboard'
            )
          }
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-xl text-white shadow-sm">
            🌱
          </div>

          <div className="text-left">
            <div className="text-lg font-bold leading-tight text-slate-900">
              {t('appName')}
            </div>

            <div className="text-xs text-slate-500">
              {user.role === 'farmer'
                ? t('farmer')
                : t('buyer')}
            </div>
          </div>
        </button>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                current === item.key
                  ? 'bg-green-100 text-green-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-slate-600">
              {t('online')}
            </span>
          </div>

          <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 md:block">
            {language}
          </div>

          <button
            onClick={() =>
              onNav(
                user.role === 'farmer'
                  ? 'farmer-profile'
                  : 'buyer-profile'
              )
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              current === 'farmer-profile' ||
              current === 'buyer-profile'
                ? 'border-green-500 bg-green-50'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
            title={t('profile')}
          >
            👤
          </button>

          <button
            onClick={onLogout}
            className="hidden rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:block"
          >
            {t('logout')}
          </button>

        </div>
      </div>

      <div className="border-t border-slate-100 xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 lg:px-6">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition ${
                current === item.key
                  ? 'bg-green-100 text-green-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}