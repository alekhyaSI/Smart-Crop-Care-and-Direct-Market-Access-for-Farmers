import { useState } from 'react';
import { TRANSPORTS, CROPS } from '../../data';
import { Select, Input, Btn, PageTitle, Card } from '../../components/shared';

export default function LogisticsPage() {
  const [produce, setProduce] = useState('Tomato');
  const [quantity, setQuantity] = useState('');
  const [pickup, setPickup] = useState('');
  const [dest, setDest] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle title="Transportation" subtitle="Find affordable transport for your harvest" />

      <Card className="p-6 mb-6">
        <h2 className="font-700 text-base text-[#1A2E1A] mb-4">Search Transportation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Select label="Produce" value={produce} onChange={setProduce} options={CROPS} />
          <Input label="Quantity (kg)" value={quantity} onChange={setQuantity} type="number" placeholder="e.g. 1000" />
          <Input label="Pickup Location" value={pickup} onChange={setPickup} placeholder="e.g. Tenali" />
          <Input label="Destination" value={dest} onChange={setDest} placeholder="e.g. Guntur" />
        </div>
        <Btn onClick={() => setSearched(true)} className="w-full sm:w-auto">🔍 Find Transportation</Btn>
      </Card>

      <div className="flex justify-end mb-4">
        <span className="text-xs text-[#7A8C7A] bg-[#F0E6D3] px-3 py-1 rounded-full border border-[#C8A96A]/30">📋 Demo Data – Estimated Costs</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TRANSPORTS.map(t => (
          <Card key={t.id} className="p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🚛</div>
              <div>
                <h3 className="font-700 text-base text-[#1A2E1A]">{t.name}</h3>
                <p className="text-sm text-[#7A8C7A]">Capacity: {t.capacity.toLocaleString()} kg</p>
              </div>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-3 mb-4">
              <p className="text-xs text-[#7A8C7A] mb-0.5">Estimated Cost</p>
              <p className="font-700 text-xl text-[#2D6A4F]">₹{t.estimatedCost.toLocaleString()}</p>
              {searched && pickup && dest && (
                <p className="text-xs text-[#7A8C7A] mt-0.5">{pickup} → {dest}</p>
              )}
            </div>

            {searched && (
              <div className="bg-amber-50 rounded-lg p-2 mb-3 text-xs text-amber-800">
                ⚠️ Estimated cost only. Actual cost may vary.
              </div>
            )}

            <Btn variant="secondary" className="w-full justify-center text-sm py-2">View Details</Btn>
          </Card>
        ))}
      </div>
    </main>
  );
}
