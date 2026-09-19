import { useRef, useState } from 'react';
import { CROPS } from '../../data';
import { Btn, Card, PageTitle } from '../../components/shared';

interface CropHealthResult {
  crop: string;
  disease: string;
  confidence: number;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
}

interface Props {
  onMarket: () => void;
}

type GuidanceLanguage = 'English' | 'Telugu' | 'Hindi';

const guidanceCopy: Record<GuidanceLanguage, { symptoms: string; actions: string; prevention: string; viewTreatment: string; market: string }> = {
  English: { symptoms: 'Symptoms', actions: 'What you can do', prevention: 'Prevention', viewTreatment: '💊 View Treatment Guidance', market: '📊 Check Market Price' },
  Telugu: { symptoms: 'లక్షణాలు', actions: 'మీరు చేయగలిగేవి', prevention: 'నివారణ', viewTreatment: '💊 చికిత్స సూచనలు చూడండి', market: '📊 మార్కెట్ ధర చూడండి' },
  Hindi: { symptoms: 'लक्षण', actions: 'आप क्या कर सकते हैं', prevention: 'बचाव', viewTreatment: '💊 उपचार मार्गदर्शन देखें', market: '📊 बाजार मूल्य देखें' },
};

const treatmentTranslations: Record<string, Record<GuidanceLanguage, string>> = {
  'Remove and safely dispose of heavily infected leaves': { English: 'Remove and safely dispose of heavily infected leaves', Telugu: 'తీవ్రంగా సోకిన ఆకులను తొలగించి సురక్షితంగా పారవేయండి', Hindi: 'बहुत संक्रमित पत्तियों को हटाकर सुरक्षित रूप से नष्ट करें' },
  'Avoid overhead irrigation and prolonged leaf wetness': { English: 'Avoid overhead irrigation and prolonged leaf wetness', Telugu: 'పైనుంచి నీరు పోయడం మరియు ఆకులు ఎక్కువసేపు తడిగా ఉండడాన్ని నివారించండి', Hindi: 'ऊपर से सिंचाई और पत्तियों को लंबे समय तक गीला रखने से बचें' },
  'Improve air circulation between plants': { English: 'Improve air circulation between plants', Telugu: 'మొక్కల మధ్య గాలి ప్రసరణను మెరుగుపరచండి', Hindi: 'पौधों के बीच हवा का संचार बेहतर करें' },
  'Use locally approved disease-control products according to their labels': { English: 'Use locally approved disease-control products according to their labels', Telugu: 'స్థానికంగా ఆమోదించిన వ్యాధి నియంత్రణ ఉత్పత్తులను లేబుల్ సూచనల ప్రకారం వాడండి', Hindi: 'स्थानीय रूप से स्वीकृत रोग नियंत्रण उत्पादों का लेबल के अनुसार उपयोग करें' },
  'Remove severely affected leaves': { English: 'Remove severely affected leaves', Telugu: 'తీవ్రంగా ప్రభావితమైన ఆకులను తొలగించండి', Hindi: 'बहुत प्रभावित पत्तियों को हटा दें' },
  'Keep foliage dry and improve air circulation': { English: 'Keep foliage dry and improve air circulation', Telugu: 'ఆకులను పొడిగా ఉంచి గాలి ప్రసరణను మెరుగుపరచండి', Hindi: 'पत्तियों को सूखा रखें और हवा का संचार बेहतर करें' },
  'Remove infected plant debris': { English: 'Remove infected plant debris', Telugu: 'సోకిన మొక్కల అవశేషాలను తొలగించండి', Hindi: 'संक्रमित पौधों के अवशेष हटाएं' },
  'Practice crop rotation': { English: 'Practice crop rotation', Telugu: 'పంట మార్పిడి పద్ధతిని పాటించండి', Hindi: 'फसल चक्र अपनाएं' },
  'Maintain adequate spacing between plants': { English: 'Maintain adequate spacing between plants', Telugu: 'మొక్కల మధ్య తగినంత దూరం ఉంచండి', Hindi: 'पौधों के बीच पर्याप्त दूरी रखें' },
};

