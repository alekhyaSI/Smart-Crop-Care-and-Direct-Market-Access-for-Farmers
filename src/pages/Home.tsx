import { Btn } from '../components/shared';
import { useLanguage } from '../i18n';

interface Props {
  onGetStarted: () => void;
  onExplore: () => void;
  onAbout: () => void;
}

const features = [
  { icon: '🔬', title: 'featureDiagnosis', desc: 'featureDiagnosisDesc' },
  { icon: '💊', title: 'featureTreatment', desc: 'featureTreatmentDesc' },
  { icon: '📊', title: 'featureMarket', desc: 'featureMarketDesc' },
  { icon: '🤝', title: 'featureBuyers', desc: 'featureBuyersDesc' },
  { icon: '🏪', title: 'featureStorage', desc: 'featureStorageDesc' },
  { icon: '🚛', title: 'featureLogistics', desc: 'featureLogisticsDesc' },
];

const steps = [
  { icon: '🔬', label: 'stepDiagnose' },
  { icon: '💊', label: 'stepTreat' },
  { icon: '📊', label: 'stepPrice' },
  { icon: '🤝', label: 'stepBuyer' },
  { icon: '💰', label: 'stepSell' },
];

export default function Home({ onGetStarted, onExplore, onAbout }: Props) {
  const { t } = useLanguage();

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-[#2D6A4F] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&h=600&fit=crop&auto=format')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-500 mb-6">
              🌾 {t('smartAgriculturePlatform')}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              {t('smartCropCareMarket')}
            </h1>
            <p className="text-[#B7E4C7] text-lg mb-2 font-500">{t('fromCropCareToMarket')}</p>
            <p className="text-white/80 text-base mb-8 max-w-lg">
              {t('identifyCropProblems')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn onClick={onGetStarted} className="text-base px-8 py-3.5 bg-white !text-[#2D6A4F] hover:bg-[#D8F3DC]">
                {t('getStarted')}
              </Btn>
              <Btn onClick={onExplore} variant="outline" className="text-base px-8 py-3.5 border-white/60 !text-white hover:bg-white/10">
                {t('exploreFeatures')}
              </Btn>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl text-[#1A2E1A] mb-2">{t('everythingYouNeed')}</h2>
          <p className="text-[#7A8C7A]">{t('sixPowerfulTools')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-[#D4E6C3] p-6 hover:shadow-md hover:border-[#74C69D] transition-all cursor-default">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-700 text-lg text-[#1A2E1A] mb-1">{t(f.title)}</h3>
              <p className="text-[#7A8C7A] text-sm leading-relaxed">{t(f.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#F0E6D3] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl text-[#1A2E1A] mb-2">{t('howItWorks')}</h2>
            <p className="text-[#7A8C7A]">{t('simpleJourney')}</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-0">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-[#2D6A4F] text-white rounded-2xl flex items-center justify-center text-3xl shadow-md">
                    {s.icon}
                  </div>
                  <span className="text-sm font-600 text-[#2D6A4F]">{t(s.label)}</span>
                </div>
                {i < steps.length - 1 && (
                  <span className="text-[#A07048] text-2xl font-300 mx-2 hidden md:block">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-[#1A2E1A] mb-3">{t('readyToGetStarted')}</h2>
        <p className="text-[#7A8C7A] mb-6">{t('joinFarmers')}</p>
        <Btn onClick={onGetStarted} className="text-base px-10 py-4">{t('registerNow')}</Btn>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E1A] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🌱</span>
            <span className="font-display text-xl">KisanSetu</span>
          </div>
          <p className="text-white/60 text-sm">{t('connectingFarmers')}</p>
          <div className="mt-4 flex justify-center gap-6 text-sm text-white/40">
            <span>{t('demoPrototype')}</span>
            <span>•</span>
            <button onClick={onAbout} className="hover:text-white/70 cursor-pointer">About</button>
          </div>
        </div>
      </footer>
    </main>
  );
}
