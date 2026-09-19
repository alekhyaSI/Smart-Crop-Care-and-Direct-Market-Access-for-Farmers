import { useState, useRef } from 'react';
import { CROPS, CROP_DIAGNOSES, CropDiagnosis } from '../../data';
import { Select, Btn, PageTitle, Card } from '../../components/shared';

interface Props {
  onTreatment: (d: CropDiagnosis) => void;
}

export default function CropDiagnosisPage({ onTreatment }: Props) {
  const [crop, setCrop] = useState('Tomato');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CropDiagnosis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  }

  function analyze() {
    if (!image) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(CROP_DIAGNOSES[crop]);
    }, 2200);
  }

  const severityColor: Record<string, string> = {
    Mild: 'bg-green-100 text-green-800',
    Moderate: 'bg-amber-100 text-amber-800',
    Severe: 'bg-red-100 text-red-800',
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <PageTitle title="Crop Diagnosis" subtitle="Upload a crop photo to check for possible problems" />

      <div className="flex flex-col gap-6">
        {/* Step 1 */}
        <Card className="p-6">
          <p className="text-xs font-700 text-[#A07048] uppercase tracking-wider mb-3">Step 1 – Select Crop</p>
          <Select label="Which crop do you want to diagnose?" value={crop} onChange={v => { setCrop(v); setResult(null); setImage(null); }} options={CROPS} />
        </Card>

        {/* Step 2 */}
        <Card className="p-6">
          <p className="text-xs font-700 text-[#A07048] uppercase tracking-wider mb-3">Step 2 – Upload Image</p>
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              image ? 'border-[#74C69D] bg-[#D8F3DC]/30' : 'border-[#D4E6C3] hover:border-[#74C69D] hover:bg-[#D8F3DC]/20'
            } flex flex-col items-center justify-center gap-3 min-h-48 overflow-hidden`}
          >
            {image ? (
              <img src={image} alt="Uploaded crop" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <>
                <span className="text-5xl">📸</span>
                <p className="font-600 text-[#3D5A3D]">Upload Crop Image</p>
                <p className="text-sm text-[#7A8C7A]">Click to choose a photo from your device</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {image && (
            <div className="mt-4 flex gap-3">
              <Btn onClick={analyze} disabled={analyzing} className="flex-1 justify-center">
                {analyzing ? '⏳ Analyzing crop image...' : '🔬 Analyze Crop'}
              </Btn>
              <Btn variant="outline" onClick={() => { setImage(null); setResult(null); if (fileRef.current) fileRef.current.value = ''; }}>
                Clear
              </Btn>
            </div>
          )}
        </Card>

        {/* Result */}
        {analyzing && (
          <Card className="p-6">
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-12 h-12 border-4 border-[#2D6A4F] border-t-transparent rounded-full animate-spin" />
              <p className="font-600 text-[#3D5A3D]">Analyzing crop image...</p>
              <p className="text-sm text-[#7A8C7A]">This may take a moment</p>
            </div>
          </Card>
        )}

        {result && (
          <Card className="p-6 border-[#74C69D]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-700 text-[#A07048] uppercase tracking-wider">Diagnosis Result</p>
              <span className="text-xs text-[#7A8C7A] bg-[#F0E6D3] px-2 py-1 rounded-lg">Demo Data</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#F0F9F3] rounded-xl p-3">
                <p className="text-xs text-[#7A8C7A] mb-0.5">Crop</p>
                <p className="font-700 text-[#1A2E1A]">{result.crop}</p>
              </div>
              <div className="bg-[#F0F9F3] rounded-xl p-3">
                <p className="text-xs text-[#7A8C7A] mb-0.5">Confidence</p>
                <p className="font-700 text-[#1A2E1A]">{result.confidence}%</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 col-span-2">
                <p className="text-xs text-[#7A8C7A] mb-0.5">Possible Problem</p>
                <p className="font-700 text-lg text-[#1A2E1A]">{result.problem}</p>
              </div>
              <div className="rounded-xl p-3">
                <p className="text-xs text-[#7A8C7A] mb-1">Severity</p>
                <span className={`px-3 py-1 rounded-full text-sm font-600 ${severityColor[result.severity]}`}>{result.severity}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
              ⚠️ This is a simulated result for demonstration purposes only.
            </div>

            <Btn onClick={() => onTreatment(result)} className="w-full justify-center">
              💊 View Treatment Guidance
            </Btn>
          </Card>
        )}
      </div>
    </main>
  );
}
