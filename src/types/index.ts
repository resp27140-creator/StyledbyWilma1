// ============================================================
// STYLED BY WILMA — Tipos de Datos y Modelos
// ============================================================

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  provider: 'google' | 'facebook' | 'email';
  ageRange: string;
  profession: string;
  workMode: 'presencial' | 'remoto' | 'hibrido' | 'independiente' | 'otro';
  climate: 'tropical' | 'templado' | 'frio' | 'variable';
  onboardingCompleted: boolean;
  onboardingStep?: string;
  subscriptionPlan: 'free' | 'premium' | 'premium_plus';
  createdAt: string;
}

export interface ColorDNA {
  temperatura: 'cálida' | 'fría' | 'neutra';
  profundidad: 'clara' | 'media' | 'profunda';
  intensidad: 'suave' | 'media' | 'vibrante';
  contraste: 'bajo' | 'medio' | 'alto';
  estacionPrincipal: 'Otoño' | 'Primavera' | 'Verano' | 'Invierno';
  subestacion: string; // ej. Otoño Suave, Invierno Profundo
  mejoresFamilias: string[]; // ['Terracotas', 'Verde oliva', 'Mostaza cálido', 'Teja']
  neutrosRecomendados: string[]; // ['Beige arena', 'Gris carbón suave', 'Blanco roto', 'Camel']
  metales: 'oro' | 'plata' | 'mixto';
  coloresMenosFavorecedores: string[];
  origen: 'ia_automatico' | 'wilma_manual' | 'cuestionario_hibrido';
  confianza: number; // 0-100
  validado_por_wilma: boolean;
  analisisCompletado: boolean;
}

export interface BodyDNA {
  proporcionHombroCintura: string;
  proporcionCinturaCadera: string;
  longitudTorso: 'corto' | 'medio' | 'largo';
  longitudPiernas: 'corta' | 'media' | 'larga';
  alturaCm: number;
  distribucionVolumen: string;
  lineasFavorecedoras: string[];
  largosFavorecedores: string[];
  zonasDestacar: string[];
  zonasNoEnfatizar: string[];
  analisisCompletado: boolean;
}

export interface StyleDNA {
  clasicoPct: number;
  naturalPct: number;
  romanticoPct: number;
  creativoPct: number;
  deportivoPct: number;
  elegantePct: number;
  siluetas: string[];
  estampados: string[];
  estructura: string[];
  ajuste: string[];
  accesorios: string[];
  tiposZapatos: string[];
  nivelTendencia: 'bajo' | 'medio' | 'alto';
  testsCompletados: number;
}

export interface LifestyleDNA {
  rutinaSemanal: string;
  actividadesFrecuentes: string[];
  eventosFrecuentes: string[];
  vidaSocial: 'activa' | 'moderada' | 'tranquila';
  tiempoArreglarse: '5min' | '15min' | '30min' | '1h+';
  necesidadesVestuario: string[];
  codigoVestimentaLaboral: string;
}

export interface ComfortDNA {
  importanciaComodidad: number; // 1 to 5
  ajustePreferido: 'holgado' | 'entallado' | 'mixto';
  alturaMaximaTaconCm: number;
  necesidadMovilidad: string;
  prendasNoUtiliza: string[];
  nivelExposicionCorporal: 'bajo' | 'medio' | 'alto';
  preferenciasPracticas: string[];
}

export interface ShoppingDNA {
  presupuestoMensual: string;
  frecuenciaCompra: 'semanal' | 'mensual' | 'trimestral' | 'ocasional';
  marcasHabituales: string[];
  tiendasHabituales: string[];
  categoriasInvertir: string[];
  prioridadesActuales: string[];
  problemasFrecuentes: string[];
}

export interface FullStyleDNA {
  user: UserProfile;
  color: ColorDNA;
  body: BodyDNA;
  style: StyleDNA;
  lifestyle: LifestyleDNA;
  comfort: ComfortDNA;
  shopping: ShoppingDNA;
}

