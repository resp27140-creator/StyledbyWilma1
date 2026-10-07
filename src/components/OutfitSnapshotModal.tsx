import React, { useRef, useState } from 'react';
import { OutfitCombination, WardrobeItem, FullStyleDNA } from '../types/index.ts';
import { toPng } from 'html-to-image';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Camera,
  Shirt,
  Calendar,
  Layers
} from 'lucide-react';
import { ShareButton } from './ShareButton.tsx';

interface OutfitSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitCombination | null;
  wardrobe: WardrobeItem[];
  styleDNA: FullStyleDNA;
}

export const OutfitSnapshotModal: React.FC<OutfitSnapshotModalProps> = ({
  isOpen,
  onClose,
  outfit,
  wardrobe,
  styleDNA
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'champagne' | 'noir'>('champagne');

  if (!isOpen || !outfit) return null;

  const matchedItems = outfit.itemIds
    .map((id) => wardrobe.find((w) => w.id === id))
    .filter((item): item is WardrobeItem => Boolean(item));

  const [notification, setNotification] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Pre-generate image for ShareButton
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (cardRef.current) {
        try {
          const dataUrl = await toPng(cardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: theme === 'champagne' ? '#FAF8F5' : '#141210'
          });
          setGeneratedImageUrl(dataUrl);
        } catch {
          // ignore background generate
        }
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [theme, outfit?.id]);

  // Export to PNG Image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: theme === 'champagne' ? '#FAF8F5' : '#141210'
      });

      const link = document.createElement('a');
      link.download = `styled-by-wilma-${outfit.nombre.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      showNotification('¡Imagen de alta resolución descargada con éxito!');
    } catch (err) {
      console.error('Error exporting image with html-to-image:', err);
      // Fallback: Copy summary to clipboard instead of window.alert
      await handleCopyText();
      showNotification('Se copió la ficha del outfit al portapapeles.');
    } finally {
      setIsExporting(false);
    }
  };

  // Native Web Share or Fallback
  const handleShare = async () => {
    const textSummary = `✨ Look de Hoy: "${outfit.nombre}" (${outfit.ocasion})\n👗 Combinación creada con Styled By Wilma (Match: ${outfit.puntuacionIa}%)\n\nPrendas:\n${matchedItems.map(i => `• ${i.nombre} (${i.colorPrincipal})`).join('\n')}\n\n"${outfit.notas}"`;

    if (navigator.share && cardRef.current) {
      try {
        setIsExporting(true);
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'outfit-wilma.png', { type: 'image/png' });

        await navigator.share({
          title: `Styled by Wilma · ${outfit.nombre}`,
          text: textSummary,
          files: [file]
        });
      } catch (e) {
        console.log('Share canceled or failed fallback to text', e);
        try {
          await navigator.share({
            title: `Styled by Wilma · ${outfit.nombre}`,
            text: textSummary
          });
        } catch {
          // user cancelled
        }
      } finally {
        setIsExporting(false);
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopyText();
    }
  };

  const handleCopyText = async () => {
    const textSummary = `✨ Styled By Wilma · Snapshot de Outfit\n\n"${outfit.nombre}"\nOcasión: ${outfit.ocasion}\nCompatibilidad con Style DNA: ${outfit.puntuacionIa}%\n\nPrendas seleccionadas:\n${matchedItems.map(i => `• ${i.nombre} (${i.categoria}) en tono ${i.colorPrincipal}`).join('\n')}\n\nNota de Estilismo:\n"${outfit.notas}"\n\n#StyledByWilma #StyleDNA #${styleDNA.color.subestacion.replace(/\s+/g, '')}`;

    await navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isChampagne = theme === 'champagne';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#DDD5C9] shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8A5B38]" />
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8275]">
              Snapshot Editorial para Compartir
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <div className="flex items-center bg-[#F3EFEA] p-0.5 rounded-full border border-[#E0D8CB] text-[11px]">
              <button
                onClick={() => setTheme('champagne')}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  isChampagne ? 'bg-white text-[#1A1816] shadow-xs' : 'text-[#7A7062]'
                }`}
              >
                Champagne
              </button>
              <button
                onClick={() => setTheme('noir')}
                className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                  !isChampagne ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs' : 'text-[#7A7062]'
                }`}
              >
                Noir
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7062] hover:text-[#1A1816] hover:bg-[#F2ECE3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Snapshot Content (The exportable canvas card) */}
        <div className="p-4 sm:p-6 bg-[#EBE5DB]/40 overflow-y-auto flex justify-center">
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
                <span className={`text-[11px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full border ${
                  isChampagne
                    ? 'bg-[#F2ECE3] text-[#7A4B28] border-[#E2D8C9]'
                    : 'bg-[#29241F] text-[#E0A96D] border-[#423A31]'
                }`}>
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
                    <span className={`text-[9px] uppercase font-bold tracking-wider block line-clamp-1 ${isChampagne ? 'text-[#8C8275]' : 'text-[#A89D8E]'}`}>
                      {item.categoria}
                    </span>
                    <span className="text-[11px] font-semibold line-clamp-1 block">
                      {item.nombre}
                    </span>
                    <span className={`text-[10px] block line-clamp-1 ${isChampagne ? 'text-[#7A7062]' : 'text-[#B8ADA0]'}`}>
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

            {/* Card Footer Watermark */}
            <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 text-[10px]">
              <div className="flex items-center gap-1.5">
                {[
                  '#C19A6B',
                  '#FDFBF7',
                  '#6B7A58',
                  '#C86D51'
                ].map((hex, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-full border border-black/15 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <span className={`ml-1 font-medium ${isChampagne ? 'text-[#7A7062]' : 'text-[#A09587]'}`}>
                  Armonía Otoño Suave
                </span>
              </div>

              <span className={`tracking-wider uppercase font-medium ${isChampagne ? 'text-[#8C8275]' : 'text-[#8A8071]'}`}>
                styledbywilma.com
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        {notification && (
          <div className="px-6 py-2 bg-[#E8F2EC] text-[#2E5E4E] border-t border-[#D0E5D9] text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
        <div className="px-6 py-4 border-t border-[#E8E2D9] bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7A7062]">
            Listo para Instagram, Pinterest o WhatsApp
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D9D1C5] bg-white text-xs font-semibold text-[#1A1816] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E5E4E]" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Resumen</span>
                </>
              )}
            </button>

            <ShareButton
              imageUrl={generatedImageUrl}
              title={`Styled by Wilma · ${outfit.nombre}`}
              text={`✨ Look de Hoy: "${outfit.nombre}" (${outfit.ocasion})\n👗 Combinación creada con Styled By Wilma (Match: ${outfit.puntuacionIa}%)\n\nPrendas:\n${matchedItems.map(i => `• ${i.nombre} (${i.colorPrincipal})`).join('\n')}\n\n"${outfit.notas}"`}
              url={window.location.href}
              buttonText="Compartir"
              variant="secondary"
              onShareSuccess={() => showNotification('¡Look compartido!')}
            />

            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generando...' : 'Descargar Imagen'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
