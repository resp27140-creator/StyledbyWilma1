// STYLED BY WILMA — Upsell Triggers & Premium Services Definitions
import { PremiumServiceName } from '../../types/index.ts';

export interface UpsellTriggerConfig {
  message: string;
  cta: string;
  servicio: PremiumServiceName;
  badge?: string;
}

export const UPSELL_TRIGGERS: Record<string, UpsellTriggerConfig> = {
  after_onboarding: {
    message: "Tu Style DNA está listo. ¿Quieres que Wilma lo revise personalmente para afinar tu colorimetría?",
    cta: "Agendar Style Review",
    servicio: 'colorimetria_profesional',
    badge: 'Recomendado tras diagnóstico'
  },
  after_10_style_checks: {
    message: "Ya hemos analizado 10 looks juntas. ¿Quieres una revisión completa de tu armario con Wilma?",
    cta: "Ver servicios premium",
    servicio: 'style_review_completo',
    badge: 'Hábito consolidado'
  },
  when_color_uncertain: {
    message: "Este análisis de color tiene confianza media. Wilma puede confirmarlo personalmente.",
    cta: "Validar con Wilma",
    servicio: 'colorimetria_profesional',
    badge: 'Máxima precisión'
  },
  when_body_analysis: {
    message: "El análisis corporal automático tiene limitaciones. Wilma puede hacer un análisis más profundo en videollamada.",
    cta: "Agendar análisis corporal",
    servicio: 'analisis_corporal_pro',
    badge: 'Asesoría 1:1'
  }
};

export interface PremiumServiceInfo {
  id: PremiumServiceName;
  nombre: string;
  tagline: string;
  descripcion: string;
  precio: number;
  duracion: string;
  entregables: string[];
  incluidoEnPlan?: string;
}

export const PREMIUM_SERVICES_CATALOG: Record<PremiumServiceName, PremiumServiceInfo> = {
  colorimetria_profesional: {
    id: 'colorimetria_profesional',
    nombre: 'Colorimetría Profesional Validada por Wilma',
    tagline: 'Tu paleta exacta de 36 tonos certificada por el ojo humano de Wilma',
    descripcion: 'Análisis minucioso de pigmentación, temperatura de subtono, contraste de iris y densidad capilar. Wilma valida y ajusta personalmente tu paleta.',
    precio: 89,
    duracion: 'Entrega en 48h',
    entregables: [
      'Carta digital de 36 colores calibrados en alta definición',
      'Guía de neutros indispensables y metales favorecedores',
      'Auditoría fotográfica de subtono con correcciones de Wilma',
      'Audio personalizado de Wilma explicando cómo aplicarlo'
    ],
    incluidoEnPlan: 'Premium+ (1 vez al inicio)'
  },
  analisis_corporal_pro: {
    id: 'analisis_corporal_pro',
    nombre: 'Análisis Corporal y Proporciones Pro',
    tagline: 'Líneas, caídas y cortes arquitectónicos que equilibran tu silueta real',
    descripcion: 'Sesión profunda con Wilma para mapear proporciones de torso, piernas y hombros, descubriendo exactamente qué cortes comprar y cuáles evitar.',
    precio: 119,
    duracion: 'Videollamada de 45 min',
    entregables: [
      'Guía visual de cortes (escotes, tiros, largos de pantalón y faldas)',
      'Ficha técnica de siluetas recomendadas y no recomendadas',
      'Revisión en vivo de tus 3 prendas más dudosas'
    ]
  },
  style_review_completo: {
    id: 'style_review_completo',
    nombre: 'Style Review Completo con Wilma',
    tagline: 'Auditoría integral: armario actual, hábitos de compra y proyección de imagen',
    descripcion: 'El servicio insignia de Wilma. Una revisión exhaustiva de tus looks habituales, compras planificadas y depuración del armario para construir coherencia absoluta.',
    precio: 149,
    duracion: 'Auditoría 72h + Dossier',
    entregables: [
      'Dossier confidencial de 14 páginas diseñado exclusivamente para ti',
      'Diagnóstico de prendas olvidadas y vacíos estratégicos del armario',
      'Plan de estilismo personalizado para los próximos 6 meses',
      'Notas y feedback directo de Wilma en cada outfit analizado'
    ],
    incluidoEnPlan: 'Premium+ (1 revisión cada mes)'
  },
  asesoria_1_1: {
    id: 'asesoria_1_1',
    nombre: 'Asesoría 1:1 por Videollamada',
    tagline: 'Tu stylist personal en directo para resolver un evento o cambio de etapa',
    descripcion: 'Sesión privada de 60 minutos con Wilma para preparar un evento clave (boda, conferencia, cambio de puesto) o resolver bloqueos de armario.',
    precio: 129,
    duracion: '60 minutos en directo',
    entregables: [
      'Grabación de la sesión y resumen ejecutivo de recomendaciones',
      '3 combinaciones completas listas para tu evento o maleta',
      'Soporte por mensajería directa durante los 7 días posteriores'
    ],
    incluidoEnPlan: 'Premium+ (1 sesión incluida)'
  },
  capsula_personalizada: {
    id: 'capsula_personalizada',
    nombre: 'Cápsula Personalizada Diseñada por Wilma',
    tagline: 'Colección cápsula de 12-15 prendas que generan más de 40 looks diferentes',
    descripcion: 'Wilma diseña desde cero tu armario cápsula de temporada con enlaces directos de compra según tu presupuesto y tiendas preferidas.',
    precio: 189,
    duracion: 'Entrega en 5 días hábiles',
    entregables: [
      'Moodboard editorial con tu cápsula de temporada',
      'Lookbook con 40+ combinaciones paso a paso',
      'Shopping list con enlaces directos ajustados a tu presupuesto mensual'
    ]
  }
};
