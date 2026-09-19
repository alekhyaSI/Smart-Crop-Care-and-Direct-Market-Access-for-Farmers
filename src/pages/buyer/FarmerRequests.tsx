import { useEffect, useState } from 'react';
import { Request, User } from '../../data';
import {
  StatusBadge,
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
  requests: Request[];
  onUpdateStatus: (
    id: number,
    status: 'Accepted' | 'Rejected'
  ) => void;
  user?: User;
}

export default function FarmerRequestsPage({
  requests,
  onUpdateStatus,
  user,
}: Props) {
  const { t } = useLanguage();

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequirements = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8080/requirements');

      if (!response.ok) {
        throw new Error('Failed to load requirements');
      }

      const data = await response.json();
      setRequirements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Unable to load buyer requirements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequirements();
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle
        title="Requests & Requirements"
        subtitle="Manage farmer requests and view buyer requirements"
      />

      <Card>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Buyer Requirements
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Requirements posted by buyers
            </p>
          </div>

          <Btn onClick={loadRequirements}>
            Refresh
          </Btn>
        </div>

        {loading && (
          <div className="py-10 text-center text-gray-500">
            Loading buyer requirements...
          </div>
        )}

        {!loading && error && (
          <div className="py-10 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Btn onClick={loadRequirements}>
              Try Again
            </Btn>
          </div>
        )}

        {!loading && !error && requirements.length === 0 && (
          <EmptyState
            icon="📋"
            message="No buyer requirements. There are currently no requirements posted by buyers."
          />
        )}

        {!loading && !error && requirements.length > 0 && (
          <div className="grid gap-4">
            {requirements.map((requirement) => (
              <div
                key={requirement.id}
                className="border border-gray-200 rounded-2xl p-5 bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {requirement.crop}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Buyer: {requirement.buyerName || requirement.buyerUsername}
                    </p>

                    {requirement.businessName && (
                      <p className="text-sm text-gray-500">
                        Business: {requirement.businessName}
                      </p>
                    )}
                  </div>

                  <div className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                    Buyer Requirement
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-semibold text-gray-900">
                      {requirement.quantity} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Offered Price</p>
                    <p className="font-semibold text-gray-900">
                      ₹{requirement.price}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">
                      {requirement.location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-900">
                      {requirement.contact || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">
            Farmer Selling Requests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Requests received from farmers
          </p>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon="📋"
            message="No selling requests. There are no farmer selling requests at the moment."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {request.crop}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Quantity: {request.quantity} kg
                    </p>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                {request.status === 'Pending' && (
                  <div className="flex gap-3 mt-5">
                    <Btn
                      onClick={() =>
                        onUpdateStatus(request.id, 'Accepted')
                      }
                    >
                      Accept
                    </Btn>

                    <Btn
                      variant="danger"
                      onClick={() =>
                        onUpdateStatus(request.id, 'Rejected')
                      }
                    >
                      Reject
                    </Btn>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}