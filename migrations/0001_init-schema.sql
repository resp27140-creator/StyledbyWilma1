-- ============================================================
-- STYLED BY WILMA — Esquema de Base de Datos Cloudflare D1
-- ============================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- 1. TABLA DE USUARIAS (referencia a Firebase Auth UID)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                          -- Firebase Auth UID
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    photo_url TEXT,
    provider TEXT NOT NULL DEFAULT 'email',       -- google | facebook | email
    age_range TEXT,                               -- 25-30, 30-35, 35-45, 45-55, 55+
    profession TEXT,
    work_mode TEXT CHECK (work_mode IN ('presencial', 'remoto', 'hibrido', 'independiente', 'otro')),
    climate TEXT,                                 -- tropical, templado, frio, variable
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    onboarding_step TEXT DEFAULT 'about_you',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);

-- 2. STYLE DNA — Perfil completo de personalización

-- 2.1 COLOR DNA
CREATE TABLE IF NOT EXISTS color_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    temperatura TEXT,                              -- cálida | fría | neutra
    profundidad TEXT,                              -- clara | media | profunda
    intensidad TEXT,                               -- suave | media | vibrante
    contraste TEXT,                                -- bajo | medio | alto
    estacion_principal TEXT,                       -- Otoño, Primavera, Verano, Invierno
    subestacion TEXT,                              -- Suave, Cálido, Profundo, Brillante
    mejores_familias TEXT,                         -- JSON array de familias de color
    neutros_recomendados TEXT,                     -- JSON array
    metales TEXT,                                  -- oro | plata | mixto
    colores_menos_favorecedores TEXT,              -- JSON array
    origen TEXT CHECK (origen IN ('ia_automatico', 'wilma_manual', 'cuestionario_hibrido')) DEFAULT 'cuestionario_hibrido',
    confianza INTEGER DEFAULT 75,                  -- 0-100
    validado_por_wilma INTEGER DEFAULT 0,          -- 0 o 1
    analisis_completado INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2.2 BODY DNA
CREATE TABLE IF NOT EXISTS body_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    proporcion_hombro_cintura TEXT,                -- relación hombro/cintura
    proporcion_cintura_cadera TEXT,                -- relación cintura/cadera
    longitud_torso TEXT,                           -- corto | medio | largo
    longitud_piernas TEXT,                         -- corta | media | larga
    altura_cm INTEGER,
    distribucion_volumen TEXT,                     -- JSON: dónde se concentra
    lineas_favorecedoras TEXT,                     -- JSON array
    largos_favorecedores TEXT,                     -- JSON array
    zonas_destacar TEXT,                           -- JSON array (preferencias)
    zonas_no_enfatizar TEXT,                       -- JSON array (preferencias)
    analisis_completado INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2.3 STYLE DNA
CREATE TABLE IF NOT EXISTS style_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    clasico_pct INTEGER DEFAULT 0,
    natural_pct INTEGER DEFAULT 0,
    romantico_pct INTEGER DEFAULT 0,
    creativo_pct INTEGER DEFAULT 0,
    deportivo_pct INTEGER DEFAULT 0,
    elegante_pct INTEGER DEFAULT 0,
    siluetas TEXT,
    estampados TEXT,
    estructura TEXT,
    ajuste TEXT,
    accesorios TEXT,
    tipos_zapatos TEXT,
    escotes TEXT,
    pantalones TEXT,
    faldas TEXT,
    vestidos TEXT,
    nivel_tendencia TEXT,                          -- bajo | medio | alto
    tests_completados INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2.4 LIFESTYLE DNA
CREATE TABLE IF NOT EXISTS lifestyle_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    rutina_semanal TEXT,
    actividades_frecuentes TEXT,
    eventos_frecuentes TEXT,
    vida_social TEXT,
    tiempo_arreglarse TEXT,
    necesidades_vestuario TEXT,
    codigo_vestimenta_laboral TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2.5 COMFORT DNA
CREATE TABLE IF NOT EXISTS comfort_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    importancia_comodidad INTEGER DEFAULT 3,
    ajuste_preferido TEXT,
    altura_maxima_tacon_cm INTEGER,
    necesidad_movilidad TEXT,
    prendas_no_utiliza TEXT,
    nivel_exposicion_corporal TEXT,
    preferencias_practicas TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2.6 SHOPPING DNA
CREATE TABLE IF NOT EXISTS shopping_dna (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    presupuesto_mensual TEXT,
    frecuencia_compra TEXT,
    marcas_habituales TEXT,
    tiendas_habituales TEXT,
    categorias_invertir TEXT,
    prioridades_actuales TEXT,
    problemas_frecuentes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. ARMARIO DIGITAL
CREATE TABLE IF NOT EXISTS wardrobe_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nombre TEXT,
    categoria TEXT NOT NULL,                       -- top, bottom, dress, outerwear, shoes, accessory
    subcategoria TEXT,
    color_principal TEXT,
    color_secundario TEXT,
    silueta TEXT,
    material_aparente TEXT,
    nivel_formalidad INTEGER,                      -- 1-5
    estilo TEXT,
    temporada TEXT,
    imagen_url TEXT,                               -- URL en Cloudflare R2
    imagen_thumb_url TEXT,
    notas TEXT,
    veces_usada INTEGER DEFAULT 0,
    ultima_vez_usada TEXT,
    activo INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_wardrobe_user ON wardrobe_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wardrobe_categoria ON wardrobe_items(user_id, categoria);

-- Combinaciones guardadas
CREATE TABLE IF NOT EXISTS outfit_combinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nombre TEXT,
    ocasion TEXT,
    item_ids TEXT NOT NULL,
    imagen_url TEXT,
    puntuacion_ia INTEGER,
    notas TEXT,
    guardado INTEGER DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 4. HISTORIAL DE ANÁLISIS Y CONSULTAS IA
CREATE TABLE IF NOT EXISTS ai_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'style_check',
        'buy_check',
        'color_check',
        'outfit_recommendation',
        'body_analysis',
        'color_analysis',
        'style_test'
    )),
    input_image_url TEXT,
    input_text TEXT,
    resultado TEXT,
    puntuacion INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 5. CHAT CON LA STYLIST
CREATE TABLE IF NOT EXISTS chat_conversations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    contenido TEXT NOT NULL,
    imagen_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 6. SUSCRIPCIONES Y STYLE REVIEWS
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'premium_plus')),
    estado TEXT NOT NULL DEFAULT 'activo',
    fecha_inicio TEXT,
    fecha_renovacion TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS style_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('colorimetria', 'style_dna', 'cuerpo', 'armario', 'completa')),
    estado TEXT DEFAULT 'solicitada',
    wilma_notas TEXT,
    wilma_recomendaciones TEXT,
    archivos_adjuntos TEXT,
    precio REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    completado_at TEXT
);

-- 7. SERVICIOS PREMIUM HUMANOS (Upsell y Asesoría 1:1)
CREATE TABLE IF NOT EXISTS premium_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    servicio TEXT NOT NULL CHECK (servicio IN (
        'colorimetria_profesional',
        'analisis_corporal_pro',
        'style_review_completo',
        'asesoria_1_1',
        'capsula_personalizada'
    )),
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'agendado', 'completado', 'cancelado')),
    precio REAL,
    fecha_agendada TEXT,
    notas TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. TRIGGERS DE UPSELL Y EVENTOS DE CONVERSIÓN
CREATE TABLE IF NOT EXISTS upsell_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_key TEXT NOT NULL,
    mostrado INTEGER DEFAULT 0,
    clickeado INTEGER DEFAULT 0,
    convertido INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

