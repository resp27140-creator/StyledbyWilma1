import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '35mb' }));

// Inicialización de Google GenAI SDK con User-Agent requerido
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// Helper para limpiar JSON de respuestas Markdown
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// -----------------------------------------------------------------------
// RUTAS DE LA API DE IA (Styled By Wilma)
// -----------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Styled By Wilma API',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// A. ¿QUÉ ME PONGO? (What Should I Wear?)
app.post('/api/ai/what-to-wear', async (req, res) => {
  try {
    const { request, userStyleDNA, wardrobe } = req.body;

    const prompt = `
Eres Wilma, la asesora de imagen personal y estilista de lujo con IA para esta usuaria.
Tu objetivo es dar una recomendación de look impecable, personalizada y fundamentada.

PERFIL STYLE DNA DE LA USUARIA:
- Colorimetría: ${userStyleDNA?.color?.estacionPrincipal || 'Otoño'} (${userStyleDNA?.color?.subestacion || 'Otoño Suave'}), Temperatura: ${userStyleDNA?.color?.temperatura}, Mejores tonos: ${JSON.stringify(userStyleDNA?.color?.mejoresFamilias || [])}, Neutros: ${JSON.stringify(userStyleDNA?.color?.neutrosRecomendados || [])}.
- Cuerpo & Proporciones: ${userStyleDNA?.body?.proporcionHombroCintura || 'Equilibrado'}, ${userStyleDNA?.body?.lineasFavorecedoras?.join(', ') || 'Líneas fluidas con cintura marcada'}. Zonas a destacar: ${userStyleDNA?.body?.zonasDestacar?.join(', ') || 'Cintura, clavícula'}.
- Estilo: Clásico ${userStyleDNA?.style?.clasicoPct}%, Natural ${userStyleDNA?.style?.naturalPct}%, Elegante ${userStyleDNA?.style?.elegantePct}%, Creativo ${userStyleDNA?.style?.creativoPct}%.
- Comodidad: Nivel ${userStyleDNA?.comfort?.importanciaComodidad}/5. Tacón máximo: ${userStyleDNA?.comfort?.alturaMaximaTaconCm}cm. Ajuste: ${userStyleDNA?.comfort?.ajustePreferido}.

ARMARIO DISPONIBLE DE LA USUARIA:
${JSON.stringify((wardrobe || []).map((w: any) => ({ id: w.id, nombre: w.nombre, categoria: w.categoria, color: w.colorPrincipal, estilo: w.estilo })))}

SOLICITUD:
- Ocasión: "${request.occasion}"
- Contexto: "${request.context || 'general'}"
- Clima: "${request.weather || 'templado'}"
- Tiempo para arreglarse: "${request.timeAvailable || '15min'}"
- Mood / Sensación deseada: "${request.mood || 'segura y sofisticada'}"

Devuelve un JSON con este formato exacto:
{
  "outfitDescription": "Título editorial del look (ej. Smart Chic en Tonos Tostados)",
  "items": [
    {
      "categoria": "top|bottom|dress|outerwear|shoes|accessory",
      "descripcion": "Descripción detallada de la prenda recomendada",
      "color": "Color y matiz específico",
      "fromWardrobe": true o false (si coincide con una prenda del armario),
      "wardrobeItemId": "id de la prenda del armario si aplica o null",
      "tips": "Tip de estilismo para llevarla (ej. meter solo el frente por la cinturilla)"
    }
  ],
  "explicacion": "Explicación cálida y experta de POR QUÉ funciona para ELLA y sus proporciones",
  "colorimetriaMatch": "Cómo este look potencia su estación y rostro",
  "proporcionesMatch": "Cómo este look equilibra su silueta respetando sus zonas clave",
  "estiloMatch": "Cómo refleja su personalidad auténtica",
  "alternativas": ["Opción alternativa 1 si cambia el clima", "Opción alternativa de calzado"]
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        outfitDescription: 'Elegancia Natural: Sastrería Crepé y Seda Marfil',
        items: [
          {
            categoria: 'outerwear',
            descripcion: 'Blazer Sastrería Crepé Camel',
            color: 'Camel cálido',
            fromWardrobe: true,
            wardrobeItemId: 'item_1',
            tips: 'Llévalo con las mangas sutilmente recogidas a la altura del antebrazo.'
          },
          {
            categoria: 'top',
            descripcion: 'Camisa Seda Marfil Cuello Fluido',
            color: 'Marfil suave',
            fromWardrobe: true,
            wardrobeItemId: 'item_2',
            tips: 'Desabrocha los dos primeros botones para crear una línea en V favorecedora.'
          },
          {
            categoria: 'bottom',
            descripcion: 'Pantalón Tiro Alto Pinzas Beige Arena',
            color: 'Beige arena',
            fromWardrobe: true,
            wardrobeItemId: 'item_3',
            tips: 'El tiro alto marca suavemente la cintura creando un efecto de pierna infinita.'
          },
          {
            categoria: 'shoes',
            descripcion: 'Mocasines Piel Coñac con Detalle Dorado',
            color: 'Coñac cálido',
            fromWardrobe: true,
            wardrobeItemId: 'item_7',
            tips: 'El tono coñac aterriza la paleta monocromática con riqueza visual.'
          }
        ],
        explicacion: 'Este look eleva tu presencia con una sofisticación natural sin rigidez. Los tonos arena y camel envuelven tu colorimetría de Otoño Suave con una luz cálida excepcional.',
        colorimetriaMatch: 'La seda marfil proyecta luz limpia sobre el rostro sin la dureza de un blanco óptico.',
        proporcionesMatch: 'El corte del blazer equilibra hombros y cadera, mientras las pinzas alargan el torso inferior.',
        estiloMatch: 'Sintoniza al 100% con tu 45% Clásico y 30% Natural.',
        alternativas: ['Si refresca por la tarde, añade tu Trench Coat tostado encima', 'Para una opción más informal, cambia el pantalón sastre por jeans rectos índigo oscuro']
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/what-to-wear:', error);
    res.status(500).json({ message: error.message || 'Error al generar recomendación' });
  }
});

// B. ANALIZA MI LOOK (Style Check con Visión)
app.post('/api/ai/style-check', async (req, res) => {
  try {
    const { imageBase64, userStyleDNA, occasion } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'Se requiere una imagen para analizar' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
Eres Wilma, la consultora de alta costura y asesora de imagen personal.
Analiza detenidamente esta fotografía de un look que la usuaria se acaba de probar.

PERFIL STYLE DNA DE LA USUARIA:
${JSON.stringify({
  color: userStyleDNA?.color,
  body: userStyleDNA?.body,
  style: userStyleDNA?.style,
  comfort: userStyleDNA?.comfort
}, null, 2)}

OCASIÓN: "${occasion || 'Día a día / General'}"

REGLAS DE EVALUACIÓN:
1. Evalúa con ojo crítico de estilista editorial pero con tono constructivo, respetuoso y empoderador.
2. NUNCA asumas que la usuaria quiere verse "más delgada". Analiza el equilibrio visual, la armonía de líneas y el impacto.
3. Evalúa si la paleta de colores cromática de las prendas favorece o apaga su rostro según su Color DNA.
4. Analiza proporciones (largos de prendas, tiro, punto de corte en pierna o cadera).
5. Da consejos prácticos inmediatos (ej: "doblar el bajo del pantalón 2cm", "añadir cinturón de piel", "cambiar a joyería dorada").

Devuelve un JSON con este formato exacto:
{
  "overallScore": 88,
  "veredicto": "Look muy bien coordinado con enorme potencial tras un par de ajustes de estilismo.",
  "analysis": {
    "color": {
      "score": 90,
      "compatible": true,
      "comment": "Comentario sobre la armonía del color con su estación",
      "colorsDetected": ["Camel", "Marfil", "Gris marengo"]
    },
    "proportions": {
      "score": 85,
      "comment": "Comentario sobre largos y silueta",
      "silhouetteAnalysis": "Análisis de volumen y balance"
    },
    "styleCoherence": {
      "score": 92,
      "comment": "Coherencia con su estilo auténtico"
    },
    "occasionFit": {
      "score": 88,
      "comment": "Adecuación para la ocasión indicada"
    },
    "accessories": {
      "score": 80,
      "comment": "Evaluación del calzado, bolso o accesorios"
    }
  },
  "suggestions": [
    "Ajuste concreto 1",
    "Ajuste concreto 2",
    "Ajuste concreto 3"
  ],
  "alternativeStyling": [
    "Cómo transformar este mismo look para la noche o para un contexto más relajado"
  ],
  "confidence": 95
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        overallScore: 91,
        veredicto: 'Un conjunto sumamente equilibrado y favorecedor. Los cortes estructurados acompañan tus proporciones con distinción.',
        analysis: {
          color: {
            score: 94,
            compatible: true,
            comment: 'La interacción de tonalidades tostadas y neutros suaves crea una atmósfera cálida que realza tu tono de piel y mirada.',
            colorsDetected: ['Camel cálido', 'Crema suave', 'Cuero marrón']
          },
          proportions: {
            score: 89,
            comment: 'El punto de corte superior enmarca la cintura y genera una relación visual armónica entre torso y piernas.',
            silhouetteAnalysis: 'Líneas limpias y despejadas sin sobrecarga de volumen.'
          },
          styleCoherence: {
            score: 93,
            comment: 'Refleja a la perfección tu equilibrio entre elegancia clásica y naturalidad moderna.'
          },
          occasionFit: {
            score: 90,
            comment: 'Totalmente apto para reuniones y compromisos profesionales de alto nivel.'
          },
          accessories: {
            score: 87,
            comment: 'El calzado en piel natural completa el conjunto con discreción refinada.'
          }
        },
        suggestions: [
          'Prueba añadir un collar delicado o pendientes de aro en oro amarillo satinado para iluminar la zona de clavícula.',
          'Si llevas bolso, opta por una silueta estructurada en piel coñac o chocolate.'
        ],
        alternativeStyling: [
          'Para una transición inmediata a una cena, cambia el calzado por un botín de tacón bajo fino y añade labial teja cálido.'
        ],
        confidence: 96
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/style-check:', error);
    res.status(500).json({ message: error.message || 'Error al analizar el look' });
  }
});

// C. ¿ME LO COMPRO? (Buy Check con Visión)
app.post('/api/ai/buy-check', async (req, res) => {
  try {
    const { imageBase64, userStyleDNA, wardrobe, price, store } = req.body;

    const cleanBase64 = imageBase64?.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
Eres Wilma, asesora personal de compras inteligentes.
Una usuaria está frente a una prenda (o viéndola online) y se pregunta: "¿Me lo compro?".

Tu lema: "No compres ropa por cómo se ve en el maniquí. Cómprala solo si trabaja para ti y multiplica tu armario."

PERFIL STYLE DNA:
${JSON.stringify({
  color: userStyleDNA?.color,
  body: userStyleDNA?.body,
  style: userStyleDNA?.style,
  comfort: userStyleDNA?.comfort,
  shopping: userStyleDNA?.shopping
}, null, 2)}

PRECIO: ${price ? `${price}€` : 'No indicado'}
TIENDA: ${store || 'No indicada'}

ARMARIO ACTUAL DE LA USUARIA (Prendas disponibles para combinar):
${JSON.stringify((wardrobe || []).map((w: any) => w.nombre))}

INSTRUCCIONES:
1. Evalúa si la prenda es una inversión inteligente o una compra impulsiva duplicada.
2. Califica de 1 a 100 la compatibilidad en: Colorimetría, Proporciones, Estilo, Estilo de vida y Presupuesto/Valor.
3. Sugiere con qué 3 prendas de su armario actual podría combinarla de inmediato.
4. Emite una recomendación clara: 'comprar' | 'considerar' | 'no_comprar'.

Devuelve un JSON con este formato exacto:
{
  "recommendation": "comprar|considerar|no_comprar",
  "titular": "Frase contundente de veredicto (ej: '¡Compra inteligente! Multiplicará tus looks de entretiempo')",
  "confidence": 92,
  "compatibility": {
    "colorimetria": { "score": 95, "comment": "Explicación del color en relación a su paleta" },
    "proporciones": { "score": 88, "comment": "Explicación de cómo favorece su cuerpo" },
    "estilo": { "score": 92, "comment": "Encaje con su 45% Clásico / 30% Natural" },
    "lifestyle": { "score": 85, "comment": "Utilidad para su rutina híbrida y reuniones" },
    "presupuesto": { "score": 90, "comment": "Rentabilidad y coste por uso estimado" }
  },
  "combinations": [
    "Combina con tu Pantalón Tiro Alto Pinzas Beige Arena",
    "Combina con tu Camisa Seda Marfil",
    "Combina bajo tu Trench Coat Tostado"
  ],
  "costPerUseEstimate": "Aprox. 3,80€ por postura estimando 30 usos en el año",
  "alternativeSuggestions": [
    "Si dudas con la talla, asegúrate de que el hombro no caiga más de 1cm de tu línea natural"
  ]
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        recommendation: 'comprar',
        titular: '¡Inversión aprobada! Es una pieza versátil que resuelve múltiples situaciones de tu agenda.',
        confidence: 94,
        compatibility: {
          colorimetria: { score: 96, comment: 'Tonalidad perfectamente alineada con la paleta de Otoño Suave; aportará luminosidad sin contrastes agresivos.' },
          proporciones: { score: 90, comment: 'La línea de caída estiliza el torso y respeta la definición de cintura natural.' },
          estilo: { score: 93, comment: 'Encaja con tu núcleo Clásico Chic y admite toques naturales con accesorios relajados.' },
          lifestyle: { score: 88, comment: 'Apta tanto para jornadas de oficina con clientes como para eventos personales.' },
          presupuesto: { score: 89, comment: 'Excelente relación valor/uso para una pieza de fondo de armario de largo plazo.' }
        },
        combinations: [
          'Con tu Pantalón Tiro Alto Pinzas Beige Arena para un look monocromático de alta gama.',
          'Con tus Jeans Rectos Tiro Alto Azul Marino para un viernes informal impecable.',
          'Con tus Mocasines Coñac y bolso estructurado.'
        ],
        costPerUseEstimate: 'Aprox. 2,90€ por puesta proyectando 25+ usos en la temporada.',
        alternativeSuggestions: [
          'Verifica la composición en la etiqueta: si supera el 70% de fibras naturales mantendrá su aspecto nuevo mucho más tiempo.'
        ]
      });
    }

    const contents: any[] = [];
    if (cleanBase64) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/buy-check:', error);
    res.status(500).json({ message: error.message || 'Error al analizar compra' });
  }
});

// D. ¿ESTE COLOR ES PARA MÍ? (Color Check)
app.post('/api/ai/color-check', async (req, res) => {
  try {
    const { userColorDNA, imageBase64, colorHex, colorName } = req.body;

    const cleanBase64 = imageBase64?.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
Eres Wilma, experta internacional en colorimetría aplicada a la imagen personal y psicología del color.
La usuaria quiere saber si este color o prenda es para ella.

COLOR DNA DE LA USUARIA:
- Estación: ${userColorDNA?.estacionPrincipal || 'Otoño'}
- Subestación: ${userColorDNA?.subestacion || 'Otoño Suave'}
- Temperatura: ${userColorDNA?.temperatura || 'Cálida'}
- Profundidad: ${userColorDNA?.profundidad || 'Media'}
- Intensidad: ${userColorDNA?.intensidad || 'Suave'}
- Mejores familias: ${JSON.stringify(userColorDNA?.mejoresFamilias || [])}
- Neutros recomendados: ${JSON.stringify(userColorDNA?.neutrosRecomendados || [])}
- Metales: ${userColorDNA?.metales || 'Oro'}
- Menos favorecedores: ${JSON.stringify(userColorDNA?.coloresMenosFavorecedores || [])}

DATOS DEL COLOR A ANALIZAR:
${colorHex ? `Código HEX: ${colorHex}` : ''}
${colorName ? `Nombre del color: ${colorName}` : ''}

INSTRUCCIONES:
1. Determina si el color es compatible con su estación.
2. Explica la temperatura, profundidad e intensidad del color examinado.
3. Proporciona trucos prácticos: si no es su mejor color, explica CÓMO USARLO (por ejemplo: "aléjalo del rostro usándolo en faldas o pantalones, o neutralízalo con un pañuelo en tono cálido cerca del cuello").
4. Recomienda con qué colores complementarios combinarlo.

Devuelve un JSON con este formato exacto:
{
  "colorAnalizado": "Nombre evocador del color detectado (ej. Terracota Especiado o Verde Oliva Bosque)",
  "compatible": true,
  "temperatura": "Cálida|Fría|Neutra",
  "profundidad": "Clara|Media|Profunda",
  "intensidad": "Suave|Media|Vibrante",
  "subestacionMatch": "Totalmente alineado con tu subestación Otoño Suave",
  "comment": "Explicación detallada del efecto óptico que tiene sobre su tono de piel, iris y cabello",
  "comoUsarlo": [
    "Tip 1 para llevarlo cerca del rostro",
    "Tip 2 de combinación estratégica"
  ],
  "coloresComplementarios": [
    "Color complementario 1",
    "Color complementario 2",
    "Color complementario 3"
  ],
  "evitarCon": [
    "Color que crearía un contraste estridente o apagado"
  ]
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        colorAnalizado: colorName || 'Verde Oliva Dorado / Salvia Profundo',
        compatible: true,
        temperatura: 'Cálida',
        profundidad: 'Media',
        intensidad: 'Suave',
        subestacionMatch: 'Alineación sublime con tu paleta de Otoño Suave (Soft Autumn)',
        comment: 'Este tono contiene una base de pigmento amarillo y tierra que resuena de inmediato con los matices dorados de tu piel. Aporta frescura y descanso visual a la mirada sin resultar estridente.',
        comoUsarlo: [
          'Es un neutro sofisticado: puedes llevarlo en blazers, camisas de lino o abrigos cerca del rostro sin necesidad de maquillaje intenso.',
          'Acompáñalo con joyería en oro cepillado o plata envejecida para acentuar su calidez orgánica.'
        ],
        coloresComplementarios: [
          'Blanco marfil o pergamino',
          'Camel tostado y cuero coñac',
          'Terracota suave o caldera'
        ],
        evitarCon: [
          'Blanco óptico nuclear (crea un contraste frío artificial)',
          'Fucsia neón o plata brillante cromada'
        ]
      });
    }

    const contents: any[] = [];
    if (cleanBase64) {
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/color-check:', error);
    res.status(500).json({ message: error.message || 'Error al analizar color' });
  }
});

// E. CHAT CON LA STYLIST (Wilma)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, chatHistory, userStyleDNA, wardrobe, imageBase64 } = req.body;

    const systemPrompt = `
Eres Wilma, la estilista personal y confidente de moda de la usuaria.
Tu tono es cálido, sumamente educado, cómplice, refinado y directo.
No das consejos genéricos de revista. Cada frase tuya está personalizada porque conoces el perfil completo de la usuaria:

PERFIL DE LA USUARIA:
- Nombre: ${userStyleDNA?.user?.displayName || 'Elena'}
- Profesión: ${userStyleDNA?.user?.profession || 'Profesional'} (${userStyleDNA?.user?.workMode || 'híbrido'})
- Colorimetría: ${userStyleDNA?.color?.estacionPrincipal || 'Otoño'} / ${userStyleDNA?.color?.subestacion || 'Otoño Suave'}. Temperatura: ${userStyleDNA?.color?.temperatura}.
- Proporciones: ${userStyleDNA?.body?.proporcionHombroCintura || 'Equilibrado'}. Zonas que ama destacar: ${userStyleDNA?.body?.zonasDestacar?.join(', ') || 'Cintura'}.
- Estilo: Clásico ${userStyleDNA?.style?.clasicoPct}%, Natural ${userStyleDNA?.style?.naturalPct}%, Elegante ${userStyleDNA?.style?.elegantePct}%.
- Prioridad de comodidad: ${userStyleDNA?.comfort?.importanciaComodidad}/5.
- Tacón máximo: ${userStyleDNA?.comfort?.alturaMaximaTaconCm}cm.

ARMARIO DE LA USUARIA:
${(wardrobe || []).map((w: any) => `• ${w.nombre} (${w.categoria}, color ${w.colorPrincipal})`).join('\n')}

REGLAS DE WILMA:
1. Responde de forma concisa, elegante y práctica (2-3 párrafos máximo).
2. Si la usuaria pide ideas de looks o combinaciones, haz referencia explícita a prendas que ya tiene en su armario.
3. Si pregunta sobre tendencias, fíltralas a través de su Style DNA (explica cómo adaptarlas sin perder su esencia).
4. Proporciona siempre 2 o 3 acciones o preguntas sugeridas que la usuaria pueda pulsar a continuación.

Devuelve un JSON con este formato:
{
  "reply": "Tu respuesta en texto cálido, elegante y detallado...",
  "suggestedActions": [
    "Acción sugerida 1",
    "Acción sugerida 2",
    "Acción sugerida 3"
  ]
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `¡Hola ${userStyleDNA?.user?.displayName?.split(' ')[0] || 'Elena'}! Qué buena consulta. Teniendo en cuenta tu base de Otoño Suave y tu preferencia por piezas clásicas fluidas, te recomiendo apostar por jugar con capas monocromáticas en tonos marfil y camel tostado. Si vas a salir hoy, tu blazer camel combinado con la camisa de seda marfil y el pantalón beige arena te darán esa presencia impecable sin esfuerzo. ¿Quieres que preparemos también las opciones para el calzado según cuánto vayas a caminar?`,
        suggestedActions: [
          '¿Qué bolso y joyas doradas combinan mejor?',
          '¿Cómo adaptar este look si llueve o refresca?',
          'Quiero planear mi maleta para una escapada de fin de semana'
        ]
      });
    }

    const contents: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    // Incorporar contexto de conversación
    const historyText = (chatHistory || [])
      .slice(-6)
      .map((m: any) => `${m.role === 'user' ? 'Usuaria' : 'Wilma'}: ${m.contenido}`)
      .join('\n');

    contents.push({
      text: `${systemPrompt}\n\nHISTORIAL RECIENTE:\n${historyText}\n\nMENSAJE ACTUAL DE LA USUARIA:\n"${message}"\n\nResponde en formato JSON estructurado.`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/chat:', error);
    res.status(500).json({ message: error.message || 'Error en el chat' });
  }
});

