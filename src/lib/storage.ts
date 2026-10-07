import {
  FullStyleDNA,
  WardrobeItem,
  OutfitCombination,
  ChatMessage,
  StyleReviewRequest
} from '../types/index.ts';

export const DEFAULT_STYLE_DNA: FullStyleDNA = {
  user: {
    id: 'user_wilma_default',
    email: 'elena.valenzuela@example.com',
    displayName: 'Elena Valenzuela',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    provider: 'google',
    ageRange: '30-35',
    profession: 'Directora de Estrategia Creativa',
    workMode: 'hibrido',
    climate: 'templado',
    onboardingCompleted: true,
    subscriptionPlan: 'premium',
    createdAt: '2026-09-15T10:00:00.000Z'
  },
  color: {
    temperatura: 'cálida',
    profundidad: 'media',
    intensidad: 'suave',
    contraste: 'medio',
    estacionPrincipal: 'Otoño',
    subestacion: 'Otoño Suave (Soft Autumn)',
    mejoresFamilias: ['Terracota suave', 'Verde salvia', 'Mostaza cálido', 'Azul petróleo', 'Caramelo', 'Beige arena'],
    neutrosRecomendados: ['Blanco roto / Marfil', 'Camel tostado', 'Gris visón', 'Verde oliva profundo'],
    metales: 'oro',
    coloresMenosFavorecedores: ['Negro puro cerca del rostro', 'Fucsia frío fluorescente', 'Blanco nuclear óptico'],
    origen: 'cuestionario_hibrido',
    confianza: 82,
    validado_por_wilma: false,
    analisisCompletado: true
  },
  body: {
    proporcionHombroCintura: 'Hombros alineados con caderas, cintura definida',
    proporcionCinturaCadera: 'Curva suave y equilibrada (Reloj de arena suave)',
    longitudTorso: 'medio',
    longitudPiernas: 'media',
    alturaCm: 168,
    distribucionVolumen: 'Proporciones simétricas con realce natural en cintura',
    lineasFavorecedoras: ['Líneas fluidas con estructura en hombros', 'Cortes a la cintura alta', 'Escotes en V moderados y cruzados', 'Pantalones rectos y palazzo de caída limpia'],
    largosFavorecedores: ['Largo midi en vestidos y faldas', 'Pantalones al ras del empeine', 'Blazers a la mitad del muslo'],
    zonasDestacar: ['Cintura', 'Clavículas', 'Muñecas y tobillos'],
    zonasNoEnfatizar: ['Caderas con cortes rígidos horizontales'],
    analisisCompletado: true
  },
  style: {
    clasicoPct: 45,
    naturalPct: 30,
    elegantePct: 15,
    creativoPct: 10,
    romanticoPct: 0,
    deportivoPct: 0,
    siluetas: ['Estructurada pero relajada', 'Fluida con definición', 'Sastrería contemporánea'],
    estampados: ['Monocromático', 'Lino sutil', 'Rayas diplomáticas discretas'],
    estructura: ['Hombros suaves', 'Prendas con caída de calidad'],
    ajuste: ['Semi-entallado', 'Cintura marcada'],
    accesorios: ['Joyería dorada minimalista', 'Bolsos de piel estructurada', 'Cinturones de piel en tonos coñac'],
    tiposZapatos: ['Mocasines de piel', 'Botines kitten heel', 'Sneakers minimalistas de piel blanca'],
    nivelTendencia: 'medio',
    testsCompletados: 1
  },
  lifestyle: {
    rutinaSemanal: '3 días oficina corporativa / clientes, 2 días home-office estratégico, fines de semana culturales y cenas.',
    actividadesFrecuentes: ['Reuniones con directivos', 'Viajes cortos de negocios', 'Cenas casuales con amigos', 'Visitas a galerías y descanso'],
    eventosFrecuentes: ['Presentaciones ejecutivas', 'Brunch de networking', 'Cenas formales'],
    vidaSocial: 'moderada',
    tiempoArreglarse: '15min',
    necesidadesVestuario: ['Outfits versátiles día-a-noche', 'Tejidos que no se arruguen con facilidad', 'Prendas sofisticadas pero con libertad de movimiento'],
    codigoVestimentaLaboral: 'Smart Casual / Elevado'
  },
  comfort: {
    importanciaComodidad: 4,
    ajustePreferido: 'mixto',
    alturaMaximaTaconCm: 6,
    necesidadMovilidad: 'Alta (camina entre reuniones y jornadas largas)',
    prendasNoUtiliza: ['Minifaldas muy ajustadas', 'Tacones de aguja de más de 7cm', 'Telas sintéticas que no transpiran'],
    nivelExposicionCorporal: 'medio',
    preferenciasPracticas: ['Bolsillos funcionales en pantalones y chaquetas', 'Prendas fáciles de combinar entre sí']
  },
  shopping: {
    presupuestoMensual: '250€ - 400€',
    frecuenciaCompra: 'mensual',
    marcasHabituales: ['Massimo Dutti', 'COS', 'Arket', 'Sezane', '& Other Stories'],
    tiendasHabituales: ['Boutiques locales', 'Online seleccionado'],
    categoriasInvertir: ['Blazers de lana', 'Abrigos de corte clásico', 'Bolsos de piel atemporales', 'Zapatos de calidad'],
    prioridadesActuales: ['Optimizar armario cápsula de entretiempo', 'Evitar compras impulsivas de prendas que no combinan'],
    problemasFrecuentes: ['Comprar prendas bonitas pero aisladas que luego no sé cómo ponerme']
  }
};

export const DEFAULT_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'item_1',
    userId: 'user_wilma_default',
    nombre: 'Blazer Sastrería Crepé Camel',
    categoria: 'outerwear',
    subcategoria: 'Blazer estructurado',
    colorPrincipal: 'Camel cálido',
    colorSecundario: 'Toffee',
    silueta: 'Recta ligeramente entallada',
    materialAparente: 'Lana fría / Crepé',
    nivelFormalidad: 4,
    estilo: 'Clásico Elevado',
    temporada: 'todo',
    imagenUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 14,
    ultimaVezUsada: '2026-10-02',
    notas: 'Prenda insignia para presentaciones. Caída impecable.'
  },
  {
    id: 'item_2',
    userId: 'user_wilma_default',
    nombre: 'Camisa Seda Marfil Cuello Fluido',
    categoria: 'top',
    subcategoria: 'Camisa de seda',
    colorPrincipal: 'Blanco marfil / roto',
    silueta: 'Caída relajada',
    materialAparente: 'Seda morera',
    nivelFormalidad: 4,
    estilo: 'Elegante / Clásico',
    temporada: 'todo',
    imagenUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 18,
    ultimaVezUsada: '2026-10-04',
    notas: 'Suaviza el rostro con su brillo natural. Ilumina su colorimetría de Otoño.'
  },
  {
    id: 'item_3',
    userId: 'user_wilma_default',
    nombre: 'Pantalón Tiro Alto Pinzas Beige Arena',
    categoria: 'bottom',
    subcategoria: 'Pantalón sastre palazzo',
    colorPrincipal: 'Beige arena',
    silueta: 'Wide leg con pinzas frontales',
    materialAparente: 'Mezcla viscosa y lino denso',
    nivelFormalidad: 3,
    estilo: 'Natural Chic',
    temporada: 'primavera',
    imagenUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 12,
    ultimaVezUsada: '2026-09-28',
    notas: 'Alarga las piernas y define la cintura sin apretar.'
  },
  {
    id: 'item_4',
    userId: 'user_wilma_default',
    nombre: 'Jersey Cuello Cisne Cashmere Terracota',
    categoria: 'top',
    subcategoria: 'Knitwear fino',
    colorPrincipal: 'Terracota suave',
    silueta: 'Entallado suave',
    materialAparente: 'Cashmere fino',
    nivelFormalidad: 3,
    estilo: 'Clásico Cálido',
    temporada: 'otoño',
    imagenUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 9,
    ultimaVezUsada: '2026-10-05',
    notas: 'Potencia el iris y el tono de piel cálido al 100%.'
  },
  {
    id: 'item_5',
    userId: 'user_wilma_default',
    nombre: 'Vestido Midi Cruzado Verde Oliva',
    categoria: 'dress',
    subcategoria: 'Vestido wrap midi',
    colorPrincipal: 'Verde oliva cálido',
    silueta: 'Cruzado wrap con lazo lateral',
    materialAparente: 'Lyocell fluido',
    nivelFormalidad: 4,
    estilo: 'Femenino Sofisticado',
    temporada: 'todo',
    imagenUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 7,
    ultimaVezUsada: '2026-09-20',
    notas: 'Escote en pico perfecto para su proporción de hombros.'
  },
  {
    id: 'item_6',
    userId: 'user_wilma_default',
    nombre: 'Trench Coat Clásico Tostado',
    categoria: 'outerwear',
    subcategoria: 'Gabardina doble abotonadura',
    colorPrincipal: 'Miel tostada',
    silueta: 'Midi con cinturón',
    materialAparente: 'Algodón gabardina impermeable',
    nivelFormalidad: 4,
    estilo: 'Clásico Atemporal',
    temporada: 'otoño',
    imagenUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 22,
    ultimaVezUsada: '2026-10-03',
    notas: 'La prenda exterior más versátil del armario.'
  },
  {
    id: 'item_7',
    userId: 'user_wilma_default',
    nombre: 'Mocasines Piel Coñac con Detalle Dorado',
    categoria: 'shoes',
    subcategoria: 'Loafers planos',
    colorPrincipal: 'Cuero coñac',
    colorSecundario: 'Herraje oro satinado',
    silueta: 'Puntera almendrada',
    materialAparente: 'Piel de becerro',
    nivelFormalidad: 3,
    estilo: 'Clásico Confort',
    temporada: 'todo',
    imagenUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 31,
    ultimaVezUsada: '2026-10-06',
    notas: 'Comodidad absoluta para caminar 10.000 pasos en días de oficina.'
  },
  {
    id: 'item_8',
    userId: 'user_wilma_default',
    nombre: 'Jeans Rectos Tiro Alto Azul Marino Oscuro',
    categoria: 'bottom',
    subcategoria: 'Denim recto limpio',
    colorPrincipal: 'Azul índigo oscuro / navy',
    silueta: 'Corte recto sin rotos',
    materialAparente: 'Denim 99% algodón 1% elastano',
    nivelFormalidad: 2,
    estilo: 'Natural Elevado',
    temporada: 'todo',
    imagenUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    vecesUsada: 25,
    ultimaVezUsada: '2026-10-01',
    notas: 'El lavado oscuro lo hace apto para viernes casuales de trabajo.'
  }
];

export const DEFAULT_SAVED_OUTFITS: OutfitCombination[] = [
  {
    id: 'outfit_1',
    nombre: 'Reunión Directiva Smart Chic',
    ocasion: 'Comité de dirección / Presentación clave',
    itemIds: ['item_1', 'item_2', 'item_3', 'item_7'],
    puntuacionIa: 98,
    notas: 'Armonía cromática perfecta en tonalidades arena, marfil y camel cálido. La seda aporta suavidad mientras el blazer estructura el torso.',
    guardado: true,
    createdAt: '2026-10-01T12:00:00.000Z'
  },
  {
    id: 'outfit_2',
    nombre: 'Afterwork Otoñal Sofisticado',
    ocasion: 'Cena con colegas y clientes en restaurante boutique',
    itemIds: ['item_6', 'item_4', 'item_8', 'item_7'],
    puntuacionIa: 94,
    notas: 'El jersey terracota resalta su mirada bajo la luz cálida de la cena. El trench abierto genera líneas verticales favorecedoras.',
    guardado: true,
    createdAt: '2026-10-03T18:30:00.000Z'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    role: 'assistant',
    contenido: '¡Hola Elena! ✨ Qué alegría verte de nuevo. Conozco a fondo tu Style DNA (Otoño Suave, proporciones equilibradas y preferencia por piezas clásicas fluidas). ¿Tienes algún compromiso especial hoy, o estás pensando en una prenda nueva para incorporar a tu armario?',
    createdAt: '2026-10-06T09:00:00.000Z',
    suggestedActions: [
      '¿Qué me pongo hoy para una cena casual?',
      'Revisar si este color verde me favorece',
      '¿Qué prenda falta en mi armario cápsula?'
    ]
  }
];

const STORAGE_KEY_DNA = 'styled_by_wilma_dna';
const STORAGE_KEY_WARDROBE = 'styled_by_wilma_wardrobe';
const STORAGE_KEY_OUTFITS = 'styled_by_wilma_outfits';
const STORAGE_KEY_CHAT = 'styled_by_wilma_chat';
const STORAGE_KEY_REVIEWS = 'styled_by_wilma_reviews';

export function getStoredStyleDNA(): FullStyleDNA {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DNA);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading DNA from localStorage', e);
  }
  return DEFAULT_STYLE_DNA;
}

export function saveStoredStyleDNA(dna: FullStyleDNA): void {
  try {
    localStorage.setItem(STORAGE_KEY_DNA, JSON.stringify(dna));
  } catch (e) {
    console.error('Error saving DNA to localStorage', e);
  }
}

export function getStoredWardrobe(): WardrobeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WARDROBE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading wardrobe', e);
  }
  return DEFAULT_WARDROBE_ITEMS;
}

export function saveStoredWardrobe(items: WardrobeItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WARDROBE, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving wardrobe', e);
  }
}

export function getStoredOutfits(): OutfitCombination[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OUTFITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading outfits', e);
  }
  return DEFAULT_SAVED_OUTFITS;
}

export function saveStoredOutfits(outfits: OutfitCombination[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_OUTFITS, JSON.stringify(outfits));
  } catch (e) {
    console.error('Error saving outfits', e);
  }
}

export function getStoredChat(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHAT);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading chat', e);
  }
  return INITIAL_CHAT_MESSAGES;
}

export function saveStoredChat(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving chat', e);
  }
}

export function getStoredReviews(): StyleReviewRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reviews', e);
  }
  return [
    {
      id: 'rev_1',
      tipo: 'completa',
      estado: 'completada',
      fecha: '2026-09-22',
      notasUsuario: 'Revisión general de inicio de temporada de otoño y validación de paleta.',
      precio: 99,
      wilmaNotas: 'Elena tiene una base cromática cálida y luminosa excepcional. Hemos afinado el contraste: el camel tostado y el verde salvia le otorgan autoridad sin restar cercanía. Recomiendo priorizar blazers con estructuración de hombro medio y evitar prendas oversize desestructuradas que escondan su cintura natural.',
      wilmaRecomendaciones: [
        'Añade un fular de seda en tonos caldero/terracota para conectar looks monocromáticos oscuros.',
        'En joyería, mantén el acabado dorado cepillado o mate en lugar del oro blanco o plata brillante.',
        'Excelente selección de pantalones palazzo: mantienen el largo óptico de sus piernas intacto.'
      ]
    }
  ];
}

export function saveStoredReviews(reviews: StyleReviewRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving reviews', e);
  }
}

