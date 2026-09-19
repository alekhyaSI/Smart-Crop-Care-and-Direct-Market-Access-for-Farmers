import { useState } from 'react';
import { STORAGES, Storage } from '../../data';
import { Btn, PageTitle, Card } from '../../components/shared';

export default function StoragePage() {
  const [selected, setSelected] = useState<Storage | null>(null);

  if (selected) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => setSelected(null)} className="text-sm text-[#2D6A4F] font-600 hover:underline mb-4 cursor-pointer">
          ← Back to Storage
        </button>
        <PageTitle title={selected.name} subtitle={`${selected.distance} km away`} />
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-5">
            {[
              { label: 'Location', value: `📍 ${selected.location}` },
              { label: 'Distance', value: `${selected.distance} km` },
              { label: 'Total Capacity', value: `${selected.capacity} MT` },
              { label: 'Available Space', value: `${selected.available} MT` },
              { label: 'Estimated Cost', value: selected.cost },
              { label: 'Contact', value: selected.phone },
            ].map(r => (
              <div key={r.label} className="bg-[#F0F9F3] rounded-xl p-3">
                <p className="text-xs text-[#7A8C7A] mb-0.5">{r.label}</p>
                <p className="font-600 text-[#1A2E1A]">{r.value}</p>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <p className="text-xs text-[#7A8C7A] mb-2">Supported Crops</p>
            <div className="flex flex-wrap gap-2">
              {selected.crops.map(c => (
                <span key={c} className="bg-[#D8F3DC] text-[#2D6A4F] text-sm font-600 px-3 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
          <div className="bg-[#F0E6D3] rounded-xl p-3 text-sm text-[#A07048] mb-4">
            📋 Demo information only. Contact the facility for actual availability and pricing.
          </div>
          <Btn className="w-full justify-center">📞 Contact: {selected.phone}</Btn>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle title="Cold Storage" subtitle="Find nearby storage facilities for your produce" />
      <div className="flex justify-end mb-4">
        <span className="text-xs text-[#7A8C7A] bg-[#F0E6D3] px-3 py-1 rounded-full border border-[#C8A96A]/30">📋 Demo Data</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {STORAGES.map(s => (
          <Card key={s.id} className="p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🏪</div>
              <div>
                <h3 className="font-700 text-base text-[#1A2E1A]">{s.name}</h3>
                <p className="text-sm text-[#7A8C7A]">📍 {s.location} • {s.distance} km away</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="bg-[#F0F9F3] rounded-lg p-2">
                <p className="text-xs text-[#7A8C7A]">Capacity</p>
                <p className="font-600">{s.capacity} MT</p>
              </div>
              <div className="bg-[#F0F9F3] rounded-lg p-2">
                <p className="text-xs text-[#7A8C7A]">Available</p>
                <p className="font-600 text-[#2D6A4F]">{s.available} MT</p>
              </div>
            </div>
            <p className="text-sm text-[#3D5A3D] mb-1">
              <span className="text-[#7A8C7A]">Cost:</span> <strong>{s.cost}</strong>
            </p>
            <div className="flex flex-wrap gap-1 mb-4">
              {s.crops.map(c => (
                <span key={c} className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-600 px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <Btn onClick={() => setSelected(s)} variant="secondary" className="flex-1 justify-center text-sm py-2">View Details</Btn>
              <Btn variant="outline" className="text-sm py-2">Contact</Btn>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
