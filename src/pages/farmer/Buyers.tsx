import { useEffect, useState } from 'react';
import { Buyer, CROPS, LOCATIONS } from '../../data';
import { Select, Btn, PageTitle, Card } from '../../components/shared';
import { useLanguage } from '../../i18n';

interface Props {
  onViewBuyer: (b: Buyer) => void;
}

interface BuyerFromDatabase {
  id: number;
  username: string;
  email: string;
  role: string;
  preferredLanguage?: string;
  name?: string;
  phone?: string;
  location?: string;
  businessName?: string;
  buyerType?: string;
  cropsRequired?: string;
  quantityRequired?: number;
  offeredPrice?: number;
}

export default function BuyersPage({ onViewBuyer }: Props) {
  const { t } = useLanguage();

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [crop, setCrop] = useState('All Crops');
  const [location, setLocation] = useState('All Locations');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBuyers();
  }, []);

  async function loadBuyers() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/buyers');

      if (!response.ok) {
        throw new Error('Unable to load buyers');
      }

      const data: BuyerFromDatabase[] = await response.json();

      const convertedBuyers: Buyer[] = data.map((buyer) => ({
        id: buyer.id,
        username: buyer.username,
        name: buyer.name || buyer.username,
        businessName: buyer.businessName || 'Buyer',
        crop: buyer.cropsRequired
          ? buyer.cropsRequired.split(',')[0].trim()
          : 'Not specified',
        quantity: buyer.quantityRequired || 0,
        price: buyer.offeredPrice || 0,
        location: buyer.location || 'Not specified',
        contact: buyer.phone || buyer.email
      }));

      setBuyers(convertedBuyers);
    } catch (err) {
      setError('Unable to connect to the server. Please make sure Spring Boot is running.');
    } finally {
      setLoading(false);
    }
  }

  const cropOptions = ['All Crops', ...CROPS];

  const availableLocations = Array.from(
    new Set([
      ...LOCATIONS,
      ...buyers
        .map((buyer) => buyer.location)
        .filter((location) => location && location !== 'Not specified')
    ])
  );

  const locationOptions = Array.from(
  new Set(['All Locations', ...availableLocations])
);

  const filtered = buyers.filter((buyer) =>
    (crop === 'All Crops' || buyer.crop === crop) &&
    (location === 'All Locations' || buyer.location === location)
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <PageTitle
        title="Find Buyers"
        subtitle="Connect directly with buyers for your produce"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Select
          label="Filter by Crop"
          value={crop}
          onChange={setCrop}
          options={cropOptions}
        />

        <Select
          label="Filter by Location"
          value={location}
          onChange={setLocation}
          options={locationOptions}
        />
      </div>

      {loading && (
        <Card className="p-10 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-[#7A8C7A]">
            Loading registered buyers...
          </p>
        </Card>
      )}

      {!loading && error && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>

          <p className="text-red-600 font-600 mb-4">
            {error}
          </p>

          <Btn
            onClick={loadBuyers}
            variant="outline"
          >
            Try Again
          </Btn>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-[#7A8C7A]">
          <span className="text-5xl">🤝</span>

          <p className="mt-3">
            No registered buyers found for this filter.
          </p>

          <p className="text-sm mt-1">
            Buyers who register on KisanSetu will appear here.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map((buyer) => (
            <Card
              key={buyer.id}
              className="p-5 hover:shadow-md transition-all"
            >

              <div className="flex items-start gap-3 mb-4">

                <div className="w-12 h-12 bg-[#D8F3DC] rounded-xl flex items-center justify-center text-2xl shrink-0">
                  🏢
                </div>

                <div className="min-w-0">

                  <h3 className="font-700 text-base text-[#1A2E1A] leading-tight">
                    {buyer.name}
                  </h3>

                  <p className="text-xs text-[#7A8C7A] truncate">
                    {buyer.businessName}
                  </p>

                </div>

              </div>

              <div className="flex flex-col gap-2 text-sm mb-4">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#7A8C7A]">
                    Crop
                  </span>

                  <span className="font-600 text-[#1A2E1A] text-right">
                    {buyer.crop}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#7A8C7A]">
                    Required
                  </span>

                  <span className="font-600 text-[#1A2E1A] text-right">
                    {buyer.quantity > 0
                      ? `${buyer.quantity.toLocaleString()} kg`
                      : 'Not specified'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#7A8C7A]">
                    Offered Price
                  </span>

                  <span className="font-700 text-[#2D6A4F] text-right">
                    {buyer.price > 0
                      ? `₹${buyer.price.toLocaleString()} / Quintal`
                      : 'Not specified'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[#7A8C7A]">
                    Location
                  </span>

                  <span className="font-500 text-[#3D5A3D] text-right">
                    📍 {buyer.location}
                  </span>
                </div>

              </div>

              <Btn
                onClick={() => onViewBuyer(buyer)}
                className="w-full justify-center"
                variant="secondary"
              >
                View Details
              </Btn>

            </Card>
          ))}

        </div>
      )}

    </main>
  );
}