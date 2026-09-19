import { useEffect, useState } from 'react';
import { User } from '../../data';
import { CROPS, LOCATIONS } from '../../data';
import { Select, PageTitle, Card, Btn } from '../../components/shared';
import { useLanguage } from '../../i18n';

interface Props {
  user: User;
}

interface MarketPrice {
  id: number;
  crop: string;
  price: number;
  unit: string;
  market: string;
  updated: string;
  farmerUsername: string;
}

export default function MarketPage({ user }: Props) {
  const { t } = useLanguage();

  const [marketPrices, setMarketPrices] =
    useState<MarketPrice[]>([]);

  const [crop, setCrop] =
    useState('All Crops');

  const [location, setLocation] =
    useState('All Locations');

  const [showForm, setShowForm] =
    useState(false);

  const [newCrop, setNewCrop] =
    useState(CROPS[0] || '');

  const [newPrice, setNewPrice] =
    useState('');

  const [newUnit, setNewUnit] =
    useState('Quintal');

  const [newMarket, setNewMarket] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const cropOptions = [
    'All Crops',
    ...CROPS
  ];

  const locationOptions = [
    'All Locations',
    ...LOCATIONS.filter(
      item => item !== 'All Locations'
    )
  ];

  async function loadMarketPrices() {
    try {
      setLoading(true);

      const response =
        await fetch(
          'http://localhost:8080/market-prices'
        );

      if (!response.ok) {
        throw new Error();
      }

      const data =
        await response.json();

      setMarketPrices(data);

    } catch {
      setMessage(
        'Unable to load market prices.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarketPrices();
  }, []);

  async function addMarketPrice() {

    if (
      !newCrop ||
      !newPrice ||
      !newUnit ||
      !newMarket
    ) {
      setMessage(
        'Please fill all fields.'
      );
      return;
    }

    if (Number(newPrice) <= 0) {
      setMessage(
        'Price must be greater than 0.'
      );
      return;
    }

    try {
      setSaving(true);
      setMessage('');

      const response =
        await fetch(
          'http://localhost:8080/market-prices',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json'
            },
            body: JSON.stringify({
              crop: newCrop,
              price: Number(newPrice),
              unit: newUnit,
              market: newMarket,
              farmerUsername:
                user.username
            })
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      setNewPrice('');
      setNewMarket('');
      setNewCrop(CROPS[0] || '');
      setNewUnit('Quintal');

      setShowForm(false);

      setMessage(
        'Market price added successfully.'
      );

      await loadMarketPrices();

    } catch {
      setMessage(
        'Unable to save market price.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteMarketPrice(
    id: number
  ) {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this market price?'
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `http://localhost:8080/market-prices/${id}`,
          {
            method: 'DELETE'
          }
        );

      if (!response.ok) {
        throw new Error();
      }

      await loadMarketPrices();

      setMessage(
        'Market price deleted successfully.'
      );

    } catch {
      setMessage(
        'Unable to delete market price.'
      );
    }
  }

  const filtered =
    marketPrices.filter(m =>
      (crop === 'All Crops' ||
        m.crop === crop) &&
      (location === 'All Locations' ||
        m.market
          .toLowerCase()
          .includes(
            location.toLowerCase()
          ))
    );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <PageTitle
          title={t('marketPrices')}
          subtitle="Add and view current market prices"
        />

        <Btn
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? '✕ Close'
            : '＋ Add Market Price'}
        </Btn>

      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-[#D4E6C3] bg-[#F0F9F3] px-4 py-3 text-sm text-[#2D6A4F]">
          {message}
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-7">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-[#1A2E1A]">
              Add Market Price
            </h2>

            <p className="text-sm text-[#7A8C7A] mt-1">
              Enter the latest price available at your market.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <Select
              label="Crop"
              value={newCrop}
              onChange={setNewCrop}
              options={CROPS}
            />

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#3D5A3D]">
                Price
              </label>

              <input
                type="number"
                min="1"
                value={newPrice}
                onChange={e =>
                  setNewPrice(e.target.value)
                }
                placeholder="Enter price"
                className="px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
              />

            </div>

            <Select
              label="Unit"
              value={newUnit}
              onChange={setNewUnit}
              options={[
                'Quintal',
                'Kg',
                'Ton'
              ]}
            />

            <div className="flex flex-col gap-1.5">

              <label className="text-sm font-semibold text-[#3D5A3D]">
                Market / Location
              </label>

              <input
                value={newMarket}
                onChange={e =>
                  setNewMarket(e.target.value)
                }
                placeholder="e.g. Tenali Market"
                className="px-4 py-3 rounded-xl border border-[#D4E6C3] bg-white text-[#1A2E1A] focus:outline-none focus:ring-2 focus:ring-[#74C69D]"
              />

            </div>

          </div>

          <div className="flex justify-end mt-6">

            <Btn
              onClick={addMarketPrice}
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Market Price'}
            </Btn>

          </div>

        </Card>
      )}

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

      {loading ? (

        <div className="text-center py-12 text-[#7A8C7A]">
          Loading market prices...
        </div>

      ) : filtered.length === 0 ? (

        <div className="text-center py-12 text-[#7A8C7A]">

          <span className="text-5xl">
            📊
          </span>

          <p className="mt-3">
            No market prices found.
          </p>

          <p className="text-sm mt-1">
            Add a market price to get started.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map(m => (

            <Card
              key={m.id}
              className="p-5 hover:shadow-md transition-shadow"
            >

              <div className="flex items-start justify-between mb-3">

                <div className="text-3xl">
                  {m.crop === 'Tomato'
                    ? '🍅'
                    : m.crop === 'Rice'
                    ? '🌾'
                    : m.crop === 'Chilli'
                    ? '🌶️'
                    : m.crop === 'Cotton'
                    ? '☁️'
                    : '🥔'}
                </div>

                <span className="text-xs text-[#7A8C7A] bg-[#F0F9F3] px-2 py-0.5 rounded-full">
                  {m.crop}
                </span>

              </div>

              <h3 className="font-bold text-lg text-[#1A2E1A]">
                ₹{m.price.toLocaleString()}
              </h3>

              <p className="text-sm text-[#7A8C7A] mb-2">
                per {m.unit}
              </p>

              <div className="border-t border-[#D4E6C3] pt-3 mt-3">

                <p className="font-medium text-sm text-[#3D5A3D]">
                  📍 {m.market}
                </p>

                <p className="text-xs text-[#7A8C7A] mt-1">
                  Updated: {m.updated}
                </p>

                <p className="text-xs text-[#7A8C7A] mt-1">
                  Added by: {m.farmerUsername}
                </p>

              </div>

              {m.farmerUsername === user.username && (
                <button
                  type="button"
                  onClick={() =>
                    deleteMarketPrice(m.id)
                  }
                  className="mt-4 text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              )}

            </Card>

          ))}

        </div>

      )}

    </main>
  );
}