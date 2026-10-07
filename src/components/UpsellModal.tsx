import React, { useState } from 'react';
import {
  PREMIUM_SERVICES_CATALOG,
  PremiumServiceInfo,
  UPSELL_TRIGGERS
} from '../lib/upsell/triggers.ts';
import { PremiumServiceName, PremiumServiceBooking } from '../types/index.ts';
import { X, Sparkles, Check, Calendar, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerKey?: string;
  initialService?: PremiumServiceName;
  onBookService: (booking: PremiumServiceBooking) => void;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({
  isOpen,
  onClose,
  triggerKey,
  initialService = 'colorimetria_profesional',
  onBookService
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<PremiumServiceName>(initialService);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-14');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTrigger = triggerKey ? UPSELL_TRIGGERS[triggerKey] : null;
  const activeService = PREMIUM_SERVICES_CATALOG[selectedServiceId];

  const handleConfirm = () => {
    const newBooking: PremiumServiceBooking = {
      id: `book_${Date.now()}`,
      userId: 'user_wilma_default',
      servicio: selectedServiceId,
      nombreServicio: activeService.nombre,
      estado: 'agendado',
      precio: activeService.precio,
      fechaAgendada: scheduledDate,
      notas: notes || 'Solicitud generada desde la plataforma Styled by Wilma',
      createdAt: new Date().toISOString()
    };

    onBookService(newBooking);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#DDD5C9] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center font-editorial text-lg font-bold">
              W
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C8275] block">
                Atelier Humano Wilma · Servicio Exclusivo
              </span>
              <h2 className="font-editorial text-xl font-bold text-[#1A1816] leading-tight">
                {currentTrigger ? 'Eleva tu diagnóstico con Wilma' : 'Servicios de Asesoría 1:1'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7062] hover:text-[#1A1816] hover:bg-[#F2ECE3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Trigger Banner if invoked from automated context */}
          {currentTrigger && (
            <div className="bg-gradient-to-r from-[#F5EFE6] to-[#FAF6EE] p-4 rounded-2xl border border-[#E3D9C9] flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#9C7A4A] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9C7A4A] block mb-0.5">
                  {currentTrigger.badge || 'Recomendación de Wilma'}
                </span>
                <p className="text-xs text-[#4A4337] font-medium leading-relaxed">
                  “{currentTrigger.message}”
                </p>
              </div>
            </div>
          )}

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#2E5E4E]/10 text-[#2E5E4E] flex items-center justify-center mx-auto">
                <Check className="w-7 h-7" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
                ¡Sesión Solicitada con Éxito!
              </h3>
              <p className="text-xs text-[#5E5549] max-w-md mx-auto leading-relaxed">
                Wilma y su equipo han recibido tu solicitud para <span className="font-semibold">{activeService.nombre}</span>. Te contactaremos por email en menos de 24 horas para coordinar la videollamada y los materiales previos.
              </p>
            </div>
          ) : (
            <>
              {/* Service Tabs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-2">
                  Selecciona el servicio humano deseado:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.values(PREMIUM_SERVICES_CATALOG) as PremiumServiceInfo[]).map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816] shadow-sm'
                            : 'bg-white text-[#4A4337] border-[#DCD5C9] hover:bg-[#F5F1EB]'
                        }`}
                      >
                        <span className="text-xs font-bold block truncate">{srv.nombre.split(' ')[0]} {srv.nombre.split(' ')[1] || ''}</span>
                        <span className={`text-[11px] block mt-1 font-semibold ${isSelected ? 'text-[#C9A88C]' : 'text-[#8A5B38]'}`}>
                          ${srv.precio}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Service Card Details */}
              <div className="bg-white rounded-2xl p-5 border border-[#E2DBD0] shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
                      {activeService.nombre}
                    </h3>
                    <p className="text-xs text-[#736859] mt-0.5">
                      {activeService.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-editorial text-2xl font-bold text-[#1A1816]">
                      ${activeService.precio}
                    </span>
                    <span className="text-[10px] text-[#8C8275] block">{activeService.duracion}</span>
                  </div>
                </div>

                <p className="text-xs text-[#5E5549] leading-relaxed border-t border-[#EFE9DF] pt-3">
                  {activeService.descripcion}
                </p>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block mb-2">
                    Qué incluye este servicio:
                  </span>
                  <ul className="space-y-1.5">
                    {activeService.entregables.map((entregable, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#4A4337]">
                        <Check className="w-3.5 h-3.5 text-[#2E5E4E] shrink-0 mt-0.5" />
                        <span>{entregable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Booking Date & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Fecha tentativa preferida
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9D1C5] bg-white text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Nota o pregunta previa para Wilma
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ej. Tengo una boda en noviembre / quiero validar paleta"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D9D1C5] bg-white text-xs text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#7A7062]">
                <ShieldCheck className="w-4 h-4 text-[#2E5E4E] shrink-0" />
                <span>Garantía de satisfacción: si la sesión no responde a tus dudas de estilo, agendamos una revisión de seguimiento sin costo adicional.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-[#E8E2D9] bg-white/70 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs font-medium text-[#736859] hover:text-[#1A1816] cursor-pointer"
            >
              Quizás más tarde
            </button>

            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] transition-all shadow-sm cursor-pointer"
            >
              <span>Confirmar Solicitud con Wilma (${activeService.precio})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
