import { Btn } from '../components/shared';

interface Props {
  onRegister: () => void;
}

const features = [
  { icon: '🌿', title: 'Crop Health', desc: 'Identify possible crop problems early and get guidance on treatment options.' },
  { icon: '📊', title: 'Market Information', desc: 'Stay informed about current market prices across nearby mandis and markets.' },
  { icon: '🤝', title: 'Buyer Connection', desc: 'Find verified buyers for your produce and send selling requests directly.' },
  { icon: '🏪', title: 'Storage', desc: 'Locate cold storage facilities nearby with available capacity information.' },
  { icon: '🚛', title: 'Transportation', desc: 'Find affordable transportation options to move your harvest to market.' },
];

export default function About({ onRegister }: Props) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-4xl text-[#1A2E1A] mb-4">About KisanSetu</h1>
        <p className="text-[#3D5A3D] text-lg leading-relaxed">
          KisanSetu is a simple farmer-focused platform that connects crop health support with market access.
          Farmers can check possible crop problems, view treatment guidance, explore market prices, find buyers,
          and discover storage and transportation options.
        </p>
      </div>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden mb-12 h-48 md:h-64 bg-[#D8F3DC]">
        <img
          src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=400&fit=crop&auto=format"
          alt="Farmers working in a field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D6A4F]/60 to-transparent flex items-center px-8">
          <p className="font-display text-2xl text-white max-w-xs">Empowering farmers with knowledge and connections</p>
        </div>
      </div>

      {/* Features */}
      <h2 className="font-display text-2xl text-[#1A2E1A] mb-6">What KisanSetu Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {features.map(f => (
          <div key={f.title} className="bg-white rounded-2xl border border-[#D4E6C3] p-6">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-700 text-base text-[#1A2E1A] mb-1">{f.title}</h3>
            <p className="text-[#7A8C7A] text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="bg-[#F0E6D3] rounded-2xl p-6 border border-[#C8A96A]/30 mb-8">
        <p className="text-[#3D5A3D] text-sm leading-relaxed">
          <strong>Note:</strong> This is a prototype demonstration application. Crop diagnosis results are simulated for demonstration purposes only.
          Always consult a qualified agricultural expert for severe crop damage. Market prices shown are demo data.
        </p>
      </div>

      <div className="flex gap-3">
        <Btn onClick={onRegister}>Register as Farmer</Btn>
      </div>
    </main>
  );
}
