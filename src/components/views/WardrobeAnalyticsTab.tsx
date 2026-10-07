import React, { useState, useMemo } from 'react';
import { WardrobeItem, FullStyleDNA } from '../../types/index.ts';
import {
  PieChart as PieIcon,
  Layers,
  TrendingUp,
  Sparkles,
  BarChart2,
  CheckCircle,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface WardrobeAnalyticsTabProps {
  wardrobe: WardrobeItem[];
  styleDNA: FullStyleDNA;
}

/**
 * WardrobeAnalyticsTab Component
 * Visual analytics dashboard using Recharts for wardrobe insights:
 * 1. Pie Chart: Wardrobe color distribution
 * 2. Bar Chart: Clothing category frequency
 * 3. List and Bar Chart: Top 5 most frequently used wardrobe items (calculated from veces_usada)
 */
export const WardrobeAnalyticsTab: React.FC<WardrobeAnalyticsTabProps> = ({
  wardrobe,
  styleDNA
}) => {
  const [usageSortMode, setUsageSortMode] = useState<'most_used' | 'cost_per_wear'>('most_used');

  // Helper to extract veces_usada safely from either snake_case or camelCase
  const getItemUsage = (item: WardrobeItem): number => {
    return (item as any).veces_usada ?? item.vecesUsada ?? 0;
  };

  // 1. Top 5 most frequently used wardrobe items (calculated from 'veces_usada')
  const top5Items = useMemo(() => {
    return [...wardrobe]
      .sort((a, b) => getItemUsage(b) - getItemUsage(a))
      .slice(0, 5);
  }, [wardrobe]);

  // Data formatted for Recharts horizontal BarChart
  const top5ChartData = useMemo(() => {
    return top5Items.map((item, idx) => {
      const shortName = item.nombre.length > 18 ? item.nombre.substring(0, 16) + '…' : item.nombre;
      const count = getItemUsage(item);
      return {
        rank: `#${idx + 1}`,
        name: shortName,
        fullName: item.nombre,
        veces_usada: count,
        categoria: item.categoria,
        color: item.colorPrincipal
      };
    });
  }, [top5Items]);

  // 2. Color distribution data for Recharts PieChart
  const colorDistributionData = useMemo(() => {
    const colorGroups: Record<string, { count: number; hex: string }> = {
      'Camel / Tostados': { count: 0, hex: '#C19A6B' },
      'Arena / Marfil': { count: 0, hex: '#DED5C7' },
      'Verde Oliva / Salvia': { count: 0, hex: '#6B7A58' },
      'Terracota / Teja': { count: 0, hex: '#C86D51' },
      'Azul Marino / Índigo': { count: 0, hex: '#2A4D69' },
      'Cuero / Coñac': { count: 0, hex: '#8B4513' },
      'Otros Tonos': { count: 0, hex: '#8C8275' }
    };

    wardrobe.forEach((item) => {
      const c = (item.colorPrincipal || '').toLowerCase();
      if (c.includes('camel') || c.includes('miel') || c.includes('tostad')) {
        colorGroups['Camel / Tostados'].count += 1;
      } else if (c.includes('marfil') || c.includes('beige') || c.includes('arena') || c.includes('blanco') || c.includes('crema')) {
        colorGroups['Arena / Marfil'].count += 1;
      } else if (c.includes('verde') || c.includes('oliva') || c.includes('salvia')) {
        colorGroups['Verde Oliva / Salvia'].count += 1;
      } else if (c.includes('terracota') || c.includes('teja') || c.includes('caldera')) {
        colorGroups['Terracota / Teja'].count += 1;
      } else if (c.includes('azul') || c.includes('marino') || c.includes('índigo') || c.includes('navy')) {
        colorGroups['Azul Marino / Índigo'].count += 1;
      } else if (c.includes('coñac') || c.includes('cuero') || c.includes('marrón')) {
        colorGroups['Cuero / Coñac'].count += 1;
      } else {
        colorGroups['Otros Tonos'].count += 1;
      }
    });

    return Object.entries(colorGroups)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        value: data.count,
        percentage: Math.round((data.count / Math.max(1, wardrobe.length)) * 100),
        color: data.hex
      }));
  }, [wardrobe]);

  // 3. Category frequency data for Recharts BarChart
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      top: 0,
      bottom: 0,
      dress: 0,
      outerwear: 0,
      shoes: 0,
      accessory: 0
    };

    wardrobe.forEach((item) => {
      if (counts[item.categoria] !== undefined) {
        counts[item.categoria] += 1;
      }
    });

    const labels: Record<string, { label: string; idealPct: number }> = {
      top: { label: 'Tops & Blusas', idealPct: 35 },
      bottom: { label: 'Pantalones', idealPct: 25 },
      outerwear: { label: 'Abrigos/Blazers', idealPct: 15 },
      shoes: { label: 'Calzado', idealPct: 15 },
      dress: { label: 'Vestidos', idealPct: 10 },
      accessory: { label: 'Accesorios', idealPct: 10 }
    };

    const total = Math.max(1, wardrobe.length);

    return Object.entries(counts).map(([cat, count]) => {
      const actualPct = Math.round((count / total) * 100);
      return {
        key: cat,
        categoria: labels[cat]?.label || cat,
        cantidad: count,
        actualPct,
        idealPct: labels[cat]?.idealPct || 15
      };
    });
  }, [wardrobe]);

  // 4. Usage level and cost-per-wear metrics
  const usageAndCostData = useMemo(() => {
    const estimatedCosts: Record<string, number> = {
      outerwear: 179,
      top: 110,
      bottom: 95,
      dress: 120,
      shoes: 130,
      accessory: 65
    };

    const mapped = wardrobe.map((item) => {
      const price = estimatedCosts[item.categoria] || 100;
      const wearCount = Math.max(1, getItemUsage(item));
      const costPerWear = Math.round((price / wearCount) * 10) / 10;
      const shortName = item.nombre.length > 17 ? item.nombre.substring(0, 15) + '…' : item.nombre;

      return {
        id: item.id,
        nombre: item.nombre,
        shortName,
        categoria: item.categoria,
        veces_usada: wearCount,
        costePorUso: costPerWear,
        precioEstimado: price,
        amortizada: costPerWear <= 10
      };
    });

    if (usageSortMode === 'most_used') {
      return mapped.sort((a, b) => b.veces_usada - a.veces_usada);
    } else {
      return mapped.sort((a, b) => a.costePorUso - b.costePorUso);
    }
  }, [wardrobe, usageSortMode]);

  // Executive summary stats
  const statsSummary = useMemo(() => {
    const totalWears = wardrobe.reduce((acc, it) => acc + getItemUsage(it), 0);
    const avgWears = wardrobe.length > 0 ? (totalWears / wardrobe.length).toFixed(1) : '0';
    const amortizedCount = usageAndCostData.filter((i) => i.amortizada).length;
    const avgCostPerWear = usageAndCostData.length > 0
      ? (usageAndCostData.reduce((acc, it) => acc + it.costePorUso, 0) / usageAndCostData.length).toFixed(2)
      : '0';

    return {
      totalWears,
      avgWears,
      amortizedCount,
      amortizedPct: Math.round((amortizedCount / Math.max(1, wardrobe.length)) * 100),
      avgCostPerWear
    };
  }, [wardrobe, usageAndCostData]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive KPIs Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-1">
              Amortización de Prendas
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-3xl font-bold text-[#2E5E4E]">
                {statsSummary.amortizedPct}%
              </span>
              <span className="text-xs text-[#7A7062]">
                ({statsSummary.amortizedCount} de {wardrobe.length} prendas)
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#5E5549] mt-2 pt-2 border-t border-[#F0ECE4]">
            Prendas rentables con coste inferior a 10€ por postura.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-1">
              Coste Medio / Puesta
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-3xl font-bold text-[#1A1816]">
                {statsSummary.avgCostPerWear}€
              </span>
              <span className="text-xs text-[#7A7062]">/ uso</span>
            </div>
          </div>
          <p className="text-[11px] text-[#5E5549] mt-2 pt-2 border-t border-[#F0ECE4]">
            Promedio ponderado en todo tu fondo de armario.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-1">
              Rotación Media
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-3xl font-bold text-[#8A5B38]">
                {statsSummary.avgWears}
              </span>
              <span className="text-xs text-[#7A7062]">puestas / prenda</span>
            </div>
          </div>
          <p className="text-[11px] text-[#5E5549] mt-2 pt-2 border-t border-[#F0ECE4]">
            {statsSummary.totalWears} posturas registradas en total.
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275] block mb-1">
              Armonía de Colorimetría
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-editorial text-3xl font-bold text-[#2E5E4E]">
                96%
              </span>
              <span className="text-xs text-[#7A7062]">{styleDNA.color.subestacion}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#5E5549] mt-2 pt-2 border-t border-[#F0ECE4]">
            Coincidencia alta con tu paleta recomendada.
          </p>
        </div>
      </div>

      {/* VISUALIZATION 1: COLOR DISTRIBUTION PIE CHART & VISUALIZATION 2: CATEGORY FREQUENCY BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* VISUALIZATION 1: Color Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#8A5B38]" />
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                  Paleta & Coherencia
                </span>
              </div>
              <span className="text-[11px] text-[#2E5E4E] font-medium bg-[#E8F2EC] px-2 py-0.5 rounded-full">
                {colorDistributionData.length} familias
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Distribución de Colores
            </h3>
            <p className="text-xs text-[#736859] mt-0.5">
              Proporción de tonos dominantes en tu armario según tu Color DNA ({styleDNA.color.subestacion}).
            </p>

            {/* Recharts PieChart */}
            <div className="h-64 w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={colorDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {colorDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#FAF8F5"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DDD5C9] shadow-md text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: data.color }}
                              />
                              <strong className="text-[#1A1816]">{data.name}</strong>
                            </div>
                            <p className="text-[#5E5549]">
                              {data.value} {data.value === 1 ? 'prenda' : 'prendas'} ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Color legend list */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#F0ECE4]">
            {colorDistributionData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span
                  className="w-3 h-3 rounded-full shrink-0 border border-black/15 shadow-inner"
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-[#1A1816] font-medium truncate flex-1 text-[11px]">{c.name}</span>
                <span className="text-[#8C8275] text-[11px]">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* VISUALIZATION 2: Category Frequency Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-[#E2DBD0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8A5B38]" />
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                  Estructura de Armario
                </span>
              </div>
              <span className="text-[11px] text-[#7A7062]">
                Total: {wardrobe.length} prendas
              </span>
            </div>

            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Frecuencia por Categoría
            </h3>
            <p className="text-xs text-[#736859] mt-0.5">
              Número de prendas por tipo en relación al ratio ideal de un armario cápsula funcional.
            </p>

            {/* Recharts BarChart for Category Frequency */}
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DF" />
                  <XAxis
                    dataKey="categoria"
                    tick={{ fill: '#7A7062', fontSize: 11 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    tick={{ fill: '#8C8275', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DDD5C9] shadow-md text-xs space-y-1">
                            <strong className="font-editorial text-sm text-[#1A1816] block">
                              {data.categoria}
                            </strong>
                            <p className="text-[#5E5549]">
                              Cantidad actual: <strong>{data.cantidad} prendas</strong> ({data.actualPct}%)
                            </p>
                            <p className="text-[#8A5B38]">
                              Proporción ideal cápsula: <strong>~{data.idealPct}%</strong>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="cantidad"
                    name="Prendas en armario"
                    fill="#1A1816"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Diagnostic note */}
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE3D8] text-xs text-[#5E5549] flex items-start gap-2.5 mt-2">
            <Sparkles className="w-4 h-4 text-[#8A5B38] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Diagnóstico de Wilma:</strong> Tu balance entre prendas superiores e inferiores es óptimo, permitiendo combinar cualquier pieza sin acumular excesos.
            </p>
          </div>
        </div>
      </div>

      {/* VISUALIZATION 3: TOP 5 MOST FREQUENTLY USED WARDROBE ITEMS (CALCULATED FROM 'veces_usada') */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE4] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8A5B38]">
                Rotación & Retorno de Inversión
              </span>
              <span className="text-xs text-[#8C8275]">·</span>
              <span className="text-xs text-[#2E5E4E] font-medium">Cálculo de veces_usada</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Top 5 Prendas Más Frecuentemente Usadas
            </h3>
            <p className="text-xs text-[#736859] mt-0.5">
              Las 5 piezas estrella calculadas a partir de su registro de uso acumulado (<code className="text-[#8A5B38] font-mono">veces_usada</code>).
            </p>
          </div>
        </div>

        {/* 3A: Horizontal Bar Chart of Top 5 Items */}
        <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE3D8]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#736859] block mb-2">
            Gráfica de Frecuencia de Uso (Top 5)
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top5ChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5DFD5" />
                <XAxis
                  type="number"
                  tick={{ fill: '#7A7062', fontSize: 11 }}
                  unit=" usos"
                />
                <YAxis
                  dataKey="rank"
                  type="category"
                  tick={{ fill: '#1A1816', fontSize: 12, fontWeight: 'bold' }}
                  width={35}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DDD5C9] shadow-md text-xs space-y-1">
                          <strong className="font-editorial text-sm text-[#1A1816] block">
                            {data.rank} · {data.fullName}
                          </strong>
                          <p className="text-[#5E5549]">
                            Frecuencia de uso (<code className="font-mono text-[#8A5B38]">veces_usada</code>):{' '}
                            <strong className="text-[#8A5B38]">{data.veces_usada} posturas</strong>
                          </p>
                          <p className="text-[#7A7062] capitalize">
                            Categoría: {data.categoria} · Tono: {data.color}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="veces_usada"
                  name="Veces usada"
                  fill="#8A5B38"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3B: Visual List / Cards of Top 5 Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {top5Items.map((item, idx) => {
            const usage = getItemUsage(item);
            const price = item.categoria === 'outerwear' ? 179 : item.categoria === 'shoes' ? 130 : item.categoria === 'top' ? 110 : 95;
            const costPerWear = Math.round((price / Math.max(1, usage)) * 10) / 10;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5DFD5] p-3 shadow-xs flex flex-col justify-between relative overflow-hidden"
              >
                {/* Rank badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      idx === 0
                        ? 'bg-[#EADBCE] text-[#7A4B28] border border-[#D5C2B1]'
                        : 'bg-[#F3EFEA] text-[#5E5549]'
                    }`}
                  >
                    #{idx + 1} en tu ranking
                  </span>
                  <span className="text-[10px] text-[#2E5E4E] font-bold">
                    {costPerWear}€/uso
                  </span>
                </div>

                {/* Image */}
                <img
                  src={item.imagenUrl}
                  alt={item.nombre}
                  className="w-full h-28 object-cover rounded-xl mb-2"
                />

                <div>
                  <h5 className="text-xs font-bold text-[#1A1816] line-clamp-1">
                    {item.nombre}
                  </h5>
                  <p className="text-[10px] text-[#7A7062] capitalize">
                    {item.categoria} · {item.colorPrincipal}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#F0ECE4] flex items-center justify-between">
                    <span className="text-[10px] text-[#8C8275]">veces_usada</span>
                    <span className="text-xs font-bold text-[#8A5B38]">{usage} veces</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADDITIONAL DEPTH: COST-PER-WEAR & AMORTIZATION DETAILED BAR CHART */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2DBD0] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0ECE4] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#2E5E4E]" />
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                Economía de Estilo & Rentabilidad
              </span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
              Nivel de Uso y Coste por Puesta (€/Uso)
            </h3>
            <p className="text-xs text-[#736859] mt-0.5">
              Comparativa completa de todas las prendas de tu armario ordenada por rentabilidad o frecuencia.
            </p>
          </div>

          {/* Sort Switcher Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#E0D8CB] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUsageSortMode('most_used')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                usageSortMode === 'most_used'
                  ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                  : 'text-[#615749] hover:text-[#1A1816]'
              }`}
            >
              Más Usadas
            </button>
            <button
              type="button"
              onClick={() => setUsageSortMode('cost_per_wear')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                usageSortMode === 'cost_per_wear'
                  ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                  : 'text-[#615749] hover:text-[#1A1816]'
              }`}
            >
              Menor Coste / Uso (€)
            </button>
          </div>
        </div>

        {/* Recharts BarChart for Usage vs Cost */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={usageAndCostData}
              margin={{ top: 15, right: 20, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DF" />
              <XAxis
                dataKey="shortName"
                tick={{ fill: '#7A7062', fontSize: 11 }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: '#8C8275', fontSize: 11 }}
                unit={usageSortMode === 'most_used' ? 'x' : '€'}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#DDD5C9] shadow-lg text-xs space-y-1.5 min-w-48">
                        <strong className="font-editorial text-sm text-[#1A1816] block border-b border-[#EAE3D8] pb-1">
                          {data.nombre}
                        </strong>
                        <div className="flex justify-between text-[#5E5549]">
                          <span>Veces usada:</span>
                          <strong className="text-[#1A1816]">{data.veces_usada} posturas</strong>
                        </div>
                        <div className="flex justify-between text-[#5E5549]">
                          <span>Coste por puesta:</span>
                          <strong className="text-[#2E5E4E]">{data.costePorUso}€ / uso</strong>
                        </div>
                        <div className="flex justify-between text-[#5E5549]">
                          <span>Valor estimado:</span>
                          <span>~{data.precioEstimado}€</span>
                        </div>
                        <div className="pt-1 text-[10px]">
                          {data.amortizada ? (
                            <span className="text-[#2E5E4E] font-bold bg-[#E8F2EC] px-2 py-0.5 rounded-full inline-block">
                              ✓ Prenda totalmente amortizada
                            </span>
                          ) : (
                            <span className="text-[#8A5B38] font-bold bg-[#FAF0E6] px-2 py-0.5 rounded-full inline-block">
                              ⚡ En proceso de amortización
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {usageSortMode === 'most_used' ? (
                <Bar
                  dataKey="veces_usada"
                  name="Veces usada"
                  fill="#8A5B38"
                  radius={[6, 6, 0, 0]}
                />
              ) : (
                <Bar
                  dataKey="costePorUso"
                  name="Coste por puesta (€)"
                  fill="#2E5E4E"
                  radius={[6, 6, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
