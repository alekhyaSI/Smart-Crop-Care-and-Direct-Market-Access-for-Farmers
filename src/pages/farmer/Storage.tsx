import { useEffect, useMemo, useState } from 'react';
import { Btn, PageTitle, Card } from '../../components/shared';

interface StorageData {
  id: number;
  name: string;
  ownerName: string;
  ownerUsername: string;
  location: string;
  distance: number;
  capacity: number;
  available: number;
  cost: string;
  phone: string;
  crops: string;
}

export default function StoragePage() {
  const [storages, setStorages] = useState<StorageData[]>([]);
  const [selected, setSelected] =
    useState<StorageData | null>(null);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStorages();
  }, []);

  async function loadStorages() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:8080/storages'
      );

      if (!response.ok) {
        throw new Error(
          'Unable to load storage facilities'
        );
      }

      const data = await response.json();

      setStorages(
        Array.isArray(data) ? data : []
      );
    } catch {
      setError(
        'Unable to connect to the storage server. Please make sure Spring Boot is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredStorages = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return storages;
    }

    return storages.filter(storage => {
      const searchableText = [
        storage.name,
        storage.ownerName,
        storage.location,
        storage.crops,
        storage.cost,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(value);
    });
  }, [storages, search]);

  function getCrops(crops: string) {
    return crops
      ? crops
          .split(',')
          .map(crop => crop.trim())
          .filter(Boolean)
      : [];
  }

  function getOccupancy(storage: StorageData) {
    const capacity = Number(storage.capacity || 0);
    const available = Number(storage.available || 0);

    if (capacity <= 0) {
      return 0;
    }

    const used = capacity - available;

    return Math.min(
      100,
      Math.max(
        0,
        Math.round((used / capacity) * 100)
      )
    );
  }

  function getAvailabilityStatus(
    storage: StorageData
  ) {
    const capacity = Number(
      storage.capacity || 0
    );

    const available = Number(
      storage.available || 0
    );

    if (capacity <= 0) {
      return {
        text: 'Availability unknown',
        className:
          'bg-gray-100 text-gray-600',
      };
    }

    if (available <= 0) {
      return {
        text: 'Full',
        className:
          'bg-red-100 text-red-700',
      };
    }

    const percentage =
      (available / capacity) * 100;

    if (percentage <= 20) {
      return {
        text: 'Limited Space',
        className:
          'bg-orange-100 text-orange-700',
      };
    }

    return {
      text: 'Space Available',
      className:
        'bg-[#D8F3DC] text-[#2D6A4F]',
    };
  }

  if (selected) {
    const supportedCrops =
      getCrops(selected.crops);

    const occupancy =
      getOccupancy(selected);

    const availability =
      getAvailabilityStatus(selected);

    return (
      <main className="max-w-3xl mx-auto px-4 py-8">

        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-sm text-[#2D6A4F] font-semibold hover:underline mb-4 cursor-pointer"
        >
          ← Back to Storage
        </button>

        <PageTitle
          title={selected.name}
          subtitle={`${selected.distance || 0} km away`}
        />

        <Card className="p-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">

            <div className="w-16 h-16 bg-[#EAF5E4] rounded-2xl flex items-center justify-center text-3xl">
              🏪
            </div>

            <div className="flex-1">

              <h2 className="text-xl font-bold text-[#1A2E1A]">
                {selected.name}
              </h2>

              <p className="text-sm text-[#7A8C7A]">
                Managed by {selected.ownerName}
              </p>

              <div className="mt-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${availability.className}`}
                >
                  {availability.text}
                </span>
              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Location
              </p>

              <p className="font-semibold text-[#1A2E1A]">
                📍 {selected.location}
              </p>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Distance
              </p>

              <p className="font-semibold text-[#1A2E1A]">
                {selected.distance || 0} km
              </p>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Total Capacity
              </p>

              <p className="font-semibold text-[#1A2E1A]">
                {selected.capacity || 0} MT
              </p>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Available Space
              </p>

              <p className="font-semibold text-[#2D6A4F]">
                {selected.available || 0} MT
              </p>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Estimated Cost
              </p>

              <p className="font-semibold text-[#1A2E1A]">
                {selected.cost || 'Not specified'}
              </p>
            </div>

            <div className="bg-[#F0F9F3] rounded-xl p-4">
              <p className="text-xs text-[#7A8C7A] mb-1">
                Contact
              </p>

              <p className="font-semibold text-[#1A2E1A]">
                {selected.phone || 'Not available'}
              </p>
            </div>

          </div>

          <div className="mb-6">

            <div className="flex justify-between items-center mb-2">

              <p className="text-sm font-semibold text-[#1A2E1A]">
                Storage Occupancy
              </p>

              <p className="text-sm font-semibold text-[#547054]">
                {occupancy}%
              </p>

            </div>

            <div className="h-3 bg-[#E7EEE2] rounded-full overflow-hidden">

              <div
                className="h-full bg-[#4F8A62] rounded-full transition-all"
                style={{
                  width: `${occupancy}%`,
                }}
              />

            </div>

            <p className="text-xs text-[#7A8C7A] mt-2">
              {selected.available || 0} MT currently available out of{' '}
              {selected.capacity || 0} MT
            </p>

          </div>

          <div className="mb-6">

            <p className="text-sm font-semibold text-[#1A2E1A] mb-2">
              Supported Crops
            </p>

            <div className="flex flex-wrap gap-2">

              {supportedCrops.length > 0 ? (
                supportedCrops.map(crop => (
                  <span
                    key={crop}
                    className="bg-[#D8F3DC] text-[#2D6A4F] text-sm font-semibold px-3 py-1 rounded-full"
                  >
                    {crop}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#7A8C7A]">
                  Not specified
                </span>
              )}

            </div>

          </div>

          <div className="bg-[#F0F9F3] rounded-xl p-4 text-sm text-[#3D5A3D] mb-5">

            <p>
              <strong>Storage Provider:</strong>{' '}
              {selected.ownerName}
            </p>

            <p className="mt-1">
              <strong>Location:</strong>{' '}
              {selected.location}
            </p>

          </div>

          {selected.phone ? (
            <a
              href={`tel:${selected.phone}`}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-[#2D6A4F] text-white font-semibold hover:bg-[#24563F] transition"
            >
              📞 Contact Storage Owner
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
            >
              Contact Number Not Available
            </button>
          )}

        </Card>

      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      <PageTitle
        title="Cold Storage"
        subtitle="Find nearby storage facilities for your produce"
      />

      {!loading && !error && storages.length > 0 && (
        <div className="mb-6">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              placeholder="Search by storage name, location or crop..."
              className="w-full bg-white border border-[#D4E6C3] rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#D8F3DC]"
            />

          </div>

          <div className="flex justify-between items-center mt-3">

            <p className="text-sm text-[#7A8C7A]">
              Showing{' '}
              <span className="font-semibold text-[#1A2E1A]">
                {filteredStorages.length}
              </span>{' '}
              storage facilities
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-sm text-[#2D6A4F] font-semibold hover:underline"
              >
                Clear Search
              </button>
            )}

          </div>

        </div>
      )}

      {loading && (
        <Card className="p-10 text-center">

          <div className="text-4xl mb-3">
            ⏳
          </div>

          <p className="text-[#7A8C7A]">
            Loading storage facilities...
          </p>

        </Card>
      )}

      {!loading && error && (
        <Card className="p-8 text-center">

          <div className="text-4xl mb-3">
            ⚠️
          </div>

          <p className="text-red-600 font-semibold mb-4">
            {error}
          </p>

          <Btn
            onClick={loadStorages}
            variant="outline"
          >
            Try Again
          </Btn>

        </Card>
      )}

      {!loading &&
        !error &&
        storages.length === 0 && (
          <Card className="p-10 text-center">

            <div className="text-5xl mb-4">
              🏪
            </div>

            <h3 className="text-xl font-bold text-[#1A2E1A]">
              No Storage Facilities
            </h3>

            <p className="text-[#7A8C7A] mt-2">
              Storage facilities added by storage owners
              will appear here.
            </p>

          </Card>
        )}

      {!loading &&
        !error &&
        storages.length > 0 &&
        filteredStorages.length === 0 && (
          <Card className="p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h3 className="text-xl font-bold text-[#1A2E1A]">
              No Matching Storage
            </h3>

            <p className="text-[#7A8C7A] mt-2">
              Try searching for another storage name,
              location or crop.
            </p>

            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-4 text-[#2D6A4F] font-semibold hover:underline"
            >
              Clear Search
            </button>

          </Card>
        )}

      {!loading &&
        !error &&
        filteredStorages.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {filteredStorages.map(storage => {

              const supportedCrops =
                getCrops(storage.crops);

              const availability =
                getAvailabilityStatus(storage);

              const occupancy =
                getOccupancy(storage);

              return (
                <Card
                  key={storage.id}
                  className="p-5 hover:shadow-md transition-all"
                >

                  <div className="flex items-start gap-3 mb-4">

                    <div className="w-12 h-12 bg-[#EAF5E4] rounded-xl flex items-center justify-center text-2xl shrink-0">
                      🏪
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <h3 className="font-bold text-base text-[#1A2E1A]">
                          {storage.name}
                        </h3>

                        <span
                          className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-semibold ${availability.className}`}
                        >
                          {availability.text}
                        </span>

                      </div>

                      <p className="text-sm text-[#7A8C7A] mt-1">
                        📍 {storage.location}
                      </p>

                      <p className="text-xs text-[#7A8C7A] mt-1">
                        {storage.distance || 0} km away
                      </p>

                      <p className="text-xs text-[#7A8C7A] mt-1">
                        Managed by {storage.ownerName}
                      </p>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">

                    <div className="bg-[#F0F9F3] rounded-lg p-3">

                      <p className="text-xs text-[#7A8C7A]">
                        Capacity
                      </p>

                      <p className="font-semibold text-[#1A2E1A] mt-1">
                        {storage.capacity || 0} MT
                      </p>

                    </div>

                    <div className="bg-[#F0F9F3] rounded-lg p-3">

                      <p className="text-xs text-[#7A8C7A]">
                        Available
                      </p>

                      <p className="font-semibold text-[#2D6A4F] mt-1">
                        {storage.available || 0} MT
                      </p>

                    </div>

                  </div>

                  <div className="mb-4">

                    <div className="flex justify-between mb-1">

                      <span className="text-xs text-[#7A8C7A]">
                        Occupancy
                      </span>

                      <span className="text-xs font-semibold text-[#547054]">
                        {occupancy}%
                      </span>

                    </div>

                    <div className="h-2 bg-[#E7EEE2] rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#4F8A62] rounded-full"
                        style={{
                          width: `${occupancy}%`,
                        }}
                      />

                    </div>

                  </div>

                  <p className="text-sm text-[#3D5A3D] mb-3">

                    <span className="text-[#7A8C7A]">
                      Cost:
                    </span>{' '}

                    <strong>
                      {storage.cost ||
                        'Not specified'}
                    </strong>

                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">

                    {supportedCrops.length > 0 ? (
                      supportedCrops
                        .slice(0, 5)
                        .map(crop => (
                          <span
                            key={crop}
                            className="bg-[#D8F3DC] text-[#2D6A4F] text-xs font-semibold px-2 py-0.5 rounded-full"
                          >
                            {crop}
                          </span>
                        ))
                    ) : (
                      <span className="text-xs text-[#7A8C7A]">
                        Crops not specified
                      </span>
                    )}

                  </div>

                  <div className="flex gap-2">

                    <Btn
                      onClick={() =>
                        setSelected(storage)
                      }
                      variant="secondary"
                      className="flex-1 justify-center text-sm py-2"
                    >
                      View Details
                    </Btn>

                    {storage.phone ? (
                      <a
                        href={`tel:${storage.phone}`}
                        className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl border border-[#D4E6C3] text-[#2D6A4F] text-sm font-semibold hover:bg-[#F0F9F3] transition"
                      >
                        📞 Contact
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 px-3 py-2 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
                      >
                        No Contact
                      </button>
                    )}

                  </div>

                </Card>
              );
            })}

          </div>
        )}

    </main>
  );
}