import { useState } from 'react';
import { User, LANGUAGES } from '../../data';
import { Input, Select, Btn, PageTitle, Card } from '../../components/shared';

interface Props {
  user: User;
  onUpdate: (u: User) => void;
}

const BUYER_TYPES = ['Individual Buyer', 'Business', 'FPO'];

export default function BuyerProfilePage({ user, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName ?? '');
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(user.location);
  const [lang, setLang] = useState(user.preferredLanguage);
  const [buyerType, setBuyerType] = useState(user.buyerType ?? 'Business');
  const [saved, setSaved] = useState(false);

  function save() {
    onUpdate({ ...user, name, businessName, phone, location, preferredLanguage: lang, buyerType });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <PageTitle title="My Profile" subtitle="Your buyer information" />

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-800 text-sm mb-5">
          ✅ Profile saved successfully!
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">🛒</div>
          <div>
            <h2 className="font-700 text-lg text-[#1A2E1A]">{user.name}</h2>
            <p className="text-sm text-[#7A8C7A]">@{user.username} • Buyer</p>
          </div>
        </div>

        {editing ? (
          <div className="flex flex-col gap-4">
            <Input label="Name" value={name} onChange={setName} placeholder="Your name" />
            <Input label="Business Name" value={businessName} onChange={setBusinessName} placeholder="Your business name" />
            <Input label="Phone" value={phone} onChange={setPhone} type="tel" placeholder="+91 XXXXX XXXXX" />
            <Input label="Location" value={location} onChange={setLocation} placeholder="Your city" />
            <Select label="Preferred Language" value={lang} onChange={setLang} options={LANGUAGES} />
            <Select label="Buyer Type" value={buyerType} onChange={setBuyerType} options={BUYER_TYPES} />
            <div className="flex gap-3 pt-2">
              <Btn variant="outline" onClick={() => setEditing(false)}>Cancel</Btn>
              <Btn onClick={save} className="flex-1 justify-center">Save Profile</Btn>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {[
              { label: 'Name', value: user.name },
              { label: 'Username', value: `@${user.username}` },
              { label: 'Business Name', value: user.businessName || 'Not set' },
              { label: 'Phone', value: user.phone || 'Not set' },
              { label: 'Location', value: user.location || 'Not set' },
              { label: 'Preferred Language', value: user.preferredLanguage },
              { label: 'Buyer Type', value: user.buyerType || 'Not set' },
            ].map(r => (
              <div key={r.label} className="flex items-start justify-between gap-4 py-2 border-b border-[#D4E6C3] last:border-0">
                <span className="text-sm text-[#7A8C7A] shrink-0">{r.label}</span>
                <span className="text-sm font-600 text-[#1A2E1A] text-right">{r.value}</span>
              </div>
            ))}
            <Btn onClick={() => setEditing(true)} variant="secondary" className="mt-2">✏️ Edit Profile</Btn>
          </div>
        )}
      </Card>
    </main>
  );
}
