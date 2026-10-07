import React, { useState } from 'react';
import {
  FullStyleDNA,
  WardrobeItem,
  OutfitCombination,
  WhatToWearResponse
} from '../../types/index.ts';
import { requestWhatToWear } from '../../lib/api.ts';
import {
  Shirt,
  Sparkles,
  CloudSun,
  Clock,
  Smile,
  CheckCircle,
  BookmarkPlus,
  Loader2,
  RefreshCw,
  Info
} from 'lucide-react';

interface WhatToWearViewProps {
  styleDNA: FullStyleDNA;
  wardrobe: WardrobeItem[];
  onSaveOutfit: (outfit: OutfitCombination) => void;
}

export const WhatToWearView: React.FC<WhatToWearViewProps> = ({
  styleDNA,
  wardrobe,
  onSaveOutfit
}) => {
  const [occasion, setOccasion] = useState('Reunión de trabajo ejecutiva');
  const [context, setContext] = useState('Oficina corporativa con clientes');
  const [weather, setWeather] = useState('Templado (20°C)');
  const [timeAvailable, setTimeAvailable] = useState('15 minutos');
  const [mood, setMood] = useState('Segura, profesional y cómoda');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatToWearResponse | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const response = await requestWhatToWear(
        {
          occasion,
          context,
          weather,
          timeAvailable,
          mood
        },
        styleDNA,
        wardrobe
      );
      setResult(response);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al obtener recomendación');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCloset = () => {
    if (!result) return;

    const matchedItemIds = result.items
      .map((it) => it.wardrobeItemId)
      .filter((id): id is string => Boolean(id));

    const newOutfit: OutfitCombination = {
      id: `outfit_${Date.now()}`,
      nombre: result.outfitDescription,
      ocasion: occasion,
      itemIds: matchedItemIds.length > 0 ? matchedItemIds : wardrobe.slice(0, 3).map((w) => w.id),
      puntuacionIa: 96,
      notas: result.explicacion,
      guardado: true,
      createdAt: new Date().toISOString()
    };

    onSaveOutfit(newOutfit);
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
            Asesoría Inmediata
          </span>
          <span className="text-xs text-[#8C8275]">·</span>
          <span className="text-xs text-[#2E5E4E] font-medium">Personalizado con tu Style DNA</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
          ¿Qué me pongo hoy?
        </h1>
        <p className="text-sm text-[#665D50] mt-1 max-w-2xl">
          Configura tu contexto y Wilma construirá un conjunto completo priorizando las prendas de tu armario digital y respetando tus proporciones de cuerpo y colorimetría.
        </p>
      </div>

      {/* Input Parameters Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Ocasión */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
              Ocasión del día
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="ej. Presentación ante comité, Cena con amigos, Boda de día..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
            />
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                'Reunión directiva',
                'Home office con videollamadas',
                'Cena casual en restaurante',
                'Viaje de negocios',
                'Fin de semana cultural'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setOccasion(chip)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-[#F3EFEA] hover:bg-[#EADBCE] text-[#5E5549] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Contexto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
              Contexto o entorno
            </label>
            <input
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="ej. Sala con aire acondicionado, Exterior soleado, Casual chic..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
            />
          </div>

          {/* Clima */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-[#8A5B38]" />
              <span>Clima previsto</span>
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
            >
              <option value="Templado (18-22°C)">Templado agradable (18-22°C)</option>
              <option value="Caluroso (25-30°C)">Caluroso / Verano (25-30°C)</option>
              <option value="Fresco / Entretiempo (14-17°C)">Fresco / Entretiempo (14-17°C)</option>
              <option value="Frío / Invierno (8-13°C)">Frío de invierno (8-13°C)</option>
              <option value="Lluvioso">Lluvioso y variable</option>
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#8A5B38]" />
              <span>Estado de ánimo / Sensación deseada</span>
            </label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="ej. Segura, relajada, sofisticada, creativa..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#1A1816] text-[#FAF8F5] text-sm font-semibold hover:bg-[#332E2A] transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Consultando tu Style DNA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E6AF2E]" />
                <span>Generar Recomendación de Look</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMsg}
        </div>
      )}

      {/* RESULT CARD */}
      {result && (
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-[#DCD5C9] shadow-sm space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A5B38] block mb-1">
                Propuesta de Wilma
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
                {result.outfitDescription}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveToCloset}
                disabled={savedSuccess}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  savedSuccess
                    ? 'bg-[#2E5E4E] text-white'
                    : 'bg-white border border-[#D9D1C5] text-[#1A1816] hover:bg-[#F2ECE3]'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Guardado en Mi Armario</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Guardar combinación</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recommended items list */}
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816] mb-4">
              Prendas seleccionadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.items.map((item, idx) => {
                const matchedWardrobeItem = item.wardrobeItemId
                  ? wardrobe.find((w) => w.id === item.wardrobeItemId)
                  : null;

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-[#E5DFD5] flex gap-4 shadow-xs"
                  >
                    {matchedWardrobeItem ? (
                      <img
                        src={matchedWardrobeItem.imagenUrl}
                        alt={matchedWardrobeItem.nombre}
                        className="w-20 h-24 object-cover rounded-xl shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-24 rounded-xl bg-[#F3EFEA] flex flex-col items-center justify-center text-[#8C8275] shrink-0 p-2 text-center">
                        <Shirt className="w-6 h-6 mb-1" />
                        <span className="text-[10px] uppercase font-bold">{item.categoria}</span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275]">
                            {item.categoria}
                          </span>
                          {item.fromWardrobe && (
                            <span className="text-[10px] font-semibold text-[#2E5E4E] bg-[#E8F2EC] px-2 py-0.5 rounded-full">
                              De tu armario
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-[#1A1816] mt-0.5">
                          {item.descripcion}
                        </h4>
                        <p className="text-xs text-[#7A7062] mt-0.5">
                          Color: <span className="text-[#1A1816] font-medium">{item.color}</span>
                        </p>
                      </div>

                      {item.tips && (
                        <p className="text-[11px] text-[#8A5B38] bg-[#FAF6F0] p-1.5 rounded-lg mt-2 border border-[#EFE5D8]">
                          💡 {item.tips}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep personalized justification */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5DFD5] space-y-4">
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Por qué este look funciona para ti
            </h3>
            <p className="text-sm text-[#5E5549] leading-relaxed">
              {result.explicacion}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#EFE9DF]">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275] block mb-1">
                  Colorimetría ({styleDNA.color.estacionPrincipal})
                </span>
                <p className="text-xs text-[#5E5549] leading-relaxed">
                  {result.colorimetriaMatch}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275] block mb-1">
                  Proporciones corporales
                </span>
                <p className="text-xs text-[#5E5549] leading-relaxed">
                  {result.proporcionesMatch}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8275] block mb-1">
                  Estilo auténtico
                </span>
                <p className="text-xs text-[#5E5549] leading-relaxed">
                  {result.estiloMatch}
                </p>
              </div>
            </div>
          </div>

          {/* Alternativas */}
          {result.alternativas && result.alternativas.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#F5F2EB] border border-[#E0D8CB]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-2">
                Variaciones y alternativas sugeridas
              </span>
              <ul className="space-y-1.5 text-xs text-[#5E5549]">
                {result.alternativas.map((alt, i) => (
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
