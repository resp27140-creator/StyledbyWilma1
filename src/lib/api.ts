import {
  WhatToWearRequest,
  WhatToWearResponse,
  StyleCheckResponse,
  BuyCheckResponse,
  ColorCheckResponse,
  FullStyleDNA,
  WardrobeItem,
  ChatMessage
} from '../types/index.ts';

export async function requestWhatToWear(
  request: WhatToWearRequest,
  userStyleDNA: FullStyleDNA,
  wardrobe: WardrobeItem[]
): Promise<WhatToWearResponse> {
  const res = await fetch('/api/ai/what-to-wear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request, userStyleDNA, wardrobe })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al generar la recomendación de outfit');
  }

  return res.json();
}

export async function requestStyleCheck(
  imageBase64: string,
  userStyleDNA: FullStyleDNA,
  occasion?: string
): Promise<StyleCheckResponse> {
  const res = await fetch('/api/ai/style-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, userStyleDNA, occasion })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al analizar el look');
  }

  return res.json();
}

export async function requestBuyCheck(
  imageBase64: string,
  userStyleDNA: FullStyleDNA,
  wardrobe: WardrobeItem[],
  price?: number,
  store?: string
): Promise<BuyCheckResponse> {
  const res = await fetch('/api/ai/buy-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, userStyleDNA, wardrobe, price, store })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al analizar la compra');
  }

  return res.json();
}

export async function requestColorCheck(
  userColorDNA: FullStyleDNA['color'],
  imageBase64?: string,
  colorHex?: string,
  colorName?: string
): Promise<ColorCheckResponse> {
  const res = await fetch('/api/ai/color-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userColorDNA, imageBase64, colorHex, colorName })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al analizar el color');
  }

  return res.json();
}

export async function requestChatWithWilma(
  message: string,
  chatHistory: ChatMessage[],
  userStyleDNA: FullStyleDNA,
  wardrobe: WardrobeItem[],
  imageBase64?: string
): Promise<{ reply: string; suggestedActions: string[] }> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chatHistory, userStyleDNA, wardrobe, imageBase64 })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error en el chat con Wilma');
  }

  return res.json();
}

export async function requestAnalyzeWardrobeItem(
  imageBase64: string
): Promise<{
  nombre: string;
  categoria: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  subcategoria: string;
  colorPrincipal: string;
  colorSecundario?: string;
  silueta: string;
  materialAparente: string;
  nivelFormalidad: number;
  estilo: string;
  temporada: 'primavera' | 'verano' | 'otoño' | 'invierno' | 'todo';
  notas: string;
}> {
  const res = await fetch('/api/ai/analyze-wardrobe-item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al auto-analizar la prenda');
  }

  return res.json();
}