export interface WardrobeItem {
  id: string;
  userId: string;
  nombre: string;
  categoria: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  subcategoria: string;
  colorPrincipal: string;
  colorSecundario?: string;
  silueta?: string;
  materialAparente?: string;
  nivelFormalidad: number; // 1-5
  estilo: string;
  temporada: 'primavera' | 'verano' | 'otoño' | 'invierno' | 'todo';
  imagenUrl: string;
  vecesUsada: number;
  veces_usada?: number;
  ultimaVezUsada?: string;
  notas?: string;
}

export interface OutfitCombination {
  id: string;
  nombre: string;
  ocasion: string;
  itemIds: string[];
  imagenUrl?: string;
  puntuacionIa: number;
  notas: string;
  guardado: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  contenido: string;
  imagenUrl?: string;
  createdAt: string;
  suggestedActions?: string[];
}

export interface WhatToWearRequest {
  occasion: string;
  context?: string;
  weather?: string;
  timeAvailable?: string;
  mood?: string;
}

export interface WhatToWearResponse {
  outfitDescription: string;
  items: Array<{
    categoria: string;
    descripcion: string;
    color: string;
    fromWardrobe: boolean;
    wardrobeItemId?: string;
    tips: string;
  }>;
  explicacion: string;
  colorimetriaMatch: string;
  proporcionesMatch: string;
  estiloMatch: string;
  alternativas: string[];
}

export interface StyleCheckResponse {
  overallScore: number;
  veredicto: string;
  analysis: {
    color: {
      score: number;
      compatible: boolean;
      comment: string;
      colorsDetected: string[];
    };
    proportions: {
      score: number;
      comment: string;
      silhouetteAnalysis: string;
    };
    styleCoherence: {
      score: number;
      comment: string;
    };
    occasionFit: {
      score: number;
      comment: string;
    };
    accessories: {
      score: number;
      comment: string;
    };
  };
  suggestions: string[];
  alternativeStyling: string[];
  confidence: number;
}

export interface BuyCheckResponse {
  recommendation: 'comprar' | 'considerar' | 'no_comprar';
  titular: string;
  confidence: number;
  compatibility: {
    colorimetria: { score: number; comment: string };
    proporciones: { score: number; comment: string };
    estilo: { score: number; comment: string };
    lifestyle: { score: number; comment: string };
    presupuesto: { score: number; comment: string };
  };
  combinations: string[];
  costPerUseEstimate: string;
  alternativeSuggestions: string[];
}

export interface ColorCheckResponse {
  colorAnalizado: string;
  compatible: boolean;
  temperatura: string;
  profundidad: string;
  intensidad: string;
  subestacionMatch: string;
  comment: string;
  comoUsarlo: string[];
  coloresComplementarios: string[];
  evitarCon: string[];
}

export interface StyleReviewRequest {
  id: string;
  tipo: 'colorimetria' | 'style_dna' | 'cuerpo' | 'armario' | 'completa';
  estado: 'solicitada' | 'en_proceso' | 'completada';
  fecha: string;
  notasUsuario: string;
  precio: number;
  wilmaNotas?: string;
  wilmaRecomendaciones?: string[];
}

export type PremiumServiceName =
  | 'colorimetria_profesional'
  | 'analisis_corporal_pro'
  | 'style_review_completo'
  | 'asesoria_1_1'
  | 'capsula_personalizada';

export interface PremiumServiceBooking {
  id: string;
  userId: string;
  servicio: PremiumServiceName;
  nombreServicio: string;
  estado: 'pendiente' | 'agendado' | 'completado' | 'cancelado';
  precio: number;
  fechaAgendada?: string;
  notas?: string;
  createdAt: string;
}

export interface UpsellEvent {
  id: string;
  userId: string;
  triggerKey: string;
  mostrado: boolean;
  clickeado: boolean;
  convertido: boolean;
  createdAt: string;
}

export interface FeatureUsageTracker {
  chatMessagesThisMonth: number;
  whatToWearThisMonth: number;
  styleCheckThisMonth: number;
  buyCheckThisMonth: number;
  colorCheckThisMonth: number;
  streakDays: number;
  lastActiveDate: string;
}

