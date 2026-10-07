import React, { useState } from 'react';
import { FullStyleDNA, ColorCheckResponse } from '../../types/index.ts';
import { requestColorCheck } from '../../lib/api.ts';
import {
  Palette,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Ban
} from 'lucide-react';

interface ColorCheckViewProps {
  styleDNA: FullStyleDNA;
  onOpenUpsell?: (triggerKey: string) => void;
}

const PALETTE_SAMPLES = [
  { name: 'Verde Oliva Dorado', hex: '#6B7A58', cat: 'Tierra' },
  { name: 'Terracota Especiado', hex: '#C86D51', cat: 'Cálido' },
  { name: 'Camel Miel Tostado', hex: '#C19A6B', cat: 'Neutro' },
  { name: 'Mostaza Cálido', hex: '#D4A346', cat: 'Acento' },
  { name: 'Fucsia Neón Frío', hex: '#E0115F', cat: 'Frío / Contraste' },
  { name: 'Azul Petróleo Suave', hex: '#2A4D69', cat: 'Profundo' },
  { name: 'Blanco Nuclear Óptico', hex: '#FFFFFF', cat: 'Frío puro' },
  { name: 'Negro Azabache Intenso', hex: '#111111', cat: 'Intenso' }
];

export const ColorCheckView: React.FC<ColorCheckViewProps> = ({ styleDNA, onOpenUpsell }) => {
  const [selectedHex, setSelectedHex] = useState<string>(PALETTE_SAMPLES[0].hex);
  const [colorName, setColorName] = useState<string>(PALETTE_SAMPLES[0].name);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ColorCheckResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setImageBase64(base64);
      setColorName('Prenda subida');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof PALETTE_SAMPLES[0]) => {
    setSelectedHex(sample.hex);
    setColorName(sample.name);
    setImageBase64('');
    setPreviewImage('');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await requestColorCheck(
        styleDNA.color,
        imageBase64 || undefined,
        selectedHex,
        colorName
      );
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al analizar el color');
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
            Colorimetría Personal
          </span>
          <span className="text-xs text-[#8C8275]">·</span>
          <span className="text-xs text-[#2E5E4E] font-medium">{styleDNA.color.subestacion}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
          ¿Este color es para mí?
        </h1>
        <p className="text-sm text-[#665D50] mt-1 max-w-2xl">
          El color equivocado cerca de la cara acentúa ojeras y apaga la mirada. El color idóneo rejuvenece y aporta luminosidad instantánea. Comprueba aquí cualquier tono antes de elegir.
        </p>

        {/* Color DNA Origin Banner (Cascada: IA / Híbrida / Wilma Manual) */}
        <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#E2DBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8A5B38]" />
            <span className="text-[#5E5549]">
              Base actual: <strong>{styleDNA.color.subestacion}</strong> (Origen: <span className="font-mono text-[#1A1816]">{styleDNA.color.origen || 'cuestionario_hibrido'}</span> · Confianza: <strong>{styleDNA.color.confianza || 75}%</strong>)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {styleDNA.color.validado_por_wilma ? (
              <span className="text-[#2E5E4E] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validado por Wilma</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onOpenUpsell && onOpenUpsell('when_color_uncertain')}
                className="px-3 py-1 rounded-full bg-[#FAF0E6] text-[#8A5B38] font-semibold border border-[#EADBCE] hover:bg-[#EADBCE] transition-colors cursor-pointer"
              >
                Validar con Wilma personalmente
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selector Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Interactive Palette & Image Upload */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-3">
              Selecciona un tono o sube una foto de la prenda
            </span>

            {/* Quick Palettes */}
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {PALETTE_SAMPLES.map((sample) => {
                const isSelected = selectedHex === sample.hex && !previewImage;
                return (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#1A1816] shadow-sm bg-[#FAF8F5]'
                        : 'border-[#E2DBD0] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-1.5 shadow-inner border border-black/10"
                      style={{ backgroundColor: sample.hex }}
                    />
                    <span className="text-[10px] font-medium text-[#1A1816] line-clamp-1 block">
                      {sample.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom HEX or Color input */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedHex}
                onChange={(e) => {
                  setSelectedHex(e.target.value);
                  setColorName(`Color personalizado (${e.target.value})`);
                  setPreviewImage('');
                }}
                className="w-11 h-11 rounded-xl cursor-pointer border border-[#D9D1C5] bg-white p-1"
              />
              <input
                type="text"
                value={selectedHex}
                onChange={(e) => {
                  setSelectedHex(e.target.value);
                  setPreviewImage('');
                }}
                placeholder="#6B7A58"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-xs font-mono text-[#1A1816]"
              />
            </div>
          </div>

          {/* Or upload image */}
          <div className="pt-4 border-t border-[#EFE9DF]">
            <label className="w-full py-2.5 px-4 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] hover:bg-[#F2ECE3] text-xs font-semibold text-[#1A1816] text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>O subir foto de tela / prenda</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {previewImage && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-[#F3EFEA] rounded-xl border border-[#E0D8CB]">
                <img
                  src={previewImage}
                  alt="Tela a analizar"
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <span className="text-xs text-[#5E5549]">
                  Foto cargada para análisis cromático por visión IA
                </span>
              </div>
            )}
          </div>
        </div>

        {/* User Color DNA Reference & Trigger */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block">
              Tu Estación: {styleDNA.color.subestacion}
            </span>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] space-y-2 text-xs text-[#5E5549]">
              <p>
                <strong>Temperatura:</strong> {styleDNA.color.temperatura} (tu base pigmentaria requiere calidez y armonía dorada).
              </p>
              <p>
                <strong>Profundidad:</strong> {styleDNA.color.profundidad} (tonos intermedios sin extremos cegadores).
              </p>
              <p>
                <strong>Intensidad:</strong> {styleDNA.color.intensidad} (pigmentos suaves, no saturados fluorescentes).
              </p>
              <p>
                <strong>Metales favorecedores:</strong> {styleDNA.color.metales === 'oro' ? 'Oro amarillo o satinado' : 'Plata / Mixto'}.
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
              <div
                className="w-12 h-12 rounded-xl shadow-inner border border-black/10 shrink-0"
                style={{ backgroundColor: selectedHex }}
              />
              <div>
                <span className="text-xs font-bold text-[#1A1816] block">{colorName}</span>
                <span className="text-[11px] text-[#7A7062] font-mono">{selectedHex}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EFE9DF]">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-sm font-semibold hover:bg-[#332E2A] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Calculando impacto cromático en tu piel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6AF2E]" />
                  <span>Evaluar Compatibilidad Cromática</span>
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5DFD5]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {result.compatible ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E5E4E] text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Totalmente Favorecedor</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#964B44] text-white flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Poco Favorecedor Cerca del Rostro</span>
                  </span>
                )}
                <span className="text-xs text-[#7A7062] font-medium">
                  {result.subestacionMatch}
                </span>
              </div>

              <h2 className="font-editorial text-3xl font-bold text-[#1A1816]">
                {result.colorAnalizado}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E0D8CB]">
              <div
                className="w-8 h-8 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: selectedHex }}
              />
              <div className="text-left text-[11px] text-[#5E5549]">
                <span>Temp: <strong>{result.temperatura}</strong></span>
                <span className="mx-1">·</span>
                <span>Intensidad: <strong>{result.intensidad}</strong></span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5DFD5] space-y-3">
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Efecto óptico sobre tu rostro y expresión
            </h3>
            <p className="text-sm text-[#5E5549] leading-relaxed">
              {result.comment}
            </p>
          </div>

          {/* How to wear it */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5DFD5] space-y-4">
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8A5B38]" />
              <span>Cómo llevarlo de forma estratégica</span>
            </h3>

            <div className="space-y-2.5">
              {result.comoUsarlo.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                  <span className="text-[#8A5B38] font-bold text-sm">✓</span>
                  <span className="text-xs sm:text-sm text-[#4A4337]">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complementary & Avoid With */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E5E4E] block mb-2">
                Combina magníficamente con:
              </span>
              <ul className="space-y-1.5 text-xs text-[#5E5549]">
                {result.coloresComplementarios.map((col, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2E5E4E]" />
                    <span>{col}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E5DFD5]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#964B44] block mb-2 flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-[#964B44]" />
                <span>Evita combinarlo cerca del rostro con:</span>
              </span>
              <ul className="space-y-1.5 text-xs text-[#5E5549]">
                {result.evitarCon.map((col, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#964B44]" />
                    <span>{col}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
