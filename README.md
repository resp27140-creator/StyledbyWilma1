# Styled By Wilma v2.0 — Asesoría de Imagen y Personal Styling con IA

Plataforma de asesoría de imagen y personal styling con IA diseñada bajo la filosofía de que la tecnología genera el hábito cotidiano mientras que el servicio humano monetiza la profundidad y exclusividad.

---

## 1. Principio Rector v2.0

> **Menos es más.** La app debe sentirse como una amiga estilista íntima que conoce a la usuaria, no como un formulario abrumador. La profundidad (colorimetría profesional, análisis corporal avanzado, cápsula personalizada) se reserva para el servicio humano premium de Wilma. La app genera hábito diario; el servicio humano monetiza la expertise.

### Prioridades de Diseño
1. **Simplicidad**: Comprensión inmediata en menos de 30 segundos.
2. **Intuición**: Reducción de fricción cognitiva en cada decisión.
3. **Recurrencia**: Hábito diario matutino (outfit del día, rutina 7:00 AM, racha de días, reto semanal).
4. **Monetización clara**: Embudo progresivo (Free → Premium → Asesoría Humana 1:1).
5. **Flexibilidad**: Identidad visual gobernada enteramente por variables CSS en `:root`.

---

## 2. Decisiones Pendientes con Wilma

Esta sección reúne las definiciones estratégicas a validar conjuntamente con Wilma antes de la versión de producción final:

- [ ] **Definir identidad visual final** (colores primarios, tipografía definitiva y tono editorial).
  - *¿Cuál es el color principal de la marca?* (Actualmente en placeholder elegante `#2D2D2D` + `#C9A88C`).
  - *¿Tipografía display: serif (Cormorant Garamond / Playfair Display) o sans-serif minimalista?*
  - *¿Tono de voz: cálido y cómplice, fresco y desenfadado, o lujo inaccesible?*
  - *¿Iconografía: trazo lineal limpio o rellena?*
  - *¿Logotipo: wordmark tipográfico o isotipo combinado?*
- [ ] **Validar precios de suscripción**:
  - Plan Free: $0/mes.
  - Plan Premium: $19/mes o $149/año.
  - Plan Premium+: $79/mes o $699/año.
- [ ] **Definir alcance de la colorimetría**:
  - *Opción A*: IA automática pura (Gemini Vision).
  - *Opción B (Recomendada MVP)*: Híbrida (la app recoge datos + Wilma valida personalmente).
  - *Opción C*: Exclusiva como servicio humano premium.
- [ ] **Validar qué funciones van en Free vs. Premium**:
  - Free: 5 mensajes de chat/mes, 3 consultas de outfit/mes, 3 style checks/mes, 20 prendas en armario.
  - Premium: Consultas ilimitadas + armario ilimitado.
- [ ] **Definir qué servicios premium humanos se ofrecerán**:
  - Colorimetría profesional validada ($89).
  - Análisis corporal y proporciones pro ($119).
  - Style Review completo con dossier ($149).
  - Asesoría 1:1 por videollamada ($129).
  - Cápsula personalizada de temporada ($189).

---

## 3. Arquitectura y Modelo de Datos

### 3.1 Colorimetría Flexible y Cascada de Confianza
La base de datos y la capa de TypeScript soportan el origen del diagnóstico sin romper la compatibilidad:

```sql
ALTER TABLE color_dna ADD COLUMN origen TEXT 
  CHECK (origen IN ('ia_automatico', 'wilma_manual', 'cuestionario_hibrido')) 
  DEFAULT 'cuestionario_hibrido';
ALTER TABLE color_dna ADD COLUMN confianza INTEGER DEFAULT 75;
ALTER TABLE color_dna ADD COLUMN validado_por_wilma INTEGER DEFAULT 0;
```

### 3.2 Sistema de Upsell Triggers
Ubicado en `src/lib/upsell/triggers.ts`, detecta momentos clave en el recorrido de la usuaria:
- `after_onboarding`: Ofrece afinar la colorimetría con Wilma.
- `after_10_style_checks`: Invita a una revisión integral de armario.
- `when_color_uncertain`: Ofrece validación humana cuando la confianza de la foto es moderada.
- `when_body_analysis`: Ofrece videollamada para proporciones complejas.

### 3.3 Onboarding en 3 Etapas (4-6 minutos)
- **Etapa 1: Cuéntame sobre ti** (Nombre, edad, modalidad de trabajo, eventos frecuentes, mayor desafío).
- **Etapa 2: Tu estilo en imágenes** (20 reacciones rápidas: "Lo usaría" / "Tal vez" / "Nunca").
- **Etapa 3: Tus primeros resultados** (Style DNA sintetizado + 3 recomendaciones inmediatas + acceso directo al dashboard).

Los cuestionarios extensos y fotos corporales se han trasladado a la sección **Mi Perfil** para completarse de manera voluntaria y progresiva.

### 3.4 Dashboard Simplificado y Mobile-First
- Saludo personalizado con contador de racha consecutiva.
- Botón dominante: **💬 Hablar con mi stylist**.
- 3 acciones rápidas: **¿Qué me pongo?**, **Analiza mi look**, **¿Me lo compro?**.
- Barra visual del **Style DNA**.
- **Outfit del Día** con snapshot exportable.
- Planificador semanal de 7 días y Reto de Estilo Semanal.
- Barra inferior mobile: Inicio, Chat (destacado central), Armario y Perfil.

---

## 4. Variables CSS de Identidad Visual (`src/index.css`)

Toda la estética visual se gobierna mediante tokens CSS centrales:

```css
:root {
  --color-primary: #2D2D2D;
  --color-primary-dark: #1A1A1A;
  --color-secondary: #5E5549;
  --color-accent: #C9A88C;
  --color-accent-dark: #9C7A4A;
  
  --color-bg: #FAF8F5;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F3EFEA;
  --color-text: #1A1A1A;
  --color-text-muted: #736859;
  --color-border: #E2DBD0;

  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}
```

Para actualizar la identidad gráfica una vez definida con Wilma, basta con modificar estos valores en `src/index.css`.
