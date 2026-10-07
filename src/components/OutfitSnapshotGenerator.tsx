import React, { useRef, useState, useEffect } from 'react';
import { OutfitCombination, WardrobeItem, FullStyleDNA } from '../types/index.ts';
import { toPng } from 'html-to-image';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Camera,
  RefreshCw,
  Palette
} from 'lucide-react';
import { ShareButton } from './ShareButton.tsx';

export interface OutfitSnapshotGeneratorProps {
  outfit: OutfitCombination;
  wardrobe: WardrobeItem[];
  styleDNA: FullStyleDNA;
  onImageGenerated?: (imageUrl: string) => void;
  className?: string;
  theme?: 'champagne' | 'noir';
  showControls?: boolean;
}

/**
 * OutfitSnapshotGenerator Component
 * Renders a high-fashion editorial snapshot of an outfit combination
 * and generates a high-resolution exportable image URL for sharing via ShareButton.
 */
export const OutfitSnapshotGenerator: React.FC<OutfitSnapshotGeneratorProps> = ({
  outfit,
  wardrobe,
  styleDNA,
  onImageGenerated,
  className = '',
  theme: initialTheme = 'champagne',
  showControls = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'champagne' | 'noir'>(initialTheme);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const matchedItems = outfit.itemIds
    .map((id) => wardrobe.find((w) => w.id === id))
    .filter((item): item is WardrobeItem => Boolean(item));

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Generate image data URL from the DOM card element
  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: theme === 'champagne' ? '#FAF8F5' : '#141210'
      });
      setGeneratedImageUrl(dataUrl);
      onImageGenerated?.(dataUrl);
      return dataUrl;
    } catch (err) {
      console.error('Error in OutfitSnapshotGenerator toPng:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate snapshot image when card mounts or theme changes
  useEffect(() => {
    const timer = setTimeout(() => {
      generateImage();
    }, 400);
    return () => clearTimeout(timer);
  }, [theme, outfit.id]);

  const handleDownload = async () => {
    let url = generatedImageUrl;
    if (!url) {
      url = await generateImage();
    }
    if (!url) {
      showStatus('No se pudo generar la imagen para descargar');
      return;
    }

    const link = document.createElement('a');
    link.download = `styled-by-wilma-${outfit.nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = url;
    link.click();
    showStatus('¡Imagen descargada con éxito!');
  };

  const handleCopySummary = async () => {
    const textSummary = `✨ Styled By Wilma · Snapshot de Outfit\n\n"${outfit.nombre}"\nOcasión: ${outfit.ocasion}\nCompatibilidad con Style DNA: ${outfit.puntuacionIa}%\n\nPrendas:\n${matchedItems.map(i => `• ${i.nombre} (${i.categoria}) en tono ${i.colorPrincipal}`).join('\n')}\n\nNota de Estilismo:\n"${outfit.notas}"\n\n#StyledByWilma #StyleDNA #${styleDNA.color.subestacion.replace(/\s+/g, '')}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      showStatus('Resumen copiado al portapapeles');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isChampagne = theme === 'champagne';

  const shareText = `✨ Look de Hoy: "${outfit.nombre}" (${outfit.ocasion})\nCompatibilidad Style DNA: ${outfit.puntuacionIa}%\nPrendas: ${matchedItems.map(i => i.nombre).join(', ')}\n\n"${outfit.notas}"`;

  return (
    <div className={`flex flex-col items-center w-full ${className}`}>
      {/* Optional Top Toolbar Controls */}
      {showControls && (
        <div className="w-full flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8A5B38]" />
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8275]">
              Estilo Editorial
            </span>
          </div>

          <div className="flex items-center bg-[#F3EFEA] p-0.5 rounded-full border border-[#E0D8CB] text-[11px]">
            <button
              type="button"
              onClick={() => setTheme('champagne')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                isChampagne ? 'bg-white text-[#1A1816] shadow-xs' : 'text-[#7A7062]'
              }`}
            >
              Champagne
            </button>
            <button
              type="button"
              onClick={() => setTheme('noir')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                !isChampagne ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs' : 'text-[#7A7062]'
              }`}
            >
              Noir
            </button>
          </div>
        </div>
      )}

      {/* The Printable / Renderable Outfit Snapshot Card */}
      <div
        ref={cardRef}
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-xl border transition-all duration-300 relative overflow-hidden ${
          isChampagne
            ? 'bg-[#FAF8F5] text-[#1A1816] border-[#DED6CA]'
            : 'bg-[#161412] text-[#FAF8F5] border-[#38332E]'
        }`}
      >
        {/* Editorial Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-black/10 dark:border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-editorial text-2xl font-bold tracking-widest ${
                isChampagne ? 'bg-[#1A1816] text-[#FAF8F5]' : 'bg-[#EADBCE] text-[#1A1816]'
              }`}
            >
              W
            </div>
            <div>
              <span className="font-editorial text-xl tracking-[0.2em] font-bold uppercase block leading-tight">
                Styled by Wilma
              </span>
              <span className={`text-[9px] tracking-[0.25em] uppercase block ${isChampagne ? 'text-[#8C8275]' : 'text-[#A89D8E]'}`}>
                Style DNA™ Snapshot
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${isChampagne ? 'text-[#8A5B38]' : 'text-[#E0A96D]'}`}>
              {styleDNA.color.subestacion}
            </span>
            <span className={`text-[10px] block ${isChampagne ? 'text-[#7A7062]' : 'text-[#A09587]'}`}>
              {styleDNA.user.displayName}
            </span>
          </div>
        </div>

        {/* Look Header & Match Badge */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-[11px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full border ${
                isChampagne
                  ? 'bg-[#F2ECE3] text-[#7A4B28] border-[#E2D8C9]'
                  : 'bg-[#29241F] text-[#E0A96D] border-[#423A31]'
              }`}
            >
              {outfit.ocasion}
            </span>
            <span className="text-xs font-bold text-[#2E5E4E] bg-[#E8F2EC] px-3 py-1 rounded-full">
              ★ {outfit.puntuacionIa}% Match
            </span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            {outfit.nombre}
          </h2>
        </div>

        {/* Items Grid Collage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {matchedItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-2 border flex flex-col justify-between overflow-hidden ${
                isChampagne
                  ? 'bg-white border-[#E5DFD5]'
                  : 'bg-[#221F1C] border-[#38332E]'
              }`}
            >
              <img
                src={item.imagenUrl}
                alt={item.nombre}
                crossOrigin="anonymous"
                className="w-full h-24 object-cover rounded-xl mb-2"
              />
              <div>
                <span
                  className={`text-[9px] uppercase font-bold tracking-wider block line-clamp-1 ${
                    isChampagne ? 'text-[#8C8275]' : 'text-[#A89D8E]'
                  }`}
                >
                  {item.categoria}
                </span>
                <span className="text-[11px] font-semibold line-clamp-1 block">
                  {item.nombre}
                </span>
                <span
                  className={`text-[10px] block line-clamp-1 ${
                    isChampagne ? 'text-[#7A7062]' : 'text-[#B8ADA0]'
                  }`}
                >
                  {item.colorPrincipal}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stylist Wilma's Verdict Note */}
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed mb-5 ${
            isChampagne
              ? 'bg-[#F5F0E9] border-[#E5DDD0] text-[#5E5549]'
              : 'bg-[#201C19] border-[#36302A] text-[#D8CEBF]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#8A5B38]" />
            <span className={isChampagne ? 'text-[#1A1816]' : 'text-[#FAF8F5]'}>
              Veredicto de Wilma:
            </span>
          </div>
          <p>{outfit.notas}</p>
        </div>

        {/* Card Footer Watermark with Palette Swatches */}
        <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 text-[10px]">
          <div className="flex items-center gap-1.5">
            {['#C19A6B', '#FDFBF7', '#6B7A58', '#C86D51'].map((hex, idx) => (
              <span
                key={idx}
                className="w-3 h-3 rounded-full border border-black/15 shadow-inner"
                style={{ backgroundColor: hex }}
              />
            ))}
            <span className={`ml-1 font-medium ${isChampagne ? 'text-[#7A7062]' : 'text-[#A09587]'}`}>
              Armonía {styleDNA.color.subestacion}
            </span>
          </div>

          <span className={`tracking-wider uppercase font-medium ${isChampagne ? 'text-[#8C8275]' : 'text-[#8A8071]'}`}>
            styledbywilma.com
          </span>
        </div>
      </div>

      {/* Action Bar with ShareButton and Export Controls */}
      {showControls && (
        <div className="w-full max-w-lg mt-4 flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#E2DBD0] shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#D9D1C5] bg-white text-xs font-semibold text-[#1A1816] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E5E4E]" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#736859]" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#D9D1C5] bg-white text-xs font-semibold text-[#1A1816] hover:bg-[#FAF8F5] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-[#736859]" />
              <span>{isGenerating ? 'Generando...' : 'Descargar'}</span>
            </button>
          </div>

          {/* ShareButton receiving the generated image URL */}
          <ShareButton
            imageUrl={generatedImageUrl}
            title={`Look "${outfit.nombre}" · Styled by Wilma`}
            text={shareText}
            url={window.location.href}
            buttonText="Compartir Look"
            variant="primary"
          />
        </div>
      )}

      {statusMessage && (
        <div className="mt-2 text-xs font-medium text-[#2E5E4E] bg-[#E8F2EC] px-3 py-1 rounded-full animate-fadeIn">
          {statusMessage}
        </div>
      )}
    </div>
  );
};
