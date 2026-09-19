import { useState } from 'react';
import { CROPS } from '../../data';
import { Input, Select, Btn, PageTitle, Card, EmptyState } from '../../components/shared';

interface Requirement {
  id: number;
  crop: string;
  quantity: number;
  price: number;
  location: string;
  contact: string;
}

export default function RequirementsPage() {
  const [reqs, setReqs] = useState<Requirement[]>([
    { id: 1, crop: 'Tomato', quantity: 1000, price: 2700, location: 'Guntur', contact: '+91 90000 11111' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [crop, setCrop] = useState('Tomato');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [added, setAdded] = useState(false);

  function addReq(e: React.FormEvent) {
    e.preventDefault();
    if (!quantity || !price || !location) return;
    setReqs(prev => [...prev, { id: Date.now(), crop, quantity: Number(quantity), price: Number(price), location, contact }]);
    setShowForm(false);
    setQuantity(''); setPrice(''); setLocation(''); setContact('');
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function remove(id: number) {
    setReqs(prev => prev.filter(r => r.id !== id));
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <PageTitle title="My Requirements" subtitle="Manage your produce requirements" />
        <Btn onClick={() => setShowForm(v => !v)} variant={showForm ? 'outline' : 'primary'} className="shrink-0">
          {showForm ? 'Cancel' : '+ Add Requirement'}
        </Btn>
      </div>

      {added && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-800 text-sm mb-5">
          ✅ Requirement added!
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-6 border-[#74C69D]">
          <h2 className="font-700 text-base text-[#1A2E1A] mb-4">Add New Requirement</h2>
          <form onSubmit={addReq} className="flex flex-col gap-4">
            <Select label="Crop" value={crop} onChange={setCrop} options={CROPS} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity Required (kg)" value={quantity} onChange={setQuantity} type="number" placeholder="e.g. 1000" required />
              <Input label="Price Offered (₹/Quintal)" value={price} onChange={setPrice} type="number" placeholder="e.g. 2700" required />
            </div>
            <Input label="Location" value={location} onChange={setLocation} placeholder="e.g. Guntur" required />
            <Input label="Contact" value={contact} onChange={setContact} placeholder="+91 XXXXX XXXXX" />
            <Btn type="submit" className="w-full justify-center">Add Requirement</Btn>
          </form>
        </Card>
      )}

      {reqs.length === 0 ? (
        <EmptyState icon="📝" message="No requirements added. Click 'Add Requirement' to get started." />
      ) : (
        <div className="flex flex-col gap-4">
          {reqs.map(r => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{r.crop === 'Tomato' ? '🍅' : r.crop === 'Rice' ? '🌾' : r.crop === 'Chilli' ? '🌶️' : r.crop === 'Cotton' ? '☁️' : '🥔'}</span>
                  <h3 className="font-700 text-base text-[#1A2E1A]">{r.crop}</h3>
                </div>
                <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">Remove</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#7A8C7A]">Quantity</p>
                  <p className="font-600">{r.quantity.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Price</p>
                  <p className="font-700 text-[#2D6A4F]">₹{r.price.toLocaleString()} / Qtl</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Location</p>
                  <p className="font-600">📍 {r.location}</p>
                </div>
                {r.contact && (
                  <div>
                    <p className="text-xs text-[#7A8C7A]">Contact</p>
                    <p className="font-600">{r.contact}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