const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export default function CropHealth({ onMarket }: Props) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0] || 'Tomato');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<CropHealthResult | null>(null);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const [language, setLanguage] = useState<GuidanceLanguage>('English');
  const copy = guidanceCopy[language];
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      setImage(event.target?.result as string);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!image) return;

    setAnalyzing(true);
    setError('');
    try {
      const response = await fetch(`${ML_API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, crop: selectedCrop }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'The ML service could not analyze this image.');
      setResult(payload);
      setShowGuidance(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to connect to the ML service.');
    } finally {
      setAnalyzing(false);
    }
  }

  function clearImage() {
    setImage(null);
    setResult(null);
    setError('');
    setShowGuidance(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <PageTitle title="Crop Health AI" subtitle="Upload a crop photo for analysis and practical treatment guidance" />

      <div className="flex flex-col gap-5">
        <Card className="p-6">
          <p className="mb-3 text-xs font-700 uppercase tracking-wider text-[#A07048]">Step 1 - Select Crop</p>
          <label className="mb-2 block text-sm font-600 text-[#3D5A3D]" htmlFor="crop-select">Which crop do you want to diagnose?</label>
          <select id="crop-select" value={selectedCrop} onChange={event => { setSelectedCrop(event.target.value); setResult(null); setError(''); }} className="w-full rounded-xl border border-[#D4E6C3] bg-white px-4 py-3 text-base text-[#1A2E1A] focus:outline-none focus:ring-2 focus:ring-[#74C69D]">
            {CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
          </select>
        </Card>

        <Card className="p-6">
          <p className="mb-3 text-xs font-700 uppercase tracking-wider text-[#A07048]">Step 2 - Upload Image</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`flex min-h-52 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${image ? 'border-[#74C69D] bg-[#D8F3DC]/30' : 'border-[#D4E6C3] hover:border-[#74C69D] hover:bg-[#D8F3DC]/20'}`}
          >
            {image ? <img src={image} alt="Selected crop" className="max-h-72 rounded-lg object-contain" /> : <><span className="text-5xl">📸</span><span className="font-600 text-[#3D5A3D]">Choose a crop photo</span><span className="text-sm text-[#7A8C7A]">JPG or PNG image</span></>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {image && <div className="mt-4 flex gap-3"><Btn onClick={analyze} disabled={analyzing} className="flex-1 justify-center">{analyzing ? '⏳ Analyzing image...' : '🔬 Analyze Crop'}</Btn><Btn variant="outline" onClick={clearImage}>Clear</Btn></div>}
        </Card>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}<p className="mt-2 text-xs">Start the ML service from the repository root with: <code>python ml/api.py</code></p></div>}

        {result && <Card className="border-[#74C69D] p-6">
          {result.crop.toLowerCase() !== selectedCrop.toLowerCase() && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Selected crop does not match the crop detected by the AI. Detected crop: <strong>{result.crop}</strong>.</div>}
          <div className="mb-5 flex items-center justify-between"><p className="text-xs font-700 uppercase tracking-wider text-[#A07048]">Diagnosis Result</p><span className="rounded-lg bg-[#D8F3DC] px-2 py-1 text-xs text-[#2D6A4F]">AI Analysis</span></div>
          <div className="mb-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#F0F9F3] p-3"><p className="text-xs text-[#7A8C7A]">Crop</p><p className="font-700 text-[#1A2E1A]">{result.crop}</p></div><div className="rounded-xl bg-[#F0F9F3] p-3"><p className="text-xs text-[#7A8C7A]">Confidence</p><p className="font-700 text-[#1A2E1A]">{Math.round(result.confidence * 100)}%</p></div><div className="col-span-2 rounded-xl bg-amber-50 p-3"><p className="text-xs text-[#7A8C7A]">Detected Problem</p><p className="text-lg font-700 text-[#1A2E1A]">{result.disease}</p></div></div>
          <div className="mb-5"><p className="mb-2 text-xs text-[#7A8C7A]">Severity</p><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">Not available</span></div>
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">🤖 This diagnosis was generated by the KisanSetu AI crop disease detection model.</div>
          <div className="mb-5 border-t border-[#E7EFDF] pt-5"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-700 uppercase tracking-wider text-[#A07048]">Farmer Guidance</p><p className="mt-1 text-sm text-[#7A8C7A]">Explain this verified result in a simple regional language.</p></div><select value={language} onChange={event => setLanguage(event.target.value as GuidanceLanguage)} className="rounded-xl border border-[#D4E6C3] bg-white px-3 py-2 text-sm text-[#1A2E1A]"><option>English</option><option>Telugu</option><option>Hindi</option></select></div></div>
          {!showGuidance ? <Btn onClick={() => setShowGuidance(true)} className="w-full justify-center">{copy.viewTreatment}</Btn> : <><Guidance title={copy.symptoms} items={result.symptoms.map(item => translateTreatment(item, language))} /><Guidance title={copy.actions} items={result.treatments.map(item => translateTreatment(item, language))} numbered /><Guidance title={copy.prevention} items={result.prevention.map(item => translateTreatment(item, language))} /><Btn onClick={onMarket} className="w-full justify-center">{copy.market}</Btn></>}
        </Card>}
      </div>
    </main>
  );
}

function Guidance({ title, items, numbered = false }: { title: string; items: string[]; numbered?: boolean }) {
  return <section className="mb-5"><h2 className="mb-3 font-700 text-base text-[#1A2E1A]">{title}</h2><ul className="flex flex-col gap-2">{items.map((item, index) => <li key={item} className="flex items-start gap-3 text-sm text-[#3D5A3D]">{numbered ? <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-700 text-white">{index + 1}</span> : <span className="mt-0.5 text-[#2D6A4F]">•</span>}{item}</li>)}</ul></section>;
}

function translateTreatment(text: string, language: GuidanceLanguage) {
  return treatmentTranslations[text]?.[language] || text;
}