import React from 'react';
import { FullStyleDNA } from '../../types/index.ts';
import {
  Dna,
  Palette,
  User,
  Activity,
  Heart,
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Ban
} from 'lucide-react';

interface StyleDNAViewProps {
  styleDNA: FullStyleDNA;
  onOpenOnboarding: () => void;
}

export const StyleDNAView: React.FC<StyleDNAViewProps> = ({
  styleDNA,
  onOpenOnboarding
}) => {
  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
              Dossier Personal Exclusivo
            </span>
            <span className="text-xs text-[#8C8275]">·</span>
            <span className="text-xs text-[#2E5E4E] font-medium">Perfil Vivo y Dinámico</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
            Mi Style DNA
          </h1>
          <p className="text-sm text-[#665D50] mt-1 max-w-2xl">
            La radiografía completa de tu estilo. Wilma consulta este perfil para cada recomendación de outfit, análisis de compra y respuesta en el chat.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D9D1C5] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1816] transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Ajustar Diagnóstico (3 Etapas)</span>
        </button>
      </div>

      {/* PILLAR 1: STYLE DNA (Visual Percentages) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center">
              <Dna className="w-5 h-5 text-[#EADBCE]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                Pilar 1
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
                Style DNA: Esencia y Proporción Estética
              </h2>
            </div>
          </div>
          <span className="text-xs text-[#7A7062]">
            Nivel de tendencia: <strong className="text-[#1A1816] capitalize">{styleDNA.style.nivelTendencia}</strong>
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { label: 'Clásico Chic', pct: styleDNA.style.clasicoPct, color: 'bg-[#1A1816]', desc: 'Líneas limpias, atemporalidad y calidad en tejidos' },
            { label: 'Natural Relajado', pct: styleDNA.style.naturalPct, color: 'bg-[#8A5B38]', desc: 'Comodidad, fibras orgánicas y ausencia de rigidez' },
            { label: 'Elegante / Sofisticado', pct: styleDNA.style.elegantePct, color: 'bg-[#2E5E4E]', desc: 'Presencia impecable y acabados exquisitos' },
            { label: 'Creativo / Vanguardista', pct: styleDNA.style.creativoPct, color: 'bg-[#6D4C41]', desc: 'Detalles distintivos y combinaciones de autor' },
            { label: 'Romántico', pct: styleDNA.style.romanticoPct, color: 'bg-[#C86D51]', desc: 'Fluidez, caída suave y detalles femeninos' },
            { label: 'Deportivo Chic', pct: styleDNA.style.deportivoPct, color: 'bg-[#546E7A]', desc: 'Funcionalidad dinámica y libertad total' },
          ].map((cat) => (
            <div key={cat.label} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5]">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-[#1A1816]">{cat.label}</span>
                <span className="text-sm font-editorial font-bold text-[#1A1816]">{cat.pct}%</span>
              </div>
              <div className="w-full bg-[#E5DFD5] h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`${cat.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${cat.pct}%` }}
                />
              </div>
              <p className="text-[11px] text-[#7A7062] leading-tight">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Style specifics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFE9DF] text-xs">
          <div>
            <span className="font-semibold text-[#736859] block mb-1">Siluetas preferidas:</span>
            <p className="text-[#1A1816]">{styleDNA.style.siluetas?.join(', ')}</p>
          </div>
          <div>
            <span className="font-semibold text-[#736859] block mb-1">Joyería & Accesorios:</span>
            <p className="text-[#1A1816]">{styleDNA.style.accesorios?.join(', ')}</p>
          </div>
          <div>
            <span className="font-semibold text-[#736859] block mb-1">Calzado insignia:</span>
            <p className="text-[#1A1816]">{styleDNA.style.tiposZapatos?.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* PILLAR 2: COLOR DNA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFE9DF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8A5B38] text-[#FAF8F5] flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                Pilar 2
              </span>
              <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
                Color DNA: {styleDNA.color.subestacion}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#7A7062]">
                  Origen: <strong className="font-mono text-[#1A1816]">{styleDNA.color.origen || 'cuestionario_hibrido'}</strong> (Confianza: {styleDNA.color.confianza || 75}%)
                </span>
                <span className="text-[10px] text-[#8C8275]">·</span>
                <span className={`text-[10px] font-semibold ${styleDNA.color.validado_por_wilma ? 'text-[#2E5E4E]' : 'text-[#8A5B38]'}`}>
                  {styleDNA.color.validado_por_wilma ? 'Validado por Wilma ✓' : 'Pendiente de validación'}
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs text-[#2E5E4E] font-medium bg-[#E8F2EC] px-3 py-1 rounded-full">
            Metales: {styleDNA.color.metales === 'oro' ? 'Oro amarillo' : 'Plata / Mixto'}
          </span>
        </div>

        {/* Color attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
            <span className="text-[10px] font-bold uppercase text-[#8C8275] block">Temperatura</span>
            <span className="font-semibold text-[#1A1816] capitalize">{styleDNA.color.temperatura}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
            <span className="text-[10px] font-bold uppercase text-[#8C8275] block">Profundidad</span>
            <span className="font-semibold text-[#1A1816] capitalize">{styleDNA.color.profundidad}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
            <span className="text-[10px] font-bold uppercase text-[#8C8275] block">Intensidad</span>
            <span className="font-semibold text-[#1A1816] capitalize">{styleDNA.color.intensidad}</span>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D8]">
            <span className="text-[10px] font-bold uppercase text-[#8C8275] block">Contraste</span>
            <span className="font-semibold text-[#1A1816] capitalize">{styleDNA.color.contraste}</span>
          </div>
        </div>

        {/* Color families */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#736859] block mb-3">
            Tus Mejores Familias de Color
          </span>
          <div className="flex flex-wrap gap-2">
            {styleDNA.color.mejoresFamilias.map((col) => (
              <span
                key={col}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF6F0] text-[#7A4B28] border border-[#EFE5D8] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5E4E]" />
                <span>{col}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Neutrals & Avoid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EFE9DF]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2E5E4E] block mb-2">
              Neutros recomendados de base
            </span>
            <p className="text-xs text-[#5E5549]">
              {styleDNA.color.neutrosRecomendados.join(' · ')}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#964B44] block mb-2 flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-[#964B44]" />
              <span>Colores menos favorecedores</span>
            </span>
            <p className="text-xs text-[#5E5549]">
              {styleDNA.color.coloresMenosFavorecedores.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* PILLAR 3: BODY DNA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-[#EFE9DF] pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#2E5E4E] text-[#FAF8F5] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275]">
              Pilar 3
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Body DNA: Proporciones & Líneas de Corte
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#5E5549]">
          <div className="space-y-3">
            <div>
              <strong className="text-[#1A1816] block">Proporción y estructura:</strong>
              <span>{styleDNA.body.proporcionHombroCintura}</span>
            </div>
            <div>
              <strong className="text-[#1A1816] block">Líneas favorecedoras:</strong>
              <span>{styleDNA.body.lineasFavorecedoras.join(', ')}</span>
            </div>
            <div>
              <strong className="text-[#1A1816] block">Largos clave:</strong>
              <span>{styleDNA.body.largosFavorecedores.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <strong className="text-[#1A1816] block">Zonas que prefieres destacar:</strong>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {styleDNA.body.zonasDestacar.map((z) => (
                  <span key={z} className="px-2.5 py-0.5 rounded-full bg-[#E8F2EC] text-[#2E5E4E] font-medium">
                    {z}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong className="text-[#1A1816] block">Zonas a no enfatizar:</strong>
              <span>{styleDNA.body.zonasNoEnfatizar.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PILLARS 4 & 5 & 6: LIFESTYLE, COMFORT & SHOPPING DNA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lifestyle */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8A5B38]" />
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Lifestyle DNA
            </h3>
          </div>
          <div className="text-xs text-[#5E5549] space-y-2">
            <p><strong>Rutina:</strong> {styleDNA.lifestyle.rutinaSemanal}</p>
            <p><strong>Tiempo mañanas:</strong> {styleDNA.lifestyle.tiempoArreglarse}</p>
            <p><strong>Código laboral:</strong> {styleDNA.lifestyle.codigoVestimentaLaboral}</p>
          </div>
        </div>

        {/* Comfort */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C86D51]" />
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Comfort DNA
            </h3>
          </div>
          <div className="text-xs text-[#5E5549] space-y-2">
            <p><strong>Prioridad confort:</strong> {styleDNA.comfort.importanciaComodidad}/5</p>
            <p><strong>Tacón máximo:</strong> {styleDNA.comfort.alturaMaximaTaconCm} cm</p>
            <p><strong>Prendas no toleradas:</strong> {styleDNA.comfort.prendasNoUtiliza.join(', ')}</p>
          </div>
        </div>

        {/* Shopping */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#2E5E4E]" />
            <h3 className="font-editorial text-xl font-bold text-[#1A1816]">
              Shopping DNA
            </h3>
          </div>
          <div className="text-xs text-[#5E5549] space-y-2">
            <p><strong>Presupuesto:</strong> {styleDNA.shopping.presupuestoMensual}</p>
            <p><strong>Marcas habituales:</strong> {styleDNA.shopping.marcasHabituales.join(', ')}</p>
            <p><strong>Categorías de inversión:</strong> {styleDNA.shopping.categoriasInvertir.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
