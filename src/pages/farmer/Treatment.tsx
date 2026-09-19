import { CropDiagnosis } from '../../data';
import { Btn, PageTitle, Card } from '../../components/shared';

interface Props {
  diagnosis: CropDiagnosis | null;
  onMarket: () => void;
  onDiagnosis: () => void;
}

const fallback: CropDiagnosis = {
  crop: 'Tomato', problem: 'Early Blight', confidence: 92, severity: 'Moderate',
  symptoms: ['Brown spots on leaves', 'Yellowing leaves', 'Leaf damage'],
  treatments: ['Remove badly affected leaves.', 'Keep the field clean.', 'Avoid excessive moisture.', 'Monitor nearby plants.'],
  prevention: ['Maintain field cleanliness.', 'Inspect crops regularly.', 'Avoid unnecessary leaf wetness.'],
};

export default function TreatmentPage({ diagnosis, onMarket, onDiagnosis }: Props) {
  const d = diagnosis ?? fallback;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PageTitle title="Treatment Guidance" subtitle={`For ${d.crop} – ${d.problem}`} />

      <div className="flex flex-col gap-5">
        {/* Problem summary */}
        <Card className="p-5 bg-amber-50 border-amber-200">
          <p className="text-xs font-700 text-amber-700 uppercase tracking-wider mb-2">Possible Problem</p>
          <p className="font-display text-2xl text-[#1A2E1A]">{d.problem}</p>
          <p className="text-sm text-[#7A8C7A] mt-1">{d.crop} • Confidence: {d.confidence}%</p>
        </Card>

        {/* Symptoms */}
        <Card className="p-5">
          <h2 className="font-700 text-base text-[#1A2E1A] mb-3">🔍 Symptoms</h2>
          <ul className="flex flex-col gap-2">
            {d.symptoms.map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-[#3D5A3D]">
                <span className="text-[#2D6A4F] mt-0.5">•</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* What to do */}
        <Card className="p-5">
          <h2 className="font-700 text-base text-[#1A2E1A] mb-3">✅ What You Can Do</h2>
          <ol className="flex flex-col gap-3">
            {d.treatments.map((t, i) => (
              <li key={t} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#2D6A4F] text-white text-xs font-700 flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-[#3D5A3D]">{t}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Prevention */}
        <Card className="p-5">
          <h2 className="font-700 text-base text-[#1A2E1A] mb-3">🛡️ Prevention</h2>
          <ul className="flex flex-col gap-2">
            {d.prevention.map(p => (
              <li key={p} className="flex items-start gap-2 text-sm text-[#3D5A3D]">
                <span className="text-[#2D6A4F] mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </Card>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          ⚠️ <strong>Important:</strong> For severe crop damage, consult a qualified agricultural expert.
        </div>

        <div className="flex gap-3">
          <Btn onClick={onDiagnosis} variant="outline">← Back to Diagnosis</Btn>
          <Btn onClick={onMarket} className="flex-1 justify-center">📊 Check Market Price</Btn>
        </div>
      </div>
    </main>
  );
}
