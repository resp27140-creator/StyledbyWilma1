import React, { useState } from 'react';
import { UserProfile, FullStyleDNA, WardrobeItem, OutfitCombination } from '../../types/index.ts';
import { OutfitSnapshotModal } from '../OutfitSnapshotModal.tsx';
import {
  MessageCircle,
  Shirt,
  Camera,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Flame,
  Calendar,
  Check,
  Share2,
  ChevronRight,
  Clock,
  Sun,
  Palette
} from 'lucide-react';
import {
  getStoredWeeklyPlan,
  saveStoredWeeklyPlan,
  WeeklyOutfitPlan
} from '../../lib/storage.ts';

interface DashboardViewProps {
  user: UserProfile;
  styleDNA: FullStyleDNA;
  wardrobe: WardrobeItem[];
  outfits: OutfitCombination[];
  onNavigate: (tabId: string) => void;
  onOpenOnboarding: () => void;
  onOpenUpsell?: (triggerKey: string) => void;
  streakDays?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  styleDNA,
  wardrobe,
  outfits,
  onNavigate,
  onOpenOnboarding,
  onOpenUpsell,
  streakDays = 4
}) => {
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyOutfitPlan>(getStoredWeeklyPlan);
  const [activePlanDay, setActivePlanDay] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'>('lunes');
  const [showMorningNotification, setShowMorningNotification] = useState<boolean>(true);

  const featuredOutfit = outfits[0] || null;

  const handleAssignOutfitToDay = (outfitId: string) => {
    const updated = { ...weeklyPlan, [activePlanDay]: outfitId };
    setWeeklyPlan(updated);
    saveStoredWeeklyPlan(updated);
  };

  const dayLabels: Record<string, string> = {
    lunes: 'Lun',
    martes: 'Mar',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    sabado: 'Sáb',
    domingo: 'Dom'
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* ----------------------------------------------------------------- */}
      {/* Top Greeting & Daily Streak Banner                                */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C8275]">
              Asesoría Activa · {styleDNA.color.subestacion}
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl text-[#1A1816] font-normal tracking-tight">
            Hola, <span className="italic font-serif font-medium">{user.displayName.split(' ')[0]}</span> ✨
          </h1>
        </div>

        {/* Streak counter hook */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] border border-[#EADBCE] text-[#8A5B38] text-xs font-semibold shadow-2xs">
            <Flame className="w-4 h-4 fill-[#C86D51] text-[#C86D51]" />
            <span>Racha: {streakDays} días consecutivos</span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Daily Morning Hook Notification (7:00 AM Simulation)              */}
      {/* ----------------------------------------------------------------- */}
      {showMorningNotification && (
        <div className="bg-[#FAF7F2] border border-[#E8DFC8] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 text-[#C9A88C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A5B38]">
                  Rutina Matutina 7:00 AM
                </span>
                <span className="text-[10px] text-[#7A7062]">· Clima templado 19°C</span>
              </div>
              <p className="text-xs text-[#2D2D2D] font-medium mt-0.5">
                “Buenos días, {user.displayName.split(' ')[0]}. Hoy tienes reuniones y jornada híbrida. ¿Te ayudo a elegir?”
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('what-to-wear')}
              className="px-3.5 py-1.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A] transition-all cursor-pointer"
            >
              Vestirme ahora
            </button>
            <button
              onClick={() => setShowMorningNotification(false)}
              className="text-[#8C8275] hover:text-[#1A1816] p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* HERO CARD: ¿QUÉ NECESITAS HOY? (Dominant action)                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-1">
            Asistencia Inmediata
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1816]">
            ¿Qué necesitas hoy?
          </h2>
        </div>

        {/* Dominant Primary Button: Hablar con mi stylist */}
        <button
          onClick={() => onNavigate('chat')}
          className="w-full group bg-[#1A1816] text-[#FAF8F5] p-5 sm:p-6 rounded-2xl flex items-center justify-between hover:bg-[#2D2D2D] transition-all duration-300 shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#C9A88C] group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl sm:text-2xl font-bold block text-white">
                  Hablar con mi stylist
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider bg-white/15 px-2 py-0.5 rounded-full text-[#EADBCE]">
                  Wilma 24/7
                </span>
              </div>
              <p className="text-xs text-[#D8D2C9] mt-0.5">
                Pregúntame cualquier duda con memoria de tu armario, silueta y agenda
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#C9A88C] group-hover:translate-x-1 transition-transform">
            <span>Iniciar chat</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* 3 Quick Action Cards: Qué me pongo | Look check | Comprar */}
        <div className="space-y-2 pt-2 border-t border-[#EFE9DF]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#736859] block mb-2">
            O elige una acción rápida:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Qué me pongo */}
            <button
              onClick={() => onNavigate('what-to-wear')}
              className="p-4 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] hover:bg-white hover:border-[#1A1816] transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-[#8A5B38] shadow-2xs">
                  <Shirt className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1816]">
                  ¿Qué me pongo?
                </h3>
                <p className="text-[11px] text-[#665D50] mt-0.5">
                  Recomendación para tu clima y ocasión
                </p>
              </div>
            </button>

            {/* Look check */}
            <button
              onClick={() => onNavigate('style-check')}
              className="p-4 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] hover:bg-white hover:border-[#1A1816] transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#D9E3DC] flex items-center justify-center text-[#2E5E4E] shadow-2xs">
                  <Camera className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1816]">
                  Analiza mi look
                </h3>
                <p className="text-[11px] text-[#665D50] mt-0.5">
                  Foto de lo que llevas y feedback objetivo
                </p>
              </div>
            </button>

            {/* Comprar */}
            <button
              onClick={() => onNavigate('buy-check')}
              className="p-4 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] hover:bg-white hover:border-[#1A1816] transition-all duration-200 text-left flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E6DAE2] flex items-center justify-center text-[#7A4B6E] shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1A1816]">
                  ¿Me lo compro?
                </h3>
                <p className="text-[11px] text-[#665D50] mt-0.5">
                  Evalúa si multiplica tu armario antes de pagar
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION: TU STYLE DNA (Simplified Percentage Bars)                 */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-0.5">
              Identidad de Estilo
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Tu Style DNA
            </h2>
          </div>
          <button
            onClick={() => onNavigate('style-dna')}
            className="text-xs text-[#8A5B38] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Dominant Percentage Bars */}
        <div className="space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#1A1816]">{styleDNA.style.clasicoPct}% Clásico Chic</span>
              <span className="text-[#736859]">Base estructural</span>
            </div>
            <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1A1816] h-full rounded-full transition-all duration-500"
                style={{ width: `${styleDNA.style.clasicoPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#1A1816]">{styleDNA.style.naturalPct}% Natural Relajado</span>
              <span className="text-[#736859]">Comodidad y fibras</span>
            </div>
            <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8A5B38] h-full rounded-full transition-all duration-500"
                style={{ width: `${styleDNA.style.naturalPct}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#1A1816]">{styleDNA.style.elegantePct}% Elegante Sofisticado</span>
              <span className="text-[#736859]">Cortes pulidos</span>
            </div>
            <div className="w-full bg-[#EFE9DF] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2E5E4E] h-full rounded-full transition-all duration-500"
                style={{ width: `${styleDNA.style.elegantePct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Palette pill summary */}
        <div className="mt-5 pt-4 border-t border-[#EFE9DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#736859]">
              Paleta principal: <strong className="text-[#1A1816]">{styleDNA.color.subestacion}</strong>
            </span>
            <div className="flex items-center gap-1.5 ml-2">
              {['#C19A6B', '#C86D51', '#6B7A58', '#FDFBF7'].map((hex) => (
                <span
                  key={hex}
                  className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
          <button
            onClick={() => onNavigate('color-check')}
            className="text-xs text-[#8C8275] hover:text-[#1A1816] flex items-center gap-1 cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Consultar color</span>
          </button>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION: RECOMENDACIÓN DEL DÍA                                    */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-0.5">
              Outfit del Día
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Recomendación del Día
            </h2>
          </div>
          {featuredOutfit && (
            <span className="text-xs font-semibold text-[#2E5E4E] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full">
              {featuredOutfit.puntuacionIa}% Match
            </span>
          )}
        </div>

        {featuredOutfit ? (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#2D2D2D] leading-relaxed">
              “{featuredOutfit.nombre}: {featuredOutfit.notas}”
            </p>

            {/* Outfit Preview Pieces */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featuredOutfit.itemIds.map((itemId) => {
                const item = wardrobe.find((w) => w.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden border border-[#E5DFD5] bg-[#FAF8F5] p-2 text-center"
                  >
                    <img
                      src={item.imagenUrl}
                      alt={item.nombre}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <span className="text-[11px] font-medium text-[#1A1816] line-clamp-1 block">
                      {item.nombre}
                    </span>
                    <span className="text-[10px] text-[#7A7062] capitalize block">
                      {item.categoria}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#EFE9DF] flex items-center justify-between">
              <button
                onClick={() => setIsSnapshotOpen(true)}
                className="text-xs font-semibold text-[#8A5B38] hover:text-[#1A1816] flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Ver Snapshot & Compartir</span>
              </button>

              <button
                onClick={() => onNavigate('what-to-wear')}
                className="text-xs font-semibold text-[#1A1816] hover:text-[#8A5B38] flex items-center gap-1 cursor-pointer"
              >
                <span>Generar otro outfit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-[#7A7062]">
            Aún no has generado tu outfit del día.
            <button
              onClick={() => onNavigate('what-to-wear')}
              className="ml-2 underline font-semibold text-[#1A1816]"
            >
              Crear uno ahora
            </button>
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* SECTION: PLANIFICADOR SEMANAL & RETO DE ESTILO (Retención Semanal) */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        {/* Planificador semanal */}
        <div className="sm:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8C8275]">
                Planificación Semanal
              </span>
              <span className="text-[10px] text-[#7A7062]">Lun - Dom</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Tus Looks de la Semana
            </h3>
            <p className="text-xs text-[#665D50] mt-1 mb-4">
              Evita el estrés matutino asignando con antelación tus combinaciones.
            </p>

            {/* Day Selector Pills */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const).map((day) => {
                const isSelected = activePlanDay === day;
                const hasAssigned = !!weeklyPlan[day];
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setActivePlanDay(day)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1816] text-[#FAF8F5]'
                        : hasAssigned
                        ? 'bg-[#FAF0E6] text-[#8A5B38] border border-[#EADBCE]'
                        : 'bg-[#FAF8F5] text-[#736859] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <span className="block text-[10px] uppercase">{dayLabels[day]}</span>
                    <span className="block mt-0.5">{hasAssigned ? '✓' : '—'}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Day Card */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E8E2D8] text-xs">
              <div className="font-semibold text-[#1A1816] capitalize mb-1">
                Outfit para el {activePlanDay}:
              </div>
              {weeklyPlan[activePlanDay] ? (
                <div className="flex items-center justify-between text-[#2D2D2D]">
                  <span>
                    {outfits.find((o) => o.id === weeklyPlan[activePlanDay])?.nombre || 'Look Seleccionado'}
                  </span>
                  <button
                    onClick={() => handleAssignOutfitToDay('')}
                    className="text-[10px] text-[#8C8275] hover:text-[#8C3A33] cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[#7A7062]">
                  <span>Ningún look asignado aún</span>
                  {outfits[0] && (
                    <button
                      onClick={() => handleAssignOutfitToDay(outfits[0].id)}
                      className="text-[11px] font-semibold text-[#1A1816] hover:underline cursor-pointer"
                    >
                      Asignar look del día
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reto de estilo semanal */}
        <div className="sm:col-span-5 bg-gradient-to-br from-[#FAF0E6] to-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#EADBCE] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9C7A4A]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#9C7A4A]">
                Reto de Estilo Semanal
              </span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Monocromía Cálida
            </h3>
            <p className="text-xs text-[#5E5549] mt-2 leading-relaxed">
              “Esta semana prueba combinar tu <strong>Blazer Sastrería Camel</strong> con el <strong>Pantalón Beige Arena</strong> y un accesorio coñac para crear una línea vertical alargadora.”
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#EADBCE]/60 flex items-center justify-between">
            <span className="text-[11px] text-[#7A7062]">
              3 de 5 usuarias completaron este reto
            </span>
            <button
              onClick={() => onNavigate('what-to-wear')}
              className="text-xs font-semibold text-[#1A1816] hover:underline cursor-pointer"
            >
              Armar look →
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Modal */}
      {featuredOutfit && (
        <OutfitSnapshotModal
          isOpen={isSnapshotOpen}
          onClose={() => setIsSnapshotOpen(false)}
          outfit={featuredOutfit}
          wardrobe={wardrobe}
          styleDNA={styleDNA}
        />
      )}
    </div>
  );
};
