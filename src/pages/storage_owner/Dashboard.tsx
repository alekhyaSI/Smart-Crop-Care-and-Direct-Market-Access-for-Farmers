import { useEffect, useState } from 'react';
import { Btn, Card, Input, PageTitle } from '../../components/shared';

interface StorageFacility {
  id?: number;
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

interface Props {
  username: string;
}

const emptyFacility: StorageFacility = {
  name: '',
  ownerName: '',
  ownerUsername: '',
  location: '',
  distance: 0,
  capacity: 0,
  available: 0,
  cost: '',
  phone: '',
  crops: '',
};

export default function StorageOwnerDashboard({
  username,
}: Props) {
  const [facilities, setFacilities] = useState<
    StorageFacility[]
  >([]);

  const [requests, setRequests] = useState<
    StorageRequest[]
  >([]);

  const [facility, setFacility] =
    useState<StorageFacility>(emptyFacility);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadFacilities();
    loadRequests();
  }, [username]);

  async function loadFacilities() {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8080/storages/owner/${encodeURIComponent(
          username
        )}`
      );

      if (!response.ok) {
        throw new Error(
          'Unable to load storage facilities'
        );
      }

      const data = await response.json();

      setFacilities(
        Array.isArray(data) ? data : []
      );
    } catch {
      setError(
        'Unable to load your storage facilities.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadRequests() {
    try {
      setRequestsLoading(true);

      const response = await fetch(
        `http://localhost:8080/storage-requests/owner/${encodeURIComponent(
          username
        )}`
      );

      if (!response.ok) {
        throw new Error(
          'Unable to load storage requests'
        );
      }

      const data = await response.json();

      setRequests(
        Array.isArray(data) ? data : []
      );
    } catch {
      setError(
        'Unable to load farmer storage requests.'
      );
    } finally {
      setRequestsLoading(false);
    }
  }

  function openAddForm() {
    setEditingId(null);

    setFacility({
      ...emptyFacility,
      ownerUsername: username,
      ownerName: username,
    });

    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function openEditForm(
    item: StorageFacility
  ) {
    setEditingId(item.id ?? null);

    setFacility({
      ...item,
      ownerUsername: username,
    });

    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFacility(emptyFacility);
  }

  function updateField(
    field: keyof StorageFacility,
    value: string | number
  ) {
    setFacility(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  async function saveFacility(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!facility.name.trim()) {
      setError(
        'Storage facility name is required.'
      );
      return;
    }

    if (!facility.location.trim()) {
      setError('Location is required.');
      return;
    }

    if (facility.capacity <= 0) {
      setError(
        'Capacity must be greater than 0.'
      );
      return;
    }

    if (facility.available < 0) {
      setError(
        'Available capacity cannot be negative.'
      );
      return;
    }

    if (
      facility.available >
      facility.capacity
    ) {
      setError(
        'Available capacity cannot be greater than total capacity.'
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...facility,
        ownerUsername: username,
        ownerName:
          facility.ownerName.trim() ||
          username,
      };

      const url =
        editingId !== null
          ? `http://localhost:8080/storages/${editingId}`
          : 'http://localhost:8080/storages';

      const method =
        editingId !== null ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
            'Unable to save storage facility.'
        );
      }

      await loadFacilities();

      setShowForm(false);
      setEditingId(null);
      setFacility(emptyFacility);

      setSuccess(
        editingId !== null
          ? 'Storage facility updated successfully.'
          : 'Storage facility added successfully.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save storage facility.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteFacility(
    id?: number
  ) {
    if (!id) return;

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this storage facility?'
      );

    if (!confirmed) return;

    try {
      setError('');
      setSuccess('');

      const response = await fetch(
        `http://localhost:8080/storages/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Unable to delete storage facility'
        );
      }

      setFacilities(prev =>
        prev.filter(
          item => item.id !== id
        )
      );

      setSuccess(
        'Storage facility deleted successfully.'
      );
    } catch {
      setError(
        'Unable to delete the storage facility.'
      );
    }
  }

  async function updateRequestStatus(
    id: number,
    status: 'Accepted' | 'Rejected'
  ) {
    try {
      setError('');
      setSuccess('');

      const response = await fetch(
        `http://localhost:8080/storage-requests/${id}/status?status=${status}`,
        {
          method: 'PUT',
        }
      );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message ||
            'Unable to update request.'
        );
      }

      const updated =
        await response.json();

      setRequests(prev =>
        prev.map(request =>
          request.id === id
            ? updated
            : request
        )
      );

      setSuccess(
        `Storage request ${status.toLowerCase()} successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update storage request.'
      );
    }
  }

  const totalCapacity =
    facilities.reduce(
      (sum, item) =>
        sum +
        Number(item.capacity || 0),
      0
    );

  const totalAvailable =
    facilities.reduce(
      (sum, item) =>
        sum +
        Number(item.available || 0),
      0
    );

  const totalUsed =
    totalCapacity -
    totalAvailable;

  const occupancy =
    totalCapacity > 0
      ? Math.round(
          (totalUsed /
            totalCapacity) *
            100
        )
      : 0;

  const pendingRequests =
    requests.filter(
      request =>
        request.status ===
        'Pending'
    ).length;

  const acceptedRequests =
    requests.filter(
      request =>
        request.status ===
        'Accepted'
    ).length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <PageTitle
          title="Storage Owner Dashboard"
          subtitle="Manage your facilities and farmer storage requests"
        />

        <Btn
          onClick={openAddForm}
          className="self-start md:self-auto"
        >
          + Add Storage
        </Btn>

      </div>

      {success && (
        <div className="mb-5 rounded-xl border border-[#CDE5C2] bg-[#F1F9ED] px-4 py-3 text-sm text-[#2D6A4F]">
          {success}
        </div>
      )}

      {error && !showForm && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

        <Card className="p-5">
          <p className="text-sm text-[#7A8C7A]">
            Facilities
          </p>

          <p className="text-3xl font-bold text-[#1A2E1A] mt-1">
            {facilities.length}
          </p>

          <p className="text-2xl mt-2">
            🏢
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#7A8C7A]">
            Total Capacity
          </p>

          <p className="text-3xl font-bold text-[#1A2E1A] mt-1">
            {totalCapacity}
          </p>

          <p className="text-xs text-[#7A8C7A]">
            tonnes
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#7A8C7A]">
            Available
          </p>

          <p className="text-3xl font-bold text-[#2D6A4F] mt-1">
            {totalAvailable}
          </p>

          <p className="text-xs text-[#7A8C7A]">
            tonnes
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#7A8C7A]">
            Pending Requests
          </p>

          <p className="text-3xl font-bold text-[#C27A22] mt-1">
            {pendingRequests}
          </p>

          <p className="text-2xl mt-2">
            📩
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-[#7A8C7A]">
            Accepted
          </p>

          <p className="text-3xl font-bold text-[#2D6A4F] mt-1">
            {acceptedRequests}
          </p>

          <p className="text-2xl mt-2">
            ✅
          </p>
        </Card>

      </div>

      {showForm && (
        <Card className="p-6 mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-[#1A2E1A]">
                {editingId !== null
                  ? 'Edit Storage Facility'
                  : 'Add Storage Facility'}
              </h2>

              <p className="text-sm text-[#7A8C7A] mt-1">
                Enter your storage facility details
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="w-9 h-9 rounded-full bg-[#F3F5F0] text-[#547054] hover:bg-[#E7EEE2]"
            >
              ✕
            </button>

          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={saveFacility}
            className="space-y-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input
                label="Storage Facility Name"
                value={facility.name}
                onChange={value =>
                  updateField(
                    'name',
                    value
                  )
                }
                placeholder="e.g. Green Valley Cold Storage"
                required
              />

              <Input
                label="Owner Name"
                value={facility.ownerName}
                onChange={value =>
                  updateField(
                    'ownerName',
                    value
                  )
                }
                placeholder="Storage owner name"
                required
              />

              <Input
                label="Location"
                value={facility.location}
                onChange={value =>
                  updateField(
                    'location',
                    value
                  )
                }
                placeholder="e.g. Tenali, Andhra Pradesh"
                required
              />

              <Input
                label="Distance from Market (km)"
                value={String(
                  facility.distance
                )}
                onChange={value =>
                  updateField(
                    'distance',
                    Number(value) || 0
                  )
                }
                type="number"
                placeholder="e.g. 5"
              />

              <Input
                label="Total Capacity (tonnes)"
                value={String(
                  facility.capacity
                )}
                onChange={value =>
                  updateField(
                    'capacity',
                    Number(value) || 0
                  )
                }
                type="number"
                placeholder="e.g. 100"
                required
              />

              <Input
                label="Available Capacity (tonnes)"
                value={String(
                  facility.available
                )}
                onChange={value =>
                  updateField(
                    'available',
                    Number(value) || 0
                  )
                }
                type="number"
                placeholder="e.g. 60"
                required
              />

              <Input
                label="Storage Cost"
                value={facility.cost}
                onChange={value =>
                  updateField(
                    'cost',
                    value
                  )
                }
                placeholder="e.g. ₹50 / tonne / day"
              />

              <Input
                label="Contact Phone"
                value={facility.phone}
                onChange={value =>
                  updateField(
                    'phone',
                    value
                  )
                }
                type="tel"
                placeholder="e.g. 9876543210"
              />

            </div>

            <Input
              label="Supported Crops"
              value={facility.crops}
              onChange={value =>
                updateField(
                  'crops',
                  value
                )
              }
              placeholder="e.g. Rice, Tomato, Chilli, Maize"
            />

            <div className="flex flex-col sm:flex-row gap-3">

              <Btn
                type="submit"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId !== null
                  ? 'Update Facility'
                  : 'Add Facility'}
              </Btn>

              <button
                type="button"
                onClick={closeForm}
                className="px-5 py-2.5 rounded-xl border border-[#D5E2CE] text-[#547054] hover:bg-[#F5F8F2] font-medium"
              >
                Cancel
              </button>

            </div>

          </form>

        </Card>
      )}

      <section className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-bold text-[#1A2E1A]">
              My Storage Facilities
            </h2>

            <p className="text-sm text-[#7A8C7A] mt-1">
              Facilities registered under your account
            </p>
          </div>

        </div>

        {loading ? (
          <Card className="p-10 text-center">
            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-[#7A8C7A]">
              Loading facilities...
            </p>
          </Card>
        ) : facilities.length === 0 ? (
          <Card className="p-10 text-center">

            <div className="text-5xl mb-4">
              🏢
            </div>

            <h3 className="text-xl font-bold text-[#1A2E1A]">
              No Storage Facilities
            </h3>

            <p className="text-[#7A8C7A] text-sm max-w-md mx-auto mt-2 mb-6">
              Add your first storage facility so farmers can
              discover your available storage space.
            </p>

            <Btn onClick={openAddForm}>
              + Add Storage
            </Btn>

          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {facilities.map(item => {

              const capacity =
                Number(item.capacity || 0);

              const available =
                Number(item.available || 0);

              const used =
                Math.max(
                  0,
                  capacity - available
                );

              const percentage =
                capacity > 0
                  ? Math.round(
                      (used / capacity) *
                        100
                    )
                  : 0;

              return (
                <Card
                  key={item.id}
                  className="p-6"
                >

                  <div className="flex items-start justify-between gap-4 mb-5">

                    <div className="flex items-start gap-3">

                      <div className="w-12 h-12 rounded-xl bg-[#EAF5E4] flex items-center justify-center text-2xl">
                        🏢
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-[#1A2E1A]">
                          {item.name}
                        </h3>

                        <p className="text-sm text-[#7A8C7A]">
                          {item.location}
                        </p>
                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(item)
                        }
                        className="w-9 h-9 rounded-lg bg-[#F2F6EF] text-[#2D6A4F] hover:bg-[#E3EDDF]"
                      >
                        ✏️
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteFacility(
                            item.id
                          )
                        }
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">

                    <div className="rounded-xl bg-[#F7F9F5] p-3">
                      <p className="text-xs text-[#7A8C7A]">
                        Capacity
                      </p>

                      <p className="text-sm font-semibold text-[#1A2E1A] mt-1">
                        {capacity} tonnes
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F7F9F5] p-3">
                      <p className="text-xs text-[#7A8C7A]">
                        Available
                      </p>

                      <p className="text-sm font-semibold text-[#2D6A4F] mt-1">
                        {available} tonnes
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F7F9F5] p-3">
                      <p className="text-xs text-[#7A8C7A]">
                        Distance
                      </p>

                      <p className="text-sm font-semibold text-[#1A2E1A] mt-1">
                        {item.distance || 0} km
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#F7F9F5] p-3">
                      <p className="text-xs text-[#7A8C7A]">
                        Cost
                      </p>

                      <p className="text-sm font-semibold text-[#1A2E1A] mt-1">
                        {item.cost ||
                          'Not specified'}
                      </p>
                    </div>

                  </div>

                  <div className="mb-5">

                    <div className="flex justify-between mb-2">

                      <span className="text-xs text-[#7A8C7A]">
                        Occupancy
                      </span>

                      <span className="text-xs font-semibold text-[#547054]">
                        {percentage}%
                      </span>

                    </div>

                    <div className="h-2.5 bg-[#E7EEE2] rounded-full overflow-hidden">

                      <div
                        className="h-full bg-[#4F8A62] rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  {item.crops && (
                    <div className="border-t border-[#E6EDE1] pt-4">

                      <p className="text-xs text-[#7A8C7A] mb-1">
                        Supported Crops
                      </p>

                      <p className="text-sm font-medium text-[#1A2E1A]">
                        {item.crops}
                      </p>

                    </div>
                  )}

                </Card>
              );
            })}

          </div>
        )}

      </section>

      <section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

          <div>
            <h2 className="text-xl font-bold text-[#1A2E1A]">
              Farmer Storage Requests
            </h2>

            <p className="text-sm text-[#7A8C7A] mt-1">
              Review requests from farmers who want to use your storage
            </p>
          </div>

          <button
            type="button"
            onClick={loadRequests}
            className="text-sm text-[#2D6A4F] font-semibold hover:underline"
          >
            ↻ Refresh Requests
          </button>

        </div>

        {requestsLoading ? (
          <Card className="p-10 text-center">

            <div className="text-4xl mb-3">
              ⏳
            </div>

            <p className="text-[#7A8C7A]">
              Loading farmer requests...
            </p>

          </Card>
        ) : requests.length === 0 ? (
          <Card className="p-10 text-center">

            <div className="text-5xl mb-4">
              📩
            </div>

            <h3 className="text-xl font-bold text-[#1A2E1A]">
              No Storage Requests
            </h3>

            <p className="text-sm text-[#7A8C7A] mt-2">
              Farmer storage requests will appear here.
            </p>

          </Card>
        ) : (
          <div className="space-y-4">

            {requests.map(request => (

              <Card
                key={request.id}
                className="p-5"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2 mb-3">

                      <h3 className="text-lg font-bold text-[#1A2E1A]">
                        {request.farmerName ||
                          request.farmerUsername}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status ===
                          'Accepted'
                            ? 'bg-[#D8F3DC] text-[#2D6A4F]'
                            : request.status ===
                              'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {request.status}
                      </span>

                    </div>

                    <p className="text-sm text-[#7A8C7A] mb-4">
                      Storage: {request.storageName}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

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
                          {request.quantity} tonnes
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
                          {request.startDate ||
                            'Not specified'}
                        </p>

                      </div>

                    </div>

                    {request.message && (
                      <div className="mt-4 bg-[#F0F9F3] rounded-xl p-3">

                        <p className="text-xs text-[#7A8C7A] mb-1">
                          Farmer Message
                        </p>

                        <p className="text-sm text-[#3D5A3D]">
                          {request.message}
                        </p>

                      </div>
                    )}

                  </div>

                  {request.status ===
                    'Pending' && (
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">

                      <Btn
                        onClick={() =>
                          updateRequestStatus(
                            request.id,
                            'Accepted'
                          )
                        }
                        className="justify-center"
                      >
                        Accept
                      </Btn>

                      <button
                        type="button"
                        onClick={() =>
                          updateRequestStatus(
                            request.id,
                            'Rejected'
                          )
                        }
                        className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </div>

              </Card>

            ))}

          </div>
        )}

      </section>

    </main>
  );
}