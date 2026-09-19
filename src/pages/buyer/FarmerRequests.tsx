import { Request } from '../../data';
import { StatusBadge, Btn, PageTitle, Card, EmptyState } from '../../components/shared';

interface Props {
  requests: Request[];
  onUpdateStatus: (id: number, status: 'Accepted' | 'Rejected') => void;
}

export default function FarmerRequestsPage({ requests, onUpdateStatus }: Props) {
  const allRequests = requests;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PageTitle title="Farmer Requests" subtitle="Review selling requests from farmers" />

      {allRequests.length === 0 ? (
        <EmptyState icon="📨" message="No farmer requests yet." />
      ) : (
        <div className="flex flex-col gap-4">
          {allRequests.map(r => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-700 text-base text-[#1A2E1A]">Farmer Selling Request</h3>
                  <p className="text-sm text-[#7A8C7A]">{r.date}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-[#7A8C7A]">Crop</p>
                  <p className="font-600">{r.crop}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Quantity</p>
                  <p className="font-600">{r.quantity.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Location</p>
                  <p className="font-600">📍 {r.location}</p>
                </div>
              </div>

              {r.message && (
                <div className="bg-[#F0F9F3] rounded-lg p-3 mb-3">
                  <p className="text-xs text-[#7A8C7A] mb-0.5">Farmer's message</p>
                  <p className="text-sm text-[#3D5A3D] italic">"{r.message}"</p>
                </div>
              )}

              {r.status === 'Pending' && (
                <div className="flex gap-3 mt-2">
                  <Btn
                    onClick={() => onUpdateStatus(r.id, 'Accepted')}
                    className="flex-1 justify-center bg-[#2D6A4F]"
                  >
                    ✅ Accept
                  </Btn>
                  <Btn
                    onClick={() => onUpdateStatus(r.id, 'Rejected')}
                    variant="danger"
                    className="flex-1 justify-center"
                  >
                    ❌ Reject
                  </Btn>
                </div>
              )}

              {r.status === 'Accepted' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  ✅ You accepted this request. The farmer has been notified.
                </div>
              )}
              {r.status === 'Rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  ❌ You rejected this request.
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
