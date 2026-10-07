import React, { useState } from 'react';
import { UserProfile, FullStyleDNA, PremiumServiceBooking } from '../../types/index.ts';
import {
  Crown,
  Check,
  Shield,
  RotateCcw,
  Sparkles,
  Calendar,
  Palette,
  User,
  Sliders,
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { PLAN_LIMITS, getStoredUsage, getStoredBookings } from '../../lib/storage.ts';

interface ProfileViewProps {
  user: UserProfile;
  styleDNA: FullStyleDNA;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onUpdateDNA: (updatedDNA: FullStyleDNA) => void;
  onResetFactoryData: () => void;
  onOpenOnboarding: () => void;
  onOpenUpsell?: (triggerKey: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  styleDNA,
  onUpdateUser,
  onUpdateDNA,
  onResetFactoryData,
  onOpenOnboarding,
  onOpenUpsell
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [profession, setProfession] = useState(user.profession);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Accordion for optional diagnostics moved from initial onboarding
  const [activeDiagnosticTab, setActiveDiagnosticTab] = useState<'none' | 'color' | 'body' | 'lifestyle'>('none');

  // Local state for optional in-depth profile adjustments
  const [tempColor, setTempColor] = useState(styleDNA.color);
  const [tempBody, setTempBody] = useState(styleDNA.body);
  const [tempComfort, setTempComfort] = useState(styleDNA.comfort);

  const usage = getStoredUsage();
  const bookings: PremiumServiceBooking[] = getStoredBookings();
  const currentLimits = PLAN_LIMITS[user.subscriptionPlan];

  const plans = [
    {
      id: 'free' as const,
      name: 'Free',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      period: 'para siempre',
      desc: 'Acceso básico para comenzar a explorar tu estilo con límites mensuales.',
      features: [
        'Onboarding simplificado (3 etapas)',
        'Style DNA básico y ponderado',
        'Chat con stylist IA: 5 msgs/mes',
        '¿Qué me pongo?: 3 consultas/mes',
        'Analiza mi look: 3 análisis/mes',
        '¿Me lo compro?: 3 consultas/mes',
        '¿Este color es para mí?: 3 consultas/mes',
        'Armario digital: hasta 20 prendas'
      ]
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      monthlyPrice: '$19',
      yearlyPrice: '$149',
      savings: 'Ahorra $79/año',
      period: billingCycle === 'monthly' ? '/ mes' : '/ año',
      popular: true,
      desc: 'Tu stylist IA personal ilimitada para todas tus decisiones de vestuario.',
      features: [
        'Todo lo de Free incluido',
        'Chat con stylist IA ilimitado 24/7',
        '¿Qué me pongo? diario ilimitado',
        'Analiza mi look con visión IA ilimitado',
        '¿Me lo compro? en tiendas ilimitado',
        '¿Este color es para mí? ilimitado',
        'Armario digital y combinaciones ilimitadas',
        'Planificador semanal de outfits completo'
      ]
    },
    {
      id: 'premium_plus' as const,
      name: 'Premium+',
      monthlyPrice: '$79',
      yearlyPrice: '$699',
      savings: 'Ahorra $249/año',
      period: billingCycle === 'monthly' ? '/ mes' : '/ año',
      desc: 'El modelo híbrido definitivo: IA ilimitada + acompañamiento humano de Wilma.',
      features: [
        'Todo lo de Premium ilimitado',
        '💎 Colorimetría profesional validada por Wilma (1 vez)',
        '💎 1 Style Review mensual completo de Wilma',
        '💎 1 Asesoría 1:1 por videollamada con Wilma',
        'Acceso prioritario al Atelier de Wilma'
      ]
    }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      displayName,
      profession
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveOptionalDiagnostics = () => {
    const updated: FullStyleDNA = {
      ...styleDNA,
      color: tempColor,
      body: tempBody,
      comfort: tempComfort
    };
    onUpdateDNA(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePlan = (planId: 'free' | 'premium' | 'premium_plus') => {
    onUpdateUser({
      ...user,
      subscriptionPlan: planId
    });
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
            Mi Cuenta & Preferencias
          </span>
          <span className="text-xs text-[#8C8275]">·</span>
          <span className="text-xs text-[#2E5E4E] font-semibold uppercase">
            Plan {user.subscriptionPlan.replace('_', '+')}
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
          Mi Perfil
        </h1>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. INFORMACIÓN PERSONAL Y DATOS BÁSICOS                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-[#EFE9DF]">
          <img
            src={user.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user.displayName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#D8D0C3]"
          />
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
              {user.displayName}
            </h2>
            <p className="text-xs text-[#7A7062]">
              {user.email} · Modalidad: {user.workMode}
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                Nombre para mostrar
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                Profesión
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-[#FAF8F5] text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-semibold text-[#2E5E4E]">
                ✓ Perfil actualizado con éxito
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A] transition-all cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CONSUMO DE LÍMITES MENSUALES (SEGUIMIENTO PLAN FREE/PRO)   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block">
              Consumo Mensual
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Tus Límites del Ciclo Actual
            </h3>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF0E6] text-[#8A5B38] border border-[#EADBCE]">
            Plan {user.subscriptionPlan.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] uppercase text-[#7A7062] block">Chat Stylist</span>
            <span className="font-editorial text-2xl font-bold text-[#1A1816]">
              {usage.chatMessagesThisMonth} <span className="text-xs text-[#7A7062]">/ {currentLimits.chatMax === Infinity ? '∞' : currentLimits.chatMax}</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] uppercase text-[#7A7062] block">¿Qué me pongo?</span>
            <span className="font-editorial text-2xl font-bold text-[#1A1816]">
              {usage.whatToWearThisMonth} <span className="text-xs text-[#7A7062]">/ {currentLimits.whatToWearMax === Infinity ? '∞' : currentLimits.whatToWearMax}</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] uppercase text-[#7A7062] block">Analiza mi look</span>
            <span className="font-editorial text-2xl font-bold text-[#1A1816]">
              {usage.styleCheckThisMonth} <span className="text-xs text-[#7A7062]">/ {currentLimits.styleCheckMax === Infinity ? '∞' : currentLimits.styleCheckMax}</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] uppercase text-[#7A7062] block">¿Me lo compro?</span>
            <span className="font-editorial text-2xl font-bold text-[#1A1816]">
              {usage.buyCheckThisMonth} <span className="text-xs text-[#7A7062]">/ {currentLimits.buyCheckMax === Infinity ? '∞' : currentLimits.buyCheckMax}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PLANES DE SUSCRIPCIÓN (Free, Premium, Premium+)            */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-1">
              Modelo de Suscripción
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#1A1816]">
              Planes Diseñados para tu Rutina
            </h2>
          </div>

          {/* Monthly / Yearly Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#DDD5C9] rounded-full self-start">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#1A1816] text-[#FAF8F5]'
                  : 'text-[#736859] hover:text-[#1A1816]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#1A1816] text-[#FAF8F5]'
                  : 'text-[#736859] hover:text-[#1A1816]'
              }`}
            >
              <span>Anual</span>
              <span className="text-[9px] bg-[#FAF0E6] text-[#8A5B38] px-1.5 py-0.2 rounded-full font-bold">
                Ahorro
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => {
            const isCurrent = user.subscriptionPlan === p.id;
            const price = billingCycle === 'monthly' ? p.monthlyPrice : p.yearlyPrice;

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#FAF8F5] border-[#1A1816] shadow-md ring-1 ring-[#1A1816]'
                    : 'bg-white border-[#E2DBD0] hover:border-[#C8BFB0]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#8C8275]">
                      {p.name}
                    </span>
                    {p.popular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#8A5B38] border border-[#EADBCE]">
                        Recomendado
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-editorial text-4xl font-bold text-[#1A1816]">
                      {price}
                    </span>
                    <span className="text-xs text-[#7A7062]">{p.period}</span>
                  </div>

                  {p.savings && billingCycle === 'yearly' && (
                    <span className="text-[10px] font-semibold text-[#2E5E4E] block mb-2">
                      {p.savings}
                    </span>
                  )}

                  <p className="text-xs text-[#665D50] leading-relaxed mb-4">
                    {p.desc}
                  </p>

                  <ul className="space-y-2 text-xs text-[#4A4337] pt-4 border-t border-[#EFE9DF]">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#2E5E4E] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <button
                    onClick={() => handleChangePlan(p.id)}
                    className={`w-full py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1A1816] text-[#FAF8F5]'
                        : 'bg-white border border-[#D9D1C5] text-[#1A1816] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    {isCurrent ? 'Plan Activo' : 'Seleccionar Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECCIONES OPCIONALES (MOVIDAS DEL ONBOARDING INICIAL)       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs space-y-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-1">
            Diagnósticos Avanzados Opcionales
          </span>
          <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
            Afina tu Perfil cuando lo Desees
          </h3>
          <p className="text-xs text-[#665D50] mt-1">
            Completaste el onboarding ágil en 3 etapas. Aquí puedes profundizar en colorimetría, proporciones corporales y hábitos de compra sin prisas.
          </p>
        </div>

        {/* Tab 1: Colorimetría Opcional */}
        <div className="border border-[#E2DBD0] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveDiagnosticTab(activeDiagnosticTab === 'color' ? 'none' : 'color')}
            className="w-full p-4 bg-[#FAF8F5] flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-[#8A5B38]" />
              <div>
                <span className="text-xs font-bold text-[#1A1816] block">
                  1. Colorimetría Detallada ({tempColor.subestacion})
                </span>
                <span className="text-[11px] text-[#7A7062]">
                  Origen: {tempColor.origen} · Confianza: {tempColor.confianza}% · {tempColor.validado_por_wilma ? 'Validado por Wilma ✓' : 'Pendiente de validación humana'}
                </span>
              </div>
            </div>
            {activeDiagnosticTab === 'color' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {activeDiagnosticTab === 'color' && (
            <div className="p-5 space-y-4 bg-white border-t border-[#E2DBD0]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Temperatura
                  </label>
                  <select
                    value={tempColor.temperatura}
                    onChange={(e) => setTempColor({ ...tempColor, temperatura: e.target.value as any })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  >
                    <option value="cálida">Cálida</option>
                    <option value="fría">Fría</option>
                    <option value="neutra">Neutra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Estación Principal
                  </label>
                  <select
                    value={tempColor.estacionPrincipal}
                    onChange={(e) => setTempColor({ ...tempColor, estacionPrincipal: e.target.value as any })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  >
                    <option value="Otoño">Otoño</option>
                    <option value="Primavera">Primavera</option>
                    <option value="Verano">Verano</option>
                    <option value="Invierno">Invierno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Metales cerca del rostro
                  </label>
                  <select
                    value={tempColor.metales}
                    onChange={(e) => setTempColor({ ...tempColor, metales: e.target.value as any })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  >
                    <option value="oro">Oro amarillo</option>
                    <option value="plata">Plata / Oro blanco</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => onOpenUpsell && onOpenUpsell('when_color_uncertain')}
                  className="text-xs text-[#8A5B38] font-semibold hover:underline cursor-pointer"
                >
                  ¿Dudas con tu colorimetría? Validar con Wilma personalmente →
                </button>
                <button
                  type="button"
                  onClick={handleSaveOptionalDiagnostics}
                  className="px-4 py-1.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                >
                  Guardar Color
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab 2: Proporciones Corporales */}
        <div className="border border-[#E2DBD0] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveDiagnosticTab(activeDiagnosticTab === 'body' ? 'none' : 'body')}
            className="w-full p-4 bg-[#FAF8F5] flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-[#2E5E4E]" />
              <div>
                <span className="text-xs font-bold text-[#1A1816] block">
                  2. Análisis Corporal y Proporciones
                </span>
                <span className="text-[11px] text-[#7A7062]">
                  Torso: {tempBody.longitudTorso} · Altura: {tempBody.alturaCm}cm · Zonas a destacar: {tempBody.zonasDestacar.join(', ')}
                </span>
              </div>
            </div>
            {activeDiagnosticTab === 'body' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {activeDiagnosticTab === 'body' && (
            <div className="p-5 space-y-4 bg-white border-t border-[#E2DBD0]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Longitud relativa del torso
                  </label>
                  <select
                    value={tempBody.longitudTorso}
                    onChange={(e) => setTempBody({ ...tempBody, longitudTorso: e.target.value as any })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  >
                    <option value="corto">Torso corto / piernas largas</option>
                    <option value="medio">Proporcionado</option>
                    <option value="largo">Torso largo / piernas compactas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Altura en cm
                  </label>
                  <input
                    type="number"
                    value={tempBody.alturaCm}
                    onChange={(e) => setTempBody({ ...tempBody, alturaCm: Number(e.target.value) })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => onOpenUpsell && onOpenUpsell('when_body_analysis')}
                  className="text-xs text-[#2E5E4E] font-semibold hover:underline cursor-pointer"
                >
                  Agendar análisis corporal profundo por videollamada →
                </button>
                <button
                  type="button"
                  onClick={handleSaveOptionalDiagnostics}
                  className="px-4 py-1.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                >
                  Guardar Proporciones
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tab 3: Confort y Shopping */}
        <div className="border border-[#E2DBD0] rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveDiagnosticTab(activeDiagnosticTab === 'lifestyle' ? 'none' : 'lifestyle')}
            className="w-full p-4 bg-[#FAF8F5] flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#7A4B6E]" />
              <div>
                <span className="text-xs font-bold text-[#1A1816] block">
                  3. Parámetros de Confort y Shopping
                </span>
                <span className="text-[11px] text-[#7A7062]">
                  Tacón máx: {tempComfort.alturaMaximaTaconCm}cm · Importancia confort: {tempComfort.importanciaComodidad}/5
                </span>
              </div>
            </div>
            {activeDiagnosticTab === 'lifestyle' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {activeDiagnosticTab === 'lifestyle' && (
            <div className="p-5 space-y-4 bg-white border-t border-[#E2DBD0]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Tacón máximo cómodo: {tempComfort.alturaMaximaTaconCm} cm
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={tempComfort.alturaMaximaTaconCm}
                    onChange={(e) => setTempComfort({ ...tempComfort, alturaMaximaTaconCm: Number(e.target.value) })}
                    className="w-full accent-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#736859] mb-1">
                    Ajuste preferido
                  </label>
                  <select
                    value={tempComfort.ajustePreferido}
                    onChange={(e) => setTempComfort({ ...tempComfort, ajustePreferido: e.target.value as any })}
                    className="w-full p-2 text-xs rounded-xl border border-[#D9D1C5]"
                  >
                    <option value="holgado">Holgado y fluido</option>
                    <option value="mixto">Mixto (estructurado arriba, fluido abajo)</option>
                    <option value="entallado">Entallado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveOptionalDiagnostics}
                  className="px-4 py-1.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold cursor-pointer"
                >
                  Guardar Confort
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. HISTORIAL DE SERVICIOS PREMIUM AGENDADOS                   */}
      {/* ------------------------------------------------------------- */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Tus Servicios y Asesorías con Wilma
            </h3>
            <span className="text-xs text-[#7A7062]">{bookings.length} registradas</span>
          </div>

          <div className="space-y-2">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#1A1816] block">{b.nombreServicio}</span>
                  <span className="text-[#7A7062]">
                    Fecha: {b.fechaAgendada || 'A coordinar'} · Precio: ${b.precio}
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                  b.estado === 'completado' ? 'bg-[#E8F2EC] text-[#2E5E4E]' : 'bg-[#FAF0E6] text-[#8A5B38]'
                }`}>
                  {b.estado}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. RESET FACTORY & REPETIR TEST INICIAL                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E2DBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#1A1816] block">
            Rehacer Diagnóstico o Restaurar Datos
          </span>
          <p className="text-[11px] text-[#7A7062]">
            Puedes volver a hacer el test de 3 etapas en cualquier momento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOnboarding}
            className="px-4 py-2 rounded-full border border-[#D9D1C5] text-xs font-semibold text-[#1A1816] hover:bg-white cursor-pointer"
          >
            Repetir Test (3 Etapas)
          </button>
          <button
            onClick={onResetFactoryData}
            className="px-4 py-2 rounded-full border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 cursor-pointer"
          >
            Restaurar Muestra
          </button>
        </div>
      </div>
    </div>
  );
};
