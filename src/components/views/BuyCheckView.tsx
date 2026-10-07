import React, { useState } from 'react';
import { FullStyleDNA, WardrobeItem, BuyCheckResponse } from '../../types/index.ts';
import { requestBuyCheck } from '../../lib/api.ts';
import {
  ShoppingBag,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BuyCheckViewProps {
  styleDNA: FullStyleDNA;
  wardrobe: WardrobeItem[];
}

const SAMPLE_BUY_ITEMS = [
  {
    title: 'Blazer Lana Fría Espiga Camel',
    store: 'Massimo Dutti',
    price: 169,
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Vestido Neón Fucsia Muy Ajustado',
    store: 'Zara',
    price: 59,
    url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Pantalón Sastre Pinzas Oliva Oscuro',
    store: 'COS',
    price: 115,
    url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80'
  }
];

export const BuyCheckView: React.FC<BuyCheckViewProps> = ({ styleDNA, wardrobe }) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_BUY_ITEMS[0].url);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [price, setPrice] = useState<number>(SAMPLE_BUY_ITEMS[0].price);
  const [store, setStore] = useState<string>(SAMPLE_BUY_ITEMS[0].store);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuyCheckResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleSelectSample = (sample: typeof SAMPLE_BUY_ITEMS[0]) => {
    setSelectedImage(sample.url);
    setImageBase64('');
    setPrice(sample.price);
    setStore(sample.store);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let payloadBase64 = imageBase64;
      if (!payloadBase64 && selectedImage) {
        const res = await fetch(selectedImage);
        const blob = await res.blob();
        payloadBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const data = await requestBuyCheck(
        payloadBase64,
        styleDNA,
        wardrobe,
        price,
        store
      );
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al evaluar la compra');
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
            Compras Inteligentes
          </span>
          <span className="text-xs text-[#8C8275]">·</span>
          <span className="text-xs text-[#2E5E4E] font-medium">Anti-Impulsos & Multiplicador de Armario</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
          ¿Me lo compro?
        </h1>
        <p className="text-sm text-[#665D50] mt-1 max-w-2xl">
          Antes de pasar la tarjeta o añadir al carrito, consulta con Wilma. Evaluamos si el color, corte y tejido trabajan para ti o si quedará olvidada en el armario.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Image Preview & Upload */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-3">
              Foto de la prenda que estás mirando
            </span>

            <div className="relative aspect-[3/4] max-h-96 w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#DDD5C9] mb-4 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Prenda a evaluar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-[#8C8275]">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="text-xs">Sube la foto de la prenda o etiqueta</span>
                </div>
              )}
            </div>

            <label className="w-full py-2.5 px-4 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] hover:bg-[#F2ECE3] text-xs font-semibold text-[#1A1816] text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              <span>Subir foto (Tienda física o captura online)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Presets */}
            <div className="mt-4 pt-3 border-t border-[#EFE9DF]">
              <span className="text-[11px] text-[#7A7062] block mb-2">
                O prueba con uno de estos ejemplos:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_BUY_ITEMS.map((sample, idx) => (
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
                    <span className="text-[9px] text-[#8C8275] block">
                      {sample.price}€ · {sample.store}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Metadata Inputs */}
        <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
                Precio de la prenda (€)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
                Tienda o marca
              </label>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="ej. Massimo Dutti, COS, Sezane, Zara..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
              />
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A5B38] block mb-1">
                La Regla de las 3 Combinaciones de Wilma
              </span>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                Una compra solo es rentable si combina de forma inmediata con al menos 3 prendas que ya posees en tu armario digital sin tener que comprar nada más.
              </p>
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
                  <span>Calculando compatibilidad y coste por uso...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6AF2E]" />
                  <span>¿Me lo compro? Consultar con Wilma</span>
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

      {/* VERDICT AND RESULT BOX */}
      {result && (
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#DCD5C9] shadow-sm space-y-8 animate-fadeIn">
          {/* Header Verdict */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#E5DFD5]">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5 mb-2">
                {result.recommendation === 'comprar' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2E5E4E] text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Compra Recomendada!</span>
                  </span>
                )}
                {result.recommendation === 'considerar' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C98A2C] text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Considerar con cautela</span>
                  </span>
                )}
                {result.recommendation === 'no_comprar' && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#A3433B] text-white flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>No recomendada</span>
                  </span>
                )}
                <span className="text-xs text-[#7A7062] font-medium">
                  {result.confidence}% certidumbre
                </span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1816]">
                {result.titular}
              </h2>
            </div>

            {/* Cost Per Use Badge */}
            <div className="bg-white p-4 rounded-2xl border border-[#E0D8CB] flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#8A5B38]">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A7062] block">
                  Coste estimado por puesta
                </span>
                <span className="text-xs font-semibold text-[#1A1816]">
                  {result.costPerUseEstimate}
                </span>
              </div>
            </div>
          </div>

          {/* Compatibility Radar Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {Object.entries(result.compatibility).map(([key, val]) => (
              <div key={key} className="bg-white p-4 rounded-2xl border border-[#E5DFD5]">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[11px] font-bold uppercase text-[#7A7062] capitalize">
                    {key}
                  </span>
                  <span className="text-xs font-bold text-[#1A1816]">{val.score}%</span>
                </div>
                <p className="text-xs text-[#5E5549] leading-relaxed">
                  {val.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Combinations with existing items */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5DFD5] space-y-4">
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8A5B38]" />
              <span>Cómo multiplicará tu armario existente</span>
            </h3>

            <div className="space-y-2.5">
              {result.combinations.map((comb, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                  <CheckCircle2 className="w-4 h-4 text-[#2E5E4E] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#4A4337]">{comb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Tips */}
          {result.alternativeSuggestions && result.alternativeSuggestions.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E0D8CB]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-2">
                Consejos de compra y comprobaciones antes de pagar
              </span>
              <ul className="space-y-1.5 text-xs text-[#5E5549]">
                {result.alternativeSuggestions.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8A5B38] font-bold">·</span>
                    <span>{tip}</span>
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
