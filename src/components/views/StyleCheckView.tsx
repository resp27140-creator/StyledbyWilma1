import React, { useState } from 'react';
import { FullStyleDNA, StyleCheckResponse } from '../../types/index.ts';
import { requestStyleCheck } from '../../lib/api.ts';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sliders,
  Check
} from 'lucide-react';

interface StyleCheckViewProps {
  styleDNA: FullStyleDNA;
}

const SAMPLE_LOOKS = [
  {
    title: 'Look Oficina Camel & Marfil',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    occasion: 'Comité de dirección'
  },
  {
    title: 'Look Casual Lino Arena',
    url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80',
    occasion: 'Brunch con amigas'
  },
  {
    title: 'Look Trench & Denim',
    url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    occasion: 'Viernes en la oficina y cena'
  }
];

export const StyleCheckView: React.FC<StyleCheckViewProps> = ({ styleDNA }) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_LOOKS[0].url);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [occasion, setOccasion] = useState(SAMPLE_LOOKS[0].occasion);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StyleCheckResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Convert url or file to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_LOOKS[0]) => {
    setSelectedImage(sample.url);
    setImageBase64('');
    setOccasion(sample.occasion);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let payloadBase64 = imageBase64;
      if (!payloadBase64 && selectedImage) {
        // Fetch and convert image if from sample URL
        const res = await fetch(selectedImage);
        const blob = await res.blob();
        payloadBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const data = await requestStyleCheck(payloadBase64, styleDNA, occasion);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al analizar el look');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
            Visión IA de Imagen
          </span>
          <span className="text-xs text-[#8C8275]">·</span>
          <span className="text-xs text-[#2E5E4E] font-medium">Feedback Imparcial y Constructivo</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
          Analiza mi look
        </h1>
        <p className="text-sm text-[#665D50] mt-1 max-w-2xl">
          Toma una foto de lo que llevas puesto frente al espejo o sube una imagen. Wilma examinará la armonía de color con tu rostro, la proporción de líneas y la coherencia de estilo.
        </p>
      </div>

      {/* Main Upload & Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Image Preview & Upload Box */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-3">
              Foto del outfit
            </span>

            <div className="relative aspect-[3/4] max-h-96 w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#DDD5C9] mb-4 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Look a analizar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-[#8C8275]">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="text-xs">Sube tu foto para comenzar</span>
                </div>
              )}
            </div>

            {/* Custom file button */}
            <div className="flex items-center gap-3">
              <label className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] hover:bg-[#F2ECE3] text-xs font-semibold text-[#1A1816] text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                <Upload className="w-3.5 h-3.5" />
                <span>Subir mi foto (Espejo / Look)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets */}
            <div className="mt-4 pt-3 border-t border-[#EFE9DF]">
              <span className="text-[11px] text-[#7A7062] block mb-2">
                O prueba con uno de estos looks de muestra:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_LOOKS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-1.5 rounded-xl border text-center transition-all ${
                      selectedImage === sample.url
                        ? 'border-[#1A1816] bg-[#FAF8F5]'
                        : 'border-[#E0D8CB] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-12 object-cover rounded-lg mb-1"
                    />
                    <span className="text-[10px] font-medium text-[#1A1816] line-clamp-1 block">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
                ¿A dónde vas con este look? (Ocasión)
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="ej. Reunión con clientes, Cena casual, Presentación..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
              />
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5DFD5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5B38] block mb-1">
                Contexto activo de tu Style DNA
              </span>
              <ul className="text-xs text-[#5E5549] space-y-1">
                <li>· Estación: <strong className="text-[#1A1816]">{styleDNA.color.subestacion}</strong></li>
                <li>· Perfil: <strong className="text-[#1A1816]">{styleDNA.style.clasicoPct}% Clásico · {styleDNA.style.naturalPct}% Natural</strong></li>
                <li>· Enfoque: <strong className="text-[#1A1816]">{styleDNA.body.proporcionHombroCintura}</strong></li>
                <li>· Regla de oro: No asumimos que quieres parecer más delgada, sino potenciar tu armonía única.</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EFE9DF]">
            <button
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              className="w-full py-3.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-sm font-semibold hover:bg-[#332E2A] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando proporciones y colorimetría...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6AF2E]" />
                  <span>Analizar este Look con Wilma</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMsg}
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#DCD5C9] shadow-sm space-y-8 animate-fadeIn">
          {/* Header Score & Veredicto */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5DFD5]">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A5B38] block mb-1">
                Diagnóstico de Estilismo
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1816]">
                {result.veredicto}
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-[#E0D8CB] shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#7A7062] block">
                  Puntuación Global
                </span>
                <span className="text-xs text-[#2E5E4E] font-medium">Excelente armonía</span>
              </div>
              <div className="font-editorial text-4xl font-bold text-[#1A1816]">
                {result.overallScore}<span className="text-base text-[#8C8275] font-normal">/100</span>
              </div>
            </div>
          </div>

          {/* Radar / 5-Pillar Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-bold uppercase text-[#7A7062]">Colorimetría</span>
                <span className="text-xs font-bold text-[#1A1816]">{result.analysis.color.score}%</span>
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {result.analysis.color.comment}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-bold uppercase text-[#7A7062]">Proporciones</span>
                <span className="text-xs font-bold text-[#1A1816]">{result.analysis.proportions.score}%</span>
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {result.analysis.proportions.comment}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-bold uppercase text-[#7A7062]">Coherencia</span>
                <span className="text-xs font-bold text-[#1A1816]">{result.analysis.styleCoherence.score}%</span>
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {result.analysis.styleCoherence.comment}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-bold uppercase text-[#7A7062]">Ocasión</span>
                <span className="text-xs font-bold text-[#1A1816]">{result.analysis.occasionFit.score}%</span>
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {result.analysis.occasionFit.comment}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-[11px] font-bold uppercase text-[#7A7062]">Accesorios</span>
                <span className="text-xs font-bold text-[#1A1816]">{result.analysis.accessories.score}%</span>
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {result.analysis.accessories.comment}
              </p>
            </div>
          </div>

          {/* Actionable Adjustments */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5DFD5] space-y-4">
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#8A5B38]" />
              <span>Ajustes inmediatos recomendados por Wilma</span>
            </h3>

            <div className="space-y-2.5">
              {result.suggestions.map((sug, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                  <Check className="w-4 h-4 text-[#2E5E4E] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#4A4337]">{sug}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Styling */}
          {result.alternativeStyling && result.alternativeStyling.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E0D8CB]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-2">
                Cómo transformar o elevar este mismo conjunto
              </span>
              <ul className="space-y-1.5 text-xs text-[#5E5549]">
                {result.alternativeStyling.map((alt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8A5B38] font-bold">·</span>
                    <span>{alt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
