import { useState } from 'react';
import { Buyer, Request, CROPS } from '../../data';
import { Btn, Input, Select, Card, PageTitle } from '../../components/shared';

interface Props {
  buyer: Buyer | null;
  onSendRequest: (req: Omit<Request, 'id' | 'date'>) => void;
  onBack: () => void;
}

export default function BuyerDetailPage({ buyer, onSendRequest, onBack }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [crop, setCrop] = useState(buyer?.crop ?? 'Tomato');
  const [quantity, setQuantity] = useState('');
  const [farmerLocation, setFarmerLocation] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!buyer) return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center text-[#7A8C7A]">
      <p>No buyer selected.</p>
      <Btn onClick={onBack} variant="outline" className="mt-4">← Back</Btn>
    </div>
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quantity || !farmerLocation) return;
    onSendRequest({
      buyerId: buyer!.id,
      buyerName: buyer!.name,
      crop,
      quantity: Number(quantity),
      price: buyer!.price,
      location: farmerLocation,
      message,
      status: 'Pending',
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-2xl text-[#1A2E1A] mb-2">Request Sent!</h2>
          <p className="text-[#7A8C7A] mb-2">Selling request sent successfully.</p>
          <div className="inline-block bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-600 mb-6">Pending</div>
          <div className="flex gap-3 justify-center">
            <Btn onClick={onBack} variant="outline">← Find More Buyers</Btn>
            <Btn onClick={() => { setSent(false); setShowForm(false); }}>View Buyer Again</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="text-sm text-[#2D6A4F] font-600 hover:underline mb-4 cursor-pointer flex items-center gap-1">
        ← Back to Buyers
      </button>
      <PageTitle title={buyer.name} subtitle={buyer.businessName} />

      <Card className="p-6 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Business Name', value: buyer.businessName },
            { label: 'Location', value: `📍 ${buyer.location}` },
            { label: 'Crop Required', value: buyer.crop },
            { label: 'Required Quantity', value: `${buyer.quantity.toLocaleString()} kg` },
            { label: 'Offered Price', value: `₹${buyer.price.toLocaleString()} / Quintal` },
            { label: 'Contact', value: buyer.contact },
          ].map(r => (
            <div key={r.label} className="bg-[#F0F9F3] rounded-xl p-3">
              <p className="text-xs text-[#7A8C7A] mb-0.5">{r.label}</p>
              <p className="font-600 text-[#1A2E1A]">{r.value}</p>
            </div>
          ))}
        </div>

        {!showForm && (
          <Btn onClick={() => setShowForm(true)} className="w-full justify-center mt-5">
            📨 Send Selling Request
          </Btn>
        )}
      </Card>

      {showForm && (
        <Card className="p-6">
          <h2 className="font-700 text-lg text-[#1A2E1A] mb-4">Send Selling Request</h2>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Select label="Crop" value={crop} onChange={setCrop} options={CROPS} />
            <Input label="Quantity (kg)" value={quantity} onChange={setQuantity} type="number" placeholder="e.g. 500" required />
            <Input label="Your Location" value={farmerLocation} onChange={setFarmerLocation} placeholder="e.g. Tenali" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600 text-[#3D5A3D]">Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="e.g. I would like to sell my tomato produce."
                rows={3}
                className="px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] text-base focus:outline-none focus:ring-2 focus:ring-[#74C69D] placeholder:text-[#7A8C7A] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Btn type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Btn>
              <Btn type="submit" className="flex-1 justify-center">Send Request</Btn>
            </div>
          </form>
        </Card>
      )}
    </main>
  );
}
