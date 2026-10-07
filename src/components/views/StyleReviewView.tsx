import React, { useState } from 'react';
import { StyleReviewRequest, FullStyleDNA, PremiumServiceBooking, PremiumServiceName } from '../../types/index.ts';
import { PREMIUM_SERVICES_CATALOG, PremiumServiceInfo } from '../../lib/upsell/triggers.ts';
import {
  Sparkles,
  Crown,
  CheckCircle2,
  Calendar,
  Send,
  UserCheck,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface StyleReviewViewProps {
  styleDNA: FullStyleDNA;
  reviews: StyleReviewRequest[];
  onAddReview: (review: StyleReviewRequest) => void;
  onBookService?: (booking: PremiumServiceBooking) => void;
}

export const StyleReviewView: React.FC<StyleReviewViewProps> = ({
  styleDNA,
  reviews,
  onAddReview,
  onBookService
}) => {
  const [selectedService, setSelectedService] = useState<PremiumServiceName>('style_review_completo');
  const [userNotes, setUserNotes] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-10-15');
  const [submitted, setSubmitted] = useState(false);

  const activeServiceInfo = PREMIUM_SERVICES_CATALOG[selectedService];

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const newRev: StyleReviewRequest = {
      id: `rev_${Date.now()}`,
      tipo: selectedService === 'colorimetria_profesional' ? 'colorimetria' : 'completa',
      estado: 'solicitada',
      fecha: new Date().toISOString().split('T')[0],
      notasUsuario: userNotes || `Solicitud para ${activeServiceInfo.nombre}`,
      precio: activeServiceInfo.precio,
      wilmaNotas: 'Tu solicitud ha sido recibida por el equipo de Wilma. Analizaremos tu historial de fotos y Style DNA para coordinar tu entrega y sesión en 48-72 horas laborales.',
      wilmaRecomendaciones: [
        'Mantén actualizado tu armario digital con fotos recientes para que la auditoría sea lo más precisa posible.'
      ]
    };

    onAddReview(newRev);

    if (onBookService) {
      onBookService({
        id: `book_${Date.now()}`,
        userId: styleDNA.user.id,
        servicio: selectedService,
        nombreServicio: activeServiceInfo.nombre,
        estado: 'agendado',
        precio: activeServiceInfo.precio,
        fechaAgendada: preferredDate,
        notas: userNotes,
        createdAt: new Date().toISOString()
      });
    }

    setSubmitted(true);
    setUserNotes('');
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1A1816] to-[#2B2622] rounded-3xl p-6 sm:p-10 text-[#FAF8F5] relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#C9A88C]" />
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D4C3B3]">
              Atelier Wilma · Asesoría Humana de Alta Costura
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
            Servicios Premium con Wilma
          </h1>
          <p className="text-sm text-[#D4C3B3] leading-relaxed">
            La app resuelve tus combinaciones diarias con IA. Cuando necesitas profundidad —validar tu colorimetría en persona, auditar tu silueta o diseñar un armario cápsula desde cero— el ojo humano de Wilma entra en acción.
          </p>
        </div>
      </div>

      {/* Catálogo de los 5 Servicios Humanos */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275] block mb-1">
            Catálogo Exclusivo
          </span>
          <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
            Selecciona tu Servicio de Asesoría
          </h2>
        </div>

        {submitted ? (
          <div className="p-6 bg-[#E8F2EC] rounded-2xl border border-[#C2DEC8] text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#2E5E4E] mx-auto" />
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              ¡Solicitud de Servicio Registrada!
            </h3>
            <p className="text-xs text-[#4A4337] max-w-md mx-auto">
              Wilma ha recibido tus notas y tu Style DNA. Te notificaremos por correo electrónico para confirmar la fecha tentativa y la entrega.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 text-xs font-semibold text-[#2E5E4E] hover:underline block mx-auto cursor-pointer"
            >
              Consultar otro servicio
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequest} className="space-y-6">
            {/* 5 Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.values(PREMIUM_SERVICES_CATALOG) as PremiumServiceInfo[]).map((srv) => {
                const isSelected = selectedService === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1A1816] bg-[#FAF8F5] shadow-xs ring-1 ring-[#1A1816]'
                        : 'border-[#E2DBD0] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-[#1A1816] line-clamp-1">{srv.nombre}</span>
                        <span className="font-editorial text-lg font-bold text-[#8A5B38]">${srv.precio}</span>
                      </div>
                      <p className="text-[11px] text-[#665D50] leading-relaxed line-clamp-2">
                        {srv.tagline}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-[#1A1816]">
                      <span>{isSelected ? '✓ Seleccionado' : 'Elegir'}</span>
                      <span className="text-[10px] text-[#8C8275]">{srv.duracion}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Service Deep Dive Details */}
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E5DFD5] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
                  {activeServiceInfo.nombre} — ${activeServiceInfo.precio}
                </h3>
                {activeServiceInfo.incluidoEnPlan && (
                  <span className="text-[10px] uppercase font-bold text-[#2E5E4E] bg-[#E8F2EC] px-2.5 py-0.5 rounded-full">
                    {activeServiceInfo.incluidoEnPlan}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5E5549] leading-relaxed">
                {activeServiceInfo.descripcion}
              </p>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C8275] block mb-1.5">
                  Entregables incluidos:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeServiceInfo.entregables.map((ent, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#4A4337]">
                      <Check className="w-3.5 h-3.5 text-[#2E5E4E] shrink-0 mt-0.5" />
                      <span>{ent}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form Fields: Date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                  Fecha tentativa preferida
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D1C5] bg-white text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                  Notas o necesidades específicas
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="ej. Boda de mi hermana en noviembre / validar mi paleta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D1C5] bg-white text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A] transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Solicitar Asesoría con Wilma (${activeServiceInfo.precio})</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Historial de Informes */}
      <div className="space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
          Historial de Informes y Asesorías
        </h2>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E2DBD0] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE9DF] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#8A5B38]">
                      Revisión {rev.tipo}
                    </span>
                    <span className="text-xs text-[#8C8275]">·</span>
                    <span className="text-xs text-[#7A7062] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{rev.fecha}</span>
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#1A1816] mt-0.5">
                    Informe de Wilma: Diagnóstico & Plan de Acción
                  </h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                  rev.estado === 'completada'
                    ? 'bg-[#E8F2EC] text-[#2E5E4E]'
                    : 'bg-[#FFF3D6] text-[#8C6D1F]'
                }`}>
                  {rev.estado === 'completada' ? 'Completada por Wilma' : 'En proceso de análisis'}
                </span>
              </div>

              {rev.wilmaNotas && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block">
                    Notas de Wilma:
                  </span>
                  <p className="text-sm text-[#5E5549] leading-relaxed bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE3D8]">
                    {rev.wilmaNotas}
                  </p>
                </div>
              )}

              {rev.wilmaRecomendaciones && rev.wilmaRecomendaciones.length > 0 && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2E5E4E] block mb-2">
                    Recomendaciones directas de la estilista:
                  </span>
                  <ul className="space-y-2">
                    {rev.wilmaRecomendaciones.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#4A4337]">
                        <CheckCircle2 className="w-4 h-4 text-[#2E5E4E] shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
