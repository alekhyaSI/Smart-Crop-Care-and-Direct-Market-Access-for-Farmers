import { useState } from 'react';
import { BUYERS, Buyer, CROPS, LOCATIONS } from '../../data';
import { Select, Btn, PageTitle, Card } from '../../components/shared';

interface Props {
  onViewBuyer: (b: Buyer) => void;
}

export default function BuyersPage({ onViewBuyer }: Props) {
  const [crop, setCrop] = useState('All Crops');
  const [location, setLocation] = useState('All Locations');

  const cropOptions = ['All Crops', ...CROPS];

  const filtered = BUYERS.filter(b =>
    (crop === 'All Crops' || b.crop === crop) &&
    (location === 'All Locations' || b.location === location)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle title="Find Buyers" subtitle="Connect directly with buyers for your produce" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Select label="Filter by Crop" value={crop} onChange={setCrop} options={cropOptions} />
        <Select label="Filter by Location" value={location} onChange={setLocation} options={LOCATIONS} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#7A8C7A]">
          <span className="text-5xl">🤝</span>
          <p className="mt-3">No buyers found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(b => (
            <Card key={b.id} className="p-5 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-2xl shrink-0">🏢</div>
                <div>
                  <h3 className="font-700 text-base text-[#1A2E1A] leading-tight">{b.name}</h3>
                  <p className="text-xs text-[#7A8C7A]">{b.businessName}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#7A8C7A]">Crop</span>
                  <span className="font-600 text-[#1A2E1A]">{b.crop}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A8C7A]">Required</span>
                  <span className="font-600 text-[#1A2E1A]">{b.quantity.toLocaleString()} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A8C7A]">Offered Price</span>
                  <span className="font-700 text-[#2D6A4F]">₹{b.price.toLocaleString()} / Quintal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A8C7A]">Location</span>
                  <span className="font-500 text-[#3D5A3D]">📍 {b.location}</span>
                </div>
              </div>

              <Btn onClick={() => onViewBuyer(b)} className="w-full justify-center" variant="secondary">
                View Details
              </Btn>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
