import { useEffect, useState } from 'react';
import { CROPS, User } from '../../data';
import {
  Input,
  Select,
  Btn,
  PageTitle,
  Card,
  EmptyState,
} from '../../components/shared';
import { useLanguage } from '../../i18n';

interface Requirement {
  id: number;
  buyerUsername: string;
  buyerName: string;
  businessName: string;
  crop: string;
  quantity: number;
  price: number;
  location: string;
  contact: string;
}

interface Props {
  user: User;
}

export default function RequirementsPage({
  user,
}: Props) {
  const { t } = useLanguage();

  const [reqs, setReqs] =
    useState<Requirement[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [crop, setCrop] =
    useState('Tomato');

  const [quantity, setQuantity] =
    useState('');

  const [price, setPrice] =
    useState('');

  const [location, setLocation] =
    useState('');

  const [contact, setContact] =
    useState(user.phone || '');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [added, setAdded] =
    useState(false);

  useEffect(() => {
    loadRequirements();
  }, [user.username]);

  async function loadRequirements() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://localhost:8080/requirements/buyer/${encodeURIComponent(
          user.username
        )}`
      );

      if (!response.ok) {
        throw new Error(
          'Unable to load requirements'
        );
      }

      const data = await response.json();

      setReqs(
        Array.isArray(data) ? data : []
      );
    } catch {
      setError(
        'Unable to connect to the server. Please make sure Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function addReq(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      !quantity ||
      !price ||
      !location
    ) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(
        'http://localhost:8080/requirements',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buyerUsername: user.username,
            buyerName: user.name,
            businessName: user.businessName || '',
            crop,
            quantity: Number(quantity),
            price: Number(price),
            location,
            contact,
          }),
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message || 'Unable to add requirement'
        );
      }

      const saved =
        await response.json();

      setReqs(prev => [
        ...prev,
        saved,
      ]);

      setShowForm(false);
      setQuantity('');
      setPrice('');
      setLocation('');
      setContact(user.phone || '');
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2500);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to add requirement'
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    try {
      const response = await fetch(
        `http://localhost:8080/requirements/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to remove requirement'
        );
      }

      setReqs(prev =>
        prev.filter(
          requirement =>
            requirement.id !== id
        )
      );

    } catch {
      setError(
        'Unable to remove the requirement.'
      );
    }
  }

  function getCropIcon(
    cropName: string
  ) {
    if (cropName === 'Tomato') {
      return '🍅';
    }

    if (cropName === 'Rice') {
      return '🌾';
    }

    if (cropName === 'Chilli') {
      return '🌶️';
    }

    if (cropName === 'Cotton') {
      return '☁️';
    }

    return '🥔';
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">

      <div className="flex items-start justify-between mb-6 gap-4">

        <PageTitle
          title={t('myRequirements')}
          subtitle={t('manageProduceRequirements')}
        />

        <Btn
          onClick={() =>
            setShowForm(value => !value)
          }
          variant={
            showForm
              ? 'outline'
              : 'primary'
          }
          className="shrink-0"
        >
          {showForm
            ? t('cancel')
            : `+ ${t('addRequirement')}`}
        </Btn>

      </div>

      {added && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-800 text-sm mb-5">
          ✅ {t('requirementAdded')}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm mb-5">
          ⚠️ {error}
        </div>
      )}

      {showForm && (
        <Card className="p-6 mb-6 border-[#74C69D]">

          <h2 className="font-700 text-base text-[#1A2E1A] mb-4">
            {t('addNewRequirement')}
          </h2>

          <form
            onSubmit={addReq}
            className="flex flex-col gap-4"
          >

            <Select
              label={t('crop')}
              value={crop}
              onChange={setCrop}
              options={CROPS}
            />

            <div className="grid grid-cols-2 gap-4">

              <Input
                label={t('quantityRequired')}
                value={quantity}
                onChange={setQuantity}
                type="number"
                placeholder="e.g. 1000"
                required
              />

              <Input
                label={t('priceOffered')}
                value={price}
                onChange={setPrice}
                type="number"
                placeholder="e.g. 2700"
                required
              />

            </div>

            <Input
              label={t('location')}
              value={location}
              onChange={setLocation}
              placeholder="e.g. Guntur"
              required
            />

            <Input
              label={t('contact')}
              value={contact}
              onChange={setContact}
              placeholder="+91 XXXXX XXXXX"
            />

            <Btn
              type="submit"
              disabled={saving}
              className="w-full justify-center"
            >
              {saving
                ? 'Saving...'
                : t('addRequirement')}
            </Btn>

          </form>

        </Card>
      )}

      {loading ? (
        <Card className="p-10 text-center">

          <div className="text-4xl mb-3">
            ⏳
          </div>

          <p className="text-[#7A8C7A]">
            Loading your requirements...
          </p>

        </Card>
      ) : reqs.length === 0 ? (
        <EmptyState
          icon="📝"
          message={t('noRequirements')}
        />
      ) : (
        <div className="flex flex-col gap-4">

          {reqs.map(r => (
            <Card
              key={r.id}
              className="p-5"
            >

              <div className="flex items-start justify-between gap-3 mb-3">

                <div className="flex items-center gap-2">

                  <span className="text-2xl">
                    {getCropIcon(r.crop)}
                  </span>

                  <div>

                    <h3 className="font-700 text-base text-[#1A2E1A]">
                      {r.crop}
                    </h3>

                    {r.businessName && (
                      <p className="text-xs text-[#7A8C7A]">
                        {r.businessName}
                      </p>
                    )}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    remove(r.id)
                  }
                  className="text-red-400 hover:text-red-600 text-sm cursor-pointer"
                >
                  {t('remove')}
                </button>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">

                <div>
                  <p className="text-xs text-[#7A8C7A]">
                    {t('quantity')}
                  </p>

                  <p className="font-600">
                    {Number(
                      r.quantity
                    ).toLocaleString()} kg
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7A8C7A]">
                    {t('price')}
                  </p>

                  <p className="font-700 text-[#2D6A4F]">
                    ₹
                    {Number(
                      r.price
                    ).toLocaleString()} / Qtl
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#7A8C7A]">
                    {t('location')}
                  </p>

                  <p className="font-600">
                    📍 {r.location}
                  </p>
                </div>

                {r.contact && (
                  <div>
                    <p className="text-xs text-[#7A8C7A]">
                      {t('contact')}
                    </p>

                    <p className="font-600">
                      {r.contact}
                    </p>
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