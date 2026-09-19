import { useEffect, useState } from 'react';
import {
  Request,
} from '../../data';
import {
  StatusBadge,
  PageTitle,
  Card,
  EmptyState,
  Btn,
} from '../../components/shared';

interface StorageRequest {
  id: number;
  storageId: number;
  storageName: string;
  storageOwnerUsername: string;
  farmerUsername: string;
  farmerName: string;
  crop: string;
  quantity: number;
  durationDays: number;
  startDate: string;
  message: string;
  status: string;
}

interface BuyerRequirement {
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
  requests: Request[];
  username: string;
}

export default function RequestsPage({
  requests,
  username,
}: Props) {
  const [storageRequests, setStorageRequests] =
    useState<StorageRequest[]>([]);

  const [loadingStorageRequests, setLoadingStorageRequests] =
    useState(true);

  const [storageError, setStorageError] =
    useState('');

  const [buyerRequirements, setBuyerRequirements] =
    useState<BuyerRequirement[]>([]);

  const [loadingBuyerRequirements, setLoadingBuyerRequirements] =
    useState(true);

  const [buyerRequirementsError, setBuyerRequirementsError] =
    useState('');

  useEffect(() => {
    loadStorageRequests();
    loadBuyerRequirements();
  }, [username]);

  async function loadStorageRequests() {
    try {
      setLoadingStorageRequests(true);
      setStorageError('');

      const response = await fetch(
        `http://localhost:8080/storage-requests/farmer/${encodeURIComponent(
          username
        )}`
      );

      if (!response.ok) {
        throw new Error(
          'Unable to load storage requests'
        );
      }

      const data = await response.json();

      setStorageRequests(
        Array.isArray(data) ? data : []
      );
    } catch {
      setStorageError(
        'Unable to load your storage requests.'
      );
    } finally {
      setLoadingStorageRequests(false);
    }
  }

  async function loadBuyerRequirements() {
    try {
      setLoadingBuyerRequirements(true);
      setBuyerRequirementsError('');

      const response = await fetch('http://localhost:8080/requirements');

      if (!response.ok) {
        throw new Error('Unable to load buyer requirements');
      }

      const data = await response.json();
      setBuyerRequirements(Array.isArray(data) ? data : []);
    } catch {
      setBuyerRequirementsError('Unable to load buyer requirements.');
    } finally {
      setLoadingBuyerRequirements(false);
    }
  }

  const totalRequests =
    requests.length + storageRequests.length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      <PageTitle
        title="My Requests"
        subtitle="Track your selling and storage requests"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

        <Card className="p-4">
          <p className="text-sm text-[#7A8C7A]">
            Total Requests
          </p>

          <p className="text-2xl font-bold text-[#1A2E1A] mt-1">
            {totalRequests}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-[#7A8C7A]">
            Selling Requests
          </p>

          <p className="text-2xl font-bold text-[#2D6A4F] mt-1">
            {requests.length}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-[#7A8C7A]">
            Storage Requests
          </p>

          <p className="text-2xl font-bold text-[#2D6A4F] mt-1">
            {storageRequests.length}
          </p>
        </Card>

      </div>

      <section className="mb-10">

        <div className="flex items-center justify-between mb-4">

          <div>

          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1A2E1A]">
                  Buyer Requirements
                </h2>
                <p className="mt-1 text-sm text-[#7A8C7A]">
                  Produce requirements posted by buyers
                </p>
              </div>
              <button
                type="button"
                onClick={loadBuyerRequirements}
                className="text-sm font-semibold text-[#2D6A4F] hover:underline"
              >
                ↻ Refresh
              </button>
            </div>

            {loadingBuyerRequirements ? (
              <Card className="p-8 text-center">
                <p className="text-sm text-[#7A8C7A]">Loading buyer requirements...</p>
              </Card>
            ) : buyerRequirementsError ? (
              <Card className="p-8 text-center">
                <p className="mb-4 text-sm text-red-600">{buyerRequirementsError}</p>
                <Btn onClick={loadBuyerRequirements} variant="outline">Try Again</Btn>
              </Card>
            ) : buyerRequirements.length === 0 ? (
              <EmptyState icon="📋" message="No buyer requirements posted yet." />
            ) : (
              <div className="flex flex-col gap-4">
                {buyerRequirements.map(requirement => (
                  <Card key={requirement.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-[#1A2E1A]">
                          {requirement.crop}
                        </h3>
                        <p className="mt-1 text-sm text-[#7A8C7A]">
                          Buyer: {requirement.buyerName || requirement.buyerUsername}
                        </p>
                        {requirement.businessName && (
                          <p className="text-sm text-[#7A8C7A]">{requirement.businessName}</p>
                        )}
                      </div>
                      <span className="rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">
                        Buyer Requirement
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <RequirementValue label="Quantity" value={`${requirement.quantity} kg`} />
                      <RequirementValue label="Offered Price" value={`₹${requirement.price}`} />
                      <RequirementValue label="Location" value={requirement.location} />
                      <RequirementValue label="Contact" value={requirement.contact || 'Not provided'} />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
            <h2 className="text-xl font-bold text-[#1A2E1A]">
              Selling Requests
            </h2>

            <p className="text-sm text-[#7A8C7A] mt-1">
              Requests sent to buyers for selling your produce
            </p>
          </div>

        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon="📋"
            message="No selling requests yet. Find a buyer and send your first request."
          />
        ) : (
          <div className="flex flex-col gap-4">

            {requests.map(request => (
              <Card
                key={request.id}
                className="p-5"
              >

                <div className="flex items-start justify-between gap-3 mb-3">

                  <div>
                    <h3 className="font-bold text-base text-[#1A2E1A]">
                      {request.buyerName}
                    </h3>

                    <p className="text-sm text-[#7A8C7A]">
                      {request.date}
                    </p>
                  </div>

                  <StatusBadge
                    status={request.status}
                  />

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">

                  <div>
                    <p className="text-xs text-[#7A8C7A]">
                      Crop
                    </p>

                    <p className="font-semibold">
                      {request.crop}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7A8C7A]">
                      Quantity
                    </p>

                    <p className="font-semibold">
                      {request.quantity.toLocaleString()} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#7A8C7A]">
                      Price
                    </p>

                    <p className="font-semibold text-[#2D6A4F]">
                      ₹{request.price.toLocaleString()} / Qtl
                    </p>
                  </div>

                  <div className="col-span-2 sm:col-span-1">

                    <p className="text-xs text-[#7A8C7A]">
                      Location
                    </p>

                    <p className="font-semibold">
                      📍 {request.location}
                    </p>

                  </div>

                </div>

                {request.message && (
                  <div className="mt-3 bg-[#F0F9F3] rounded-lg p-3">

                    <p className="text-xs text-[#7A8C7A] mb-0.5">
                      Your message
                    </p>

                    <p className="text-sm text-[#3D5A3D] italic">
                      "{request.message}"
                    </p>

                  </div>
                )}

              </Card>
            ))}

          </div>
        )}

      </section>

      <section>

        <div className="flex items-center justify-between gap-3 mb-4">

          <div>
            <h2 className="text-xl font-bold text-[#1A2E1A]">
              Storage Requests
            </h2>

            <p className="text-sm text-[#7A8C7A] mt-1">
              Track requests sent to storage owners
            </p>
          </div>

          <button
            type="button"
            onClick={loadStorageRequests}
            className="text-sm text-[#2D6A4F] font-semibold hover:underline"
          >
            ↻ Refresh
          </button>

        </div>

        {loadingStorageRequests ? (
          <Card className="p-8 text-center">

            <div className="text-3xl mb-3">
              ⏳
            </div>

            <p className="text-sm text-[#7A8C7A]">
              Loading storage requests...
            </p>

          </Card>
        ) : storageError ? (
          <Card className="p-8 text-center">

            <div className="text-3xl mb-3">
              ⚠️
            </div>

            <p className="text-sm text-red-600 mb-4">
              {storageError}
            </p>

            <Btn
              onClick={loadStorageRequests}
              variant="outline"
            >
              Try Again
            </Btn>

          </Card>
        ) : storageRequests.length === 0 ? (
          <EmptyState
            icon="🏪"
            message="No storage requests yet. Find a storage facility and send a request."
          />
        ) : (
          <div className="flex flex-col gap-4">

            {storageRequests.map(request => (

              <Card
                key={request.id}
                className="p-5"
              >

                <div className="flex items-start justify-between gap-3 mb-4">

                  <div>

                    <h3 className="font-bold text-base text-[#1A2E1A]">
                      {request.storageName}
                    </h3>

                    <p className="text-sm text-[#7A8C7A] mt-1">
                      Storage request #{request.id}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'Accepted'
                        ? 'bg-[#D8F3DC] text-[#2D6A4F]'
                        : request.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {request.status}
                  </span>

                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                  <div className="bg-[#F7F9F5] rounded-xl p-3">

                    <p className="text-xs text-[#7A8C7A]">
                      Crop
                    </p>

                    <p className="font-semibold text-[#1A2E1A] mt-1">
                      {request.crop}
                    </p>

                  </div>

                  <div className="bg-[#F7F9F5] rounded-xl p-3">

                    <p className="text-xs text-[#7A8C7A]">
                      Quantity
                    </p>

                    <p className="font-semibold text-[#1A2E1A] mt-1">
                      {request.quantity} MT
                    </p>

                  </div>

                  <div className="bg-[#F7F9F5] rounded-xl p-3">

                    <p className="text-xs text-[#7A8C7A]">
                      Duration
                    </p>

                    <p className="font-semibold text-[#1A2E1A] mt-1">
                      {request.durationDays} days
                    </p>

                  </div>

                  <div className="bg-[#F7F9F5] rounded-xl p-3">

                    <p className="text-xs text-[#7A8C7A]">
                      Start Date
                    </p>

                    <p className="font-semibold text-[#1A2E1A] mt-1">
                      {request.startDate || 'Not specified'}
                    </p>

                  </div>

                </div>

                {request.message && (
                  <div className="mt-4 bg-[#F0F9F3] rounded-xl p-3">

                    <p className="text-xs text-[#7A8C7A] mb-1">
                      Your Message
                    </p>

                    <p className="text-sm text-[#3D5A3D]">
                      {request.message}
                    </p>

                  </div>
                )}

              </Card>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}

function RequirementValue({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#7A8C7A]">{label}</p>
      <p className="font-semibold text-[#1A2E1A]">{value}</p>
    </div>
  );
}