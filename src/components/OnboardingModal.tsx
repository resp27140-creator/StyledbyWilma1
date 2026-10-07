import React, { useState } from 'react';
import { FullStyleDNA } from '../types/index.ts';
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Heart, ThumbsUp, ThumbsDown, Info, ShieldCheck } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDNA: FullStyleDNA;
  onSaveDNA: (newDNA: FullStyleDNA) => void;
  onOpenUpsell?: (triggerKey: string) => void;
}

// 20 curated stylistic outfit looks for the rapid visual reaction test
const TWENTY_STYLE_OUTFITS = [
  {
    id: 'outfit_1',
    title: 'Sastrería contemporánea camel',
    category: 'clasico',
    tags: ['clasico', 'elegante'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    desc: 'Blazer estructurado con pantalón palazzo fluido en tonos cálidos.'
  },
  {
    id: 'outfit_2',
    title: 'Lino relajado y fibras naturales',
    category: 'natural',
    tags: ['natural'],
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80',
    desc: 'Blusa vaporosa de lino crudo con pantalón amplio y calzado plano.'
  },
  {
    id: 'outfit_3',
    title: 'Vestido midi fluido y envolvente',
    category: 'romantico',
    tags: ['romantico', 'elegante'],
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    desc: 'Corte wrap cruzado con cintura marcada y caída suave.'
  },
  {
    id: 'outfit_4',
    title: 'Minimalismo arquitectónico monocromo',
    category: 'creativo',
    tags: ['creativo', 'elegante'],
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    desc: 'Capas asimétricas depuradas con accesorios escultóricos.'
  },
  {
    id: 'outfit_5',
    title: 'Gabardina atemporal y denim pulido',
    category: 'clasico',
    tags: ['clasico', 'natural'],
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    desc: 'Trench tostado icónico con camisa blanca y jeans rectos limpios.'
  },
  {
    id: 'outfit_6',
    title: 'Athleisure refinado en tonos neutros',
    category: 'deportivo',
    tags: ['deportivo', 'natural'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    desc: 'Prendas elásticas confortables combinadas con abrigo de corte recto.'
  },
  {
    id: 'outfit_7',
    title: 'Jersey de cashmere y falda recta',
    category: 'elegante',
    tags: ['elegante', 'clasico'],
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    desc: 'Punto fino de alta gama en marfil sobre falda estructurada.'
  },
  {
    id: 'outfit_8',
    title: 'Color blocking creativo de contraste',
    category: 'creativo',
    tags: ['creativo'],
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
    desc: 'Mezcla vibrante de colores opuestos con personalidad distintiva.'
  },
  {
    id: 'outfit_9',
    title: 'Camisa masculina oversize y mocasines',
    category: 'natural',
    tags: ['natural', 'clasico'],
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
    desc: 'Popelín de algodón crujiente con mangas remangadas y piel natural.'
  },
  {
    id: 'outfit_10',
    title: 'Vestido lencero de seda con blazer',
    category: 'romantico',
    tags: ['romantico', 'elegante'],
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
    desc: 'Caída de seda fluida satinada combinada con americana de noche.'
  },
  {
    id: 'outfit_11',
    title: 'Traje sastre monocolor marfil',
    category: 'elegante',
    tags: ['elegante', 'clasico'],
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
    desc: 'Total look blanco roto de dos piezas con botones en contraste.'
  },
  {
    id: 'outfit_12',
    title: 'Estampado botánico sutil en tonos tierra',
    category: 'romantico',
    tags: ['romantico', 'natural'],
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80',
    desc: 'Vestido camisero con motivos florales de trazo pictórico suave.'
  },
  {
    id: 'outfit_13',
    title: 'Chaqueta de cuero bomber y pantalón recto',
    category: 'creativo',
    tags: ['creativo', 'natural'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    desc: 'Corte moderno con textura de piel añejada y silueta limpia.'
  },
  {
    id: 'outfit_14',
    title: 'Conjunto de punto knitwear acanalado',
    category: 'natural',
    tags: ['natural', 'deportivo'],
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    desc: 'Pantalón elástico y jersey coordinado en lana merino ultra suave.'
  },
  {
    id: 'outfit_15',
    title: 'Blazer cruzado con botones dorados y jeans',
    category: 'clasico',
    tags: ['clasico'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    desc: 'El look smart casual por excelencia para transicionar día y tarde.'
  },
  {
    id: 'outfit_16',
    title: 'Sudadera premium con trench y gorra de béisbol',
    category: 'deportivo',
    tags: ['deportivo', 'clasico'],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
    desc: 'Contraste entre sastrería tradicional y elementos deportivos urbanos.'
  },
  {
    id: 'outfit_17',
    title: 'Falda plisada midi con jersey metido al frente',
    category: 'elegante',
    tags: ['elegante', 'romantico'],
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80',
    desc: 'Movimiento fluido y definición de cintura para una silueta estilizada.'
  },
  {
    id: 'outfit_18',
    title: 'Prenda protagonista con volumen dramático en mangas',
    category: 'creativo',
    tags: ['creativo', 'elegante'],
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    desc: 'Volúmenes que rompen la norma para expresar individualidad.'
  },
  {
    id: 'outfit_19',
    title: 'Pantalón cargo en tejido técnico fluido y mocasines',
    category: 'deportivo',
    tags: ['deportivo', 'creativo'],
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    desc: 'Bolsillos utilitarios reinterpretados con caída de sastrería.'
  },
  {
    id: 'outfit_20',
    title: 'Abrigo envolvente bata de lana con cinturón',
    category: 'clasico',
    tags: ['clasico', 'elegante'],
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80',
    desc: 'Prenda insignia de invierno que unifica cualquier combinación interior.'
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentDNA,
  onSaveDNA,
  onOpenUpsell
}) => {
  // STAGES: 1 (About You), 2 (Your Style Reactions), 3 (Your Initial Results)
  const [stage, setStage] = useState<number>(1);

  // ETAPA 1 STATE
  const [name, setName] = useState<string>(currentDNA.user.displayName || 'Elena Valenzuela');
  const [ageRange, setAgeRange] = useState<string>(currentDNA.user.ageRange || '30-35');
  const [workMode, setWorkMode] = useState<'presencial' | 'remoto' | 'hibrido' | 'independiente' | 'otro'>(
    currentDNA.user.workMode || 'hibrido'
  );
  const [frequentEvents, setFrequentEvents] = useState<string[]>([
    'Reuniones de trabajo / clientes',
    'Cenas y salidas informales'
  ]);
  const [wardrobeChallenges, setWardrobeChallenges] = useState<string[]>([
    'Siento que no tengo qué ponerme aunque el armario esté lleno'
  ]);

  // ETAPA 2 STATE: Reactions to 20 images ('use' | 'maybe' | 'never')
  const [reactions, setReactions] = useState<Record<string, 'use' | 'maybe' | 'never'>>(() => {
    const initial: Record<string, 'use' | 'maybe' | 'never'> = {};
    TWENTY_STYLE_OUTFITS.forEach((o, i) => {
      initial[o.id] = i % 3 === 0 ? 'use' : i % 3 === 1 ? 'maybe' : 'never';
    });
    return initial;
  });

  const [activeReactionIndex, setActiveReactionIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentOutfit = TWENTY_STYLE_OUTFITS[activeReactionIndex];

  // Helper toggle for multi-select
  const toggleSelection = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Compute calculated style percentages from 20 reactions
  const computeStylePercentages = () => {
    const scores: Record<string, number> = {
      clasico: 0,
      natural: 0,
      romantico: 0,
      creativo: 0,
      deportivo: 0,
      elegante: 0
    };

    const weights = { use: 1.0, maybe: 0.35, never: 0 };

    TWENTY_STYLE_OUTFITS.forEach((item) => {
      const r = reactions[item.id] || 'maybe';
      const w = weights[r];
      item.tags.forEach((tag) => {
        if (scores[tag] !== undefined) {
          scores[tag] += w;
        }
      });
    });

    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    const pcts: Record<string, number> = {};
    if (sum === 0) {
      pcts.clasico = 45;
      pcts.natural = 30;
      pcts.elegante = 15;
      pcts.creativo = 10;
      pcts.romantico = 0;
      pcts.deportivo = 0;
    } else {
      for (const [k, v] of Object.entries(scores)) {
        pcts[k] = Math.round((v / sum) * 100);
      }
    }
    return pcts;
  };

  const handleFinish = () => {
    const pcts = computeStylePercentages();

    const updatedDNA: FullStyleDNA = {
      ...currentDNA,
      user: {
        ...currentDNA.user,
        displayName: name,
        ageRange,
        workMode,
        onboardingCompleted: true
      },
      lifestyle: {
        ...currentDNA.lifestyle,
        eventosFrecuentes: frequentEvents,
        necesidadesVestuario: wardrobeChallenges
      },
      style: {
        ...currentDNA.style,
        clasicoPct: pcts.clasico || 40,
        naturalPct: pcts.natural || 30,
        elegantePct: pcts.elegante || 15,
        creativoPct: pcts.creativo || 10,
        romanticoPct: pcts.romantico || 5,
        deportivoPct: pcts.deportivo || 0,
        testsCompletados: (currentDNA.style.testsCompletados || 0) + 1
      },
      color: {
        ...currentDNA.color,
        origen: 'cuestionario_hibrido',
        confianza: 75,
        validado_por_wilma: false
      }
    };

    onSaveDNA(updatedDNA);
    onClose();
  };

  const pcts = computeStylePercentages();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#DDD5C9] shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-white/80">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C8275] block">
              Onboarding Simplificado · Etapa {stage} de 3
            </span>
            <h2 className="font-editorial text-xl sm:text-2xl text-[#1A1816] font-bold">
              {stage === 1 && '1. Cuéntame sobre ti'}
              {stage === 2 && '2. Tu estilo en imágenes (20 looks)'}
              {stage === 3 && '3. Tus primeros resultados'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7062] hover:text-[#1A1816] hover:bg-[#F2ECE3] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#E8E2D9] h-1.5 shrink-0">
          <div
            className="bg-[#1A1816] h-1.5 transition-all duration-300"
            style={{ width: `${(stage / 3) * 100}%` }}
          />
        </div>

        {/* Stage Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* ======================================================== */}
          {/* ETAPA 1 — Cuéntame sobre ti (90 seg)                     */}
          {/* ======================================================== */}
          {stage === 1 && (
            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-[#5E5549] leading-relaxed">
                Queremos que vestirte por la mañana sea intuitivo, rápido y auténtico. Comencemos con lo esencial de tu día a día:
              </p>

              {/* Nombre y Edad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1.5">
                    ¿Cómo te llamas?
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-white text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1.5">
                    Rango de edad
                  </label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9D1C5] bg-white text-sm text-[#1A1816] focus:outline-none focus:ring-2 focus:ring-[#1A1816]"
                  >
                    <option value="20-25">20 - 25 años</option>
                    <option value="25-30">25 - 30 años</option>
                    <option value="30-35">30 - 35 años</option>
                    <option value="35-45">35 - 45 años</option>
                    <option value="45-55">45 - 55 años</option>
                    <option value="55+">55+ años</option>
                  </select>
                </div>
              </div>

              {/* Modalidad de trabajo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1.5">
                  ¿Cómo trabajas actualmente?
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'presencial', label: 'Presencial', desc: 'Oficina / día a día' },
                    { id: 'remoto', label: '100% Remoto', desc: 'Home office' },
                    { id: 'hibrido', label: 'Híbrido', desc: 'Oficina + remoto' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setWorkMode(mode.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        workMode === mode.id
                          ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816]'
                          : 'bg-white text-[#4A4337] border-[#DCD5C9] hover:bg-[#F5F1EB]'
                      }`}
                    >
                      <span className="text-xs font-bold block">{mode.label}</span>
                      <span className={`text-[10px] block ${workMode === mode.id ? 'text-[#D0C7B8]' : 'text-[#7A7062]'}`}>
                        {mode.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eventos frecuentes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1.5">
                  ¿Qué eventos tienes frecuentemente? (Selecciona los habituales)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Reuniones de trabajo / clientes',
                    'Cenas y salidas con amigas',
                    'Eventos formales / bodas / galas',
                    'Días casuales en familia / paseos',
                    'Viajes de trabajo o escapadas',
                    'Networking profesional'
                  ].map((ev) => {
                    const isSelected = frequentEvents.includes(ev);
                    return (
                      <button
                        key={ev}
                        type="button"
                        onClick={() => toggleSelection(frequentEvents, setFrequentEvents, ev)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF0E6] text-[#8A5B38] border-[#EADBCE] font-medium'
                            : 'bg-white text-[#5E5549] border-[#DCD5C9] hover:bg-[#F5F1EB]'
                        }`}
                      >
                        <span className="truncate pr-1">{ev}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mayor desafío */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736859] mb-1.5">
                  ¿Cuál es tu mayor desafío al vestirte?
                </label>
                <div className="space-y-1.5">
                  {[
                    'Siento que no tengo qué ponerme aunque el armario esté lleno',
                    'Siempre termino comprando prendas similares y me aburro',
                    'Me cuesta combinar colores con confianza',
                    'Mi cuerpo o estilo de vida cambió y mi ropa no refleja quién soy',
                    'Tardo demasiado tiempo decidiendo cada mañana'
                  ].map((chal) => {
                    const isSelected = wardrobeChallenges.includes(chal);
                    return (
                      <button
                        key={chal}
                        type="button"
                        onClick={() => toggleSelection(wardrobeChallenges, setWardrobeChallenges, chal)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#1A1816] text-[#FAF8F5] border-[#1A1816]'
                            : 'bg-white text-[#5E5549] border-[#DCD5C9] hover:bg-[#F5F1EB]'
                        }`}
                      >
                        <span>{chal}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 2 — Tu estilo en imágenes (2 min - 20 fotos)       */}
          {/* ======================================================== */}
          {stage === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#7A7062]">
                <span>Outfit {activeReactionIndex + 1} de {TWENTY_STYLE_OUTFITS.length}</span>
                <span className="font-semibold text-[#1A1816]">
                  {Object.values(reactions).length} reacciones guardadas
                </span>
              </div>

              {/* Progress dots bar */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                {TWENTY_STYLE_OUTFITS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveReactionIndex(i)}
                    className={`h-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      i === activeReactionIndex
                        ? 'w-6 bg-[#1A1816]'
                        : reactions[TWENTY_STYLE_OUTFITS[i].id] === 'use'
                        ? 'w-3 bg-[#2E5E4E]'
                        : reactions[TWENTY_STYLE_OUTFITS[i].id] === 'never'
                        ? 'w-3 bg-[#8C3A33]'
                        : 'w-2 bg-[#D9D1C5]'
                    }`}
                  />
                ))}
              </div>

              {/* Main Outfit Spotlight Card */}
              <div className="bg-white rounded-3xl border border-[#E2DBD0] overflow-hidden shadow-sm flex flex-col sm:flex-row">
                <div className="relative sm:w-1/2 h-64 sm:h-80 overflow-hidden bg-neutral-100">
                  <img
                    src={currentOutfit.image}
                    alt={currentOutfit.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] uppercase font-semibold tracking-wider">
                    {currentOutfit.category}
                  </div>
                </div>

                <div className="sm:w-1/2 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block mb-1">
                      Reacción Intuitiva
                    </span>
                    <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1816]">
                      {currentOutfit.title}
                    </h3>
                    <p className="text-xs text-[#665D50] mt-2 leading-relaxed">
                      {currentOutfit.desc}
                    </p>
                  </div>

                  {/* 3 Clear Reaction Buttons */}
                  <div className="space-y-2 pt-2 border-t border-[#EFE9DF]">
                    <div className="text-[11px] font-medium text-[#7A7062] mb-1">
                      ¿Te pondrías este conjunto para una ocasión habitual?
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReactions({ ...reactions, [currentOutfit.id]: 'use' });
                          if (activeReactionIndex < TWENTY_STYLE_OUTFITS.length - 1) {
                            setActiveReactionIndex(activeReactionIndex + 1);
                          }
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          reactions[currentOutfit.id] === 'use'
                            ? 'bg-[#2E5E4E] text-white border-[#2E5E4E] shadow-sm'
                            : 'bg-white text-[#2E5E4E] border-[#D2E2D9] hover:bg-[#F2F8F5]'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Lo usaría</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReactions({ ...reactions, [currentOutfit.id]: 'maybe' });
                          if (activeReactionIndex < TWENTY_STYLE_OUTFITS.length - 1) {
                            setActiveReactionIndex(activeReactionIndex + 1);
                          }
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          reactions[currentOutfit.id] === 'maybe'
                            ? 'bg-[#9C7A4A] text-white border-[#9C7A4A] shadow-sm'
                            : 'bg-white text-[#9C7A4A] border-[#E8DEC8] hover:bg-[#FAF6ED]'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Tal vez</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReactions({ ...reactions, [currentOutfit.id]: 'never' });
                          if (activeReactionIndex < TWENTY_STYLE_OUTFITS.length - 1) {
                            setActiveReactionIndex(activeReactionIndex + 1);
                          }
                        }}
                        className={`py-2.5 px-2 rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          reactions[currentOutfit.id] === 'never'
                            ? 'bg-[#8C3A33] text-white border-[#8C3A33] shadow-sm'
                            : 'bg-white text-[#8C3A33] border-[#E8D2CF] hover:bg-[#FAF3F2]'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>Nunca</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-[#8C8275]">
                      <button
                        type="button"
                        disabled={activeReactionIndex === 0}
                        onClick={() => setActiveReactionIndex(activeReactionIndex - 1)}
                        className="hover:underline disabled:opacity-30 cursor-pointer"
                      >
                        ← Anterior
                      </button>
                      <button
                        type="button"
                        disabled={activeReactionIndex === TWENTY_STYLE_OUTFITS.length - 1}
                        onClick={() => setActiveReactionIndex(activeReactionIndex + 1)}
                        className="hover:underline disabled:opacity-30 cursor-pointer"
                      >
                        Siguiente →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ETAPA 3 — Tus primeros resultados                        */}
          {/* ======================================================== */}
          {stage === 3 && (
            <div className="space-y-6">
              {/* Style DNA Visual Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block">
                      Resultado Inmediato
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
                      Tu Style DNA Sintetizado
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1A1816] text-[#FAF8F5] flex items-center justify-center font-editorial text-lg font-bold">
                    DNA
                  </div>
                </div>

                <p className="text-xs text-[#665D50] leading-relaxed">
                  Basado en tus 20 reacciones visuales y tu estilo de vida {workMode}, este es tu perfil ponderado:
                </p>

                {/* Percentage Bars */}
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Clásico Chic', pct: pcts.clasico || 45, color: 'bg-[#1A1816]' },
                    { label: 'Natural Relajado', pct: pcts.natural || 30, color: 'bg-[#8A5B38]' },
                    { label: 'Elegante Sofisticado', pct: pcts.elegante || 15, color: 'bg-[#2E5E4E]' },
                    { label: 'Creativo Vanguardista', pct: pcts.creativo || 10, color: 'bg-[#7A4B6E]' },
                    { label: 'Romántico Femenino', pct: pcts.romantico || 0, color: 'bg-[#9C7A4A]' }
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#1A1816]">{cat.label}</span>
                        <span className="text-[#736859]">{cat.pct}%</span>
                      </div>
                      <div className="w-full bg-[#EFE9DF] h-2 rounded-full overflow-hidden">
                        <div
                          className={`${cat.color} h-full rounded-full transition-all duration-700`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Recomendaciones Iniciales */}
              <div className="bg-[#FAF8F5] border border-[#E2DBD0] rounded-3xl p-5 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8275] block">
                  3 Recomendaciones Inmediatas para Ti
                </span>

                <div className="space-y-2.5">
                  <div className="p-3 bg-white rounded-2xl border border-[#E8E2D8] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-xs text-[#4A4337] leading-relaxed">
                      <strong className="text-[#1A1816]">Ancla tus looks en sastrería fluida:</strong> Invierte en blazers y pantalones de tiro alto con buena caída que respeten tu necesidad de confort.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#E8E2D8] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#8A5B38] text-[#FAF8F5] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="text-xs text-[#4A4337] leading-relaxed">
                      <strong className="text-[#1A1816]">Suaviza contrastes duros cerca del rostro:</strong> Prefiere marfil, beige arena y camel tostado sobre negro o blanco nuclear óptico.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-[#E8E2D8] flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#2E5E4E] text-[#FAF8F5] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-xs text-[#4A4337] leading-relaxed">
                      <strong className="text-[#1A1816]">Accesorios como elevador exprés:</strong> Mocasines de piel con herraje dorado y cinturones coñac multiplican combinaciones simples en 30 segundos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sutil Upsell Trigger */}
              <div className="bg-gradient-to-r from-[#FAF0E6] to-[#FAF6EE] p-4 rounded-2xl border border-[#EADBCE] flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#9C7A4A] block">
                    Servicio Humano Opcional
                  </span>
                  <p className="text-xs text-[#4A4337]">
                    Tu Style DNA está listo. ¿Quieres que Wilma lo revise personalmente para afinar tu colorimetría?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenUpsell && onOpenUpsell('after_onboarding')}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] transition-all shrink-0 cursor-pointer"
                >
                  Agendar Style Review
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#E8E2D9] bg-white/80 flex items-center justify-between shrink-0">
          {stage > 1 ? (
            <button
              onClick={() => setStage(stage - 1)}
              className="flex items-center gap-1 text-xs font-medium text-[#736859] hover:text-[#1A1816] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs font-medium text-[#736859] hover:text-[#1A1816] cursor-pointer"
            >
              Saltar por ahora
            </button>
          )}

          {stage < 3 ? (
            <button
              onClick={() => setStage(stage + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] transition-all shadow-sm cursor-pointer"
            >
              <span>{stage === 1 ? 'Siguiente: Tu estilo en imágenes' : 'Ver mis resultados'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full text-xs font-semibold bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C9A88C]" />
              <span>Comienza a usar tu stylist</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
