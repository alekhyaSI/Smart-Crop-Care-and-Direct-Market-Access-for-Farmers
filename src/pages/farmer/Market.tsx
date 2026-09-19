import { useState } from 'react';
import { MARKET_PRICES, CROPS, LOCATIONS } from '../../data';
import { Select, PageTitle, Card } from '../../components/shared';

export default function MarketPage() {
  const [crop, setCrop] = useState('All Crops');
  const [location, setLocation] = useState('All Locations');

  const filtered = MARKET_PRICES.filter(m =>
    (crop === 'All Crops' || m.crop === crop) &&
    (location === 'All Locations' || m.market.includes(location))
  );

  const cropOptions = ['All Crops', ...CROPS];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle title="Market Prices" subtitle="Current prices at nearby markets" />

      <div className="flex items-center justify-end mb-2">
        <span className="text-xs text-[#7A8C7A] bg-[#F0E6D3] px-3 py-1 rounded-full border border-[#C8A96A]/30">
          📋 Demo Market Data
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Select label="Filter by Crop" value={crop} onChange={setCrop} options={cropOptions} />
        <Select label="Filter by Location" value={location} onChange={setLocation} options={LOCATIONS} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#7A8C7A]">
          <span className="text-5xl">📊</span>
          <p className="mt-3">No prices found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <Card key={m.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">
                  {m.crop === 'Tomato' ? '🍅' : m.crop === 'Rice' ? '🌾' : m.crop === 'Chilli' ? '🌶️' : m.crop === 'Cotton' ? '☁️' : '🥔'}
                </div>
                <span className="text-xs text-[#7A8C7A] bg-[#F0F9F3] px-2 py-0.5 rounded-full">{m.crop}</span>
              </div>
              <h3 className="font-700 text-lg text-[#1A2E1A] mb-0.5">₹{m.price.toLocaleString()}</h3>
              <p className="text-sm text-[#7A8C7A] mb-2">per {m.unit}</p>
              <div className="border-t border-[#D4E6C3] pt-2 mt-2">
                <p className="font-500 text-sm text-[#3D5A3D]">📍 {m.market}</p>
                <p className="text-xs text-[#7A8C7A]">Updated: {m.updated}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