// F. AUTO-ANÁLISIS DE PRENDA PARA EL ARMARIO (Wardrobe Auto-Tagging)
app.post('/api/ai/analyze-wardrobe-item', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: 'Se requiere una imagen de la prenda' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `
Analiza esta prenda fotografiada y extrae sus atributos estilísticos precisos para catalogarla en el armario digital de la usuaria.

Devuelve un JSON con este formato exacto:
{
  "nombre": "Nombre descriptivo de la prenda (ej. Blazer Sastrería Crepé Terracota)",
  "categoria": "top|bottom|dress|outerwear|shoes|accessory",
  "subcategoria": "Tipo específico (ej. Blazer cruzado, Blusa fluida, Loafers, etc.)",
  "colorPrincipal": "Color dominante (ej. Terracota, Camel, Verde bosque, Marino, etc.)",
  "colorSecundario": "Color secundario o tono de detalle (opcional)",
  "silueta": "Descripción de corte y ajuste (ej. Recta semi-entallada, Wide leg, Oversize, etc.)",
  "materialAparente": "Tejido probable (ej. Lino, Algodón, Seda, Lana, Piel, etc.)",
  "nivelFormalidad": 3, // Número del 1 (muy informal) al 5 (gala / etiqueta)
  "estilo": "Estilo primordial (ej. Clásico, Natural, Romántico, Elegante, Creativo)",
  "temporada": "primavera|verano|otoño|invierno|todo",
  "notas": "Breve nota de estilismo sobre cómo sacarle el máximo provecho a la prenda."
}
`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        nombre: 'Blusa Fluida Seda Cuello En V',
        categoria: 'top',
        subcategoria: 'Blusa sin mangas con caída',
        colorPrincipal: 'Blanco roto cálido',
        colorSecundario: 'Marfil',
        silueta: 'Línea fluida ligeramente holgada',
        materialAparente: 'Seda crepé o viscosa de alta densidad',
        nivelFormalidad: 3,
        estilo: 'Clásico Chic',
        temporada: 'todo',
        notas: 'Ideal como capa base luminosa para llevar bajo chaquetas o blazers.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanBase64
          }
        },
        { text: prompt }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsed);
  } catch (error: any) {
    console.error('Error en /api/ai/analyze-wardrobe-item:', error);
    res.status(500).json({ message: error.message || 'Error al analizar prenda' });
  }
});

// -----------------------------------------------------------------------
// INTEGRACIÓN VITE MIDDLEWARE (DEV) O SERVIDO ESTÁTICO (PROD)
// -----------------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Styled By Wilma] Servidor activo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error iniciando el servidor:', err);
});
