import { Request } from '../../data';
import { StatusBadge, PageTitle, Card, EmptyState } from '../../components/shared';

interface Props {
  requests: Request[];
}

export default function RequestsPage({ requests }: Props) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PageTitle title="My Requests" subtitle="Track all your selling requests" />

      {requests.length === 0 ? (
        <EmptyState icon="📋" message="No requests yet. Find a buyer and send your first selling request." />
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(r => (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-700 text-base text-[#1A2E1A]">{r.buyerName}</h3>
                  <p className="text-sm text-[#7A8C7A]">{r.date}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#7A8C7A]">Crop</p>
                  <p className="font-600">{r.crop}</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Quantity</p>
                  <p className="font-600">{r.quantity.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-xs text-[#7A8C7A]">Price</p>
                  <p className="font-600 text-[#2D6A4F]">₹{r.price.toLocaleString()} / Qtl</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-[#7A8C7A]">Location</p>
                  <p className="font-600">📍 {r.location}</p>
                </div>
              </div>

              {r.message && (
                <div className="mt-3 bg-[#F0F9F3] rounded-lg p-3">
                  <p className="text-xs text-[#7A8C7A] mb-0.5">Your message</p>
                  <p className="text-sm text-[#3D5A3D] italic">"{r.message}"</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