// -------------------------------------------------------------
// SERVICIOS PREMIUM & UPSELL STORAGE
// -------------------------------------------------------------
const STORAGE_KEY_BOOKINGS = 'styled_by_wilma_premium_bookings';
const STORAGE_KEY_USAGE = 'styled_by_wilma_feature_usage';
const STORAGE_KEY_WEEKLY_PLAN = 'styled_by_wilma_weekly_plan';

export const DEFAULT_BOOKINGS = [
  {
    id: 'book_initial_1',
    userId: 'user_wilma_default',
    servicio: 'colorimetria_profesional' as const,
    nombreServicio: 'Colorimetría Profesional Validada por Wilma',
    estado: 'completado' as const,
    precio: 89,
    fechaAgendada: '2026-09-25',
    notas: 'Validación de contraste y subtono cálido otoñal con calibración de 36 tonos.',
    createdAt: '2026-09-20T10:00:00.000Z'
  }
];

export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading bookings', e);
  }
  return DEFAULT_BOOKINGS;
}

export function saveStoredBookings(bookings: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving bookings', e);
  }
}

// -------------------------------------------------------------
// LÍMITES POR PLAN & RASTREO DE USO (FREE VS PREMIUM)
// -------------------------------------------------------------
export interface PlanLimits {
  chatMax: number;
  whatToWearMax: number;
  styleCheckMax: number;
  buyCheckMax: number;
  colorCheckMax: number;
  wardrobeMax: number;
}

export const PLAN_LIMITS: Record<'free' | 'premium' | 'premium_plus', PlanLimits> = {
  free: {
    chatMax: 5,
    whatToWearMax: 3,
    styleCheckMax: 3,
    buyCheckMax: 3,
    colorCheckMax: 3,
    wardrobeMax: 20
  },
  premium: {
    chatMax: Infinity,
    whatToWearMax: Infinity,
    styleCheckMax: Infinity,
    buyCheckMax: Infinity,
    colorCheckMax: Infinity,
    wardrobeMax: Infinity
  },
  premium_plus: {
    chatMax: Infinity,
    whatToWearMax: Infinity,
    styleCheckMax: Infinity,
    buyCheckMax: Infinity,
    colorCheckMax: Infinity,
    wardrobeMax: Infinity
  }
};

export const DEFAULT_FEATURE_USAGE = {
  chatMessagesThisMonth: 2,
  whatToWearThisMonth: 1,
  styleCheckThisMonth: 1,
  buyCheckThisMonth: 1,
  colorCheckThisMonth: 1,
  streakDays: 4,
  lastActiveDate: '2026-10-06'
};

export function getStoredUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USAGE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading usage', e);
  }
  return DEFAULT_FEATURE_USAGE;
}

export function saveStoredUsage(usage: typeof DEFAULT_FEATURE_USAGE) {
  try {
    localStorage.setItem(STORAGE_KEY_USAGE, JSON.stringify(usage));
  } catch (e) {
    console.error('Error saving usage', e);
  }
}

// -------------------------------------------------------------
// PLANIFICADOR SEMANAL DE OUTFITS (RETENCIÓN)
// -------------------------------------------------------------
export interface WeeklyOutfitPlan {
  lunes: string | null; // outfitId
  martes: string | null;
  miercoles: string | null;
  jueves: string | null;
  viernes: string | null;
  sabado: string | null;
  domingo: string | null;
}

export const DEFAULT_WEEKLY_PLAN: WeeklyOutfitPlan = {
  lunes: 'outfit_1',
  martes: null,
  miercoles: null,
  jueves: null,
  viernes: 'outfit_2',
  sabado: null,
  domingo: null
};

export function getStoredWeeklyPlan(): WeeklyOutfitPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEEKLY_PLAN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading weekly plan', e);
  }
  return DEFAULT_WEEKLY_PLAN;
}

export function saveStoredWeeklyPlan(plan: WeeklyOutfitPlan) {
  try {
    localStorage.setItem(STORAGE_KEY_WEEKLY_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Error saving weekly plan', e);
  }
}

