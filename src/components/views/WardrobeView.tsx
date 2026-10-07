import React, { useState } from 'react';
import { WardrobeItem, OutfitCombination, FullStyleDNA } from '../../types/index.ts';
import { requestAnalyzeWardrobeItem } from '../../lib/api.ts';
import {
  FolderHeart,
  Plus,
  Filter,
  Sparkles,
  Shirt,
  Calendar,
  Layers,
  BarChart2,
  Trash2,
  Upload,
  Loader2,
  X,
  CheckCircle,
  Share2
} from 'lucide-react';
import { OutfitSnapshotModal } from '../OutfitSnapshotModal.tsx';
import { WardrobeAnalyticsTab } from './WardrobeAnalyticsTab.tsx';

interface WardrobeViewProps {
  wardrobe: WardrobeItem[];
  outfits: OutfitCombination[];
  styleDNA: FullStyleDNA;
  onUpdateWardrobe: (items: WardrobeItem[]) => void;
  onUpdateOutfits: (outfits: OutfitCombination[]) => void;
}

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  outfits,
  styleDNA,
  onUpdateWardrobe,
  onUpdateOutfits
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeViewTab, setActiveViewTab] = useState<'items' | 'outfits' | 'analytics'>('items');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSnapshotOutfit, setSelectedSnapshotOutfit] = useState<OutfitCombination | null>(null);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);

  // New item modal state
  const [newImage, setNewImage] = useState<string>('https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80');
  const [newNombre, setNewNombre] = useState('Blazer Sastrería Crepé');
  const [newCategoria, setNewCategoria] = useState<any>('outerwear');
  const [newColor, setNewColor] = useState('Camel cálido');
  const [newFormalidad, setNewFormalidad] = useState(3);
  const [newTemporada, setNewTemporada] = useState<any>('todo');
  const [newNotas, setNewNotas] = useState('Prenda versátil de entretiempo');
  const [analyzingImage, setAnalyzingImage] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas las prendas' },
    { id: 'top', label: 'Tops & Blusas' },
    { id: 'bottom', label: 'Pantalones & Faldas' },
    { id: 'dress', label: 'Vestidos' },
    { id: 'outerwear', label: 'Chaquetas & Abrigos' },
    { id: 'shoes', label: 'Calzado' },
    { id: 'accessory', label: 'Accesorios' },
  ];

  const filteredItems = activeCategory === 'all'
    ? wardrobe
    : wardrobe.filter((item) => item.categoria === activeCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setNewImage(base64);

      // Trigger AI auto analysis
      setAnalyzingImage(true);
      try {
        const aiInfo = await requestAnalyzeWardrobeItem(base64);
        setNewNombre(aiInfo.nombre);
        setNewCategoria(aiInfo.categoria);
        setNewColor(aiInfo.colorPrincipal);
        setNewFormalidad(aiInfo.nivelFormalidad);
        setNewTemporada(aiInfo.temporada);
        setNewNotas(aiInfo.notas);
      } catch (err) {
        console.error('Error auto-tagging wardrobe item:', err);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveItem = () => {
    if (!newNombre.trim()) return;

    const newItem: WardrobeItem = {
      id: `item_${Date.now()}`,
      userId: styleDNA.user.id,
      nombre: newNombre,
      categoria: newCategoria,
      subcategoria: newCategoria,
      colorPrincipal: newColor,
      nivelFormalidad: newFormalidad,
      estilo: 'Clásico Natural',
      temporada: newTemporada,
      imagenUrl: newImage,
      vecesUsada: 1,
      notas: newNotas
    };

    onUpdateWardrobe([newItem, ...wardrobe]);
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateWardrobe(wardrobe.filter((item) => item.id !== id));
  };

  const handleDeleteOutfit = (id: string) => {
    onUpdateOutfits(outfits.filter((outfit) => outfit.id !== id));
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8C8275]">
              Gestión de Armario Cápsula
            </span>
            <span className="text-xs text-[#8C8275]">·</span>
            <span className="text-xs text-[#2E5E4E] font-medium">{wardrobe.length} prendas registradas</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1A1816]">
            Mi Armario Digital
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Prenda con IA</span>
        </button>
      </div>

      {/* Segmented Top View Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E2D9] pb-3">
        <button
          onClick={() => setActiveViewTab('items')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            activeViewTab === 'items'
              ? 'bg-[#1A1816] text-[#FAF8F5]'
              : 'text-[#615749] hover:bg-[#F2ECE3]'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Prendas ({wardrobe.length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab('outfits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            activeViewTab === 'outfits'
              ? 'bg-[#1A1816] text-[#FAF8F5]'
              : 'text-[#615749] hover:bg-[#F2ECE3]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Combinaciones Guardadas ({outfits.length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            activeViewTab === 'analytics'
              ? 'bg-[#1A1816] text-[#FAF8F5]'
              : 'text-[#615749] hover:bg-[#F2ECE3]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
      </div>

      {/* VIEW TAB 1: ITEMS */}
      {activeViewTab === 'items' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#EADBCE] text-[#1A1816] font-semibold'
                    : 'bg-white text-[#736859] border border-[#E0D8CB] hover:bg-[#FAF8F5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Garments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E5DFD5] overflow-hidden flex flex-col justify-between shadow-xs group hover:border-[#C8BFB0] transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#8C8275] hover:text-[#964B44] flex items-center justify-center shadow-xs transition-colors"
                      title="Eliminar prenda"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF8F5] flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#8C8275] mb-1">
                      <span>{item.categoria}</span>
                      <span>Formalidad: {item.nivelFormalidad}/5</span>
                    </div>
                    <h3 className="font-editorial text-lg font-bold text-[#1A1816] line-clamp-1">
                      {item.nombre}
                    </h3>
                    <p className="text-xs text-[#7A7062] mt-0.5">
                      Tono: <span className="text-[#1A1816] font-medium">{item.colorPrincipal}</span>
                    </p>
                    {item.notas && (
                      <p className="text-[11px] text-[#5E5549] mt-2 line-clamp-2">
                        {item.notas}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#EAE3D8] flex items-center justify-between text-[11px] text-[#7A7062]">
                    <span>Usada {item.vecesUsada} veces</span>
                    <span className="capitalize">{item.temporada}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: SAVED OUTFIT COMBINATIONS */}
      {activeViewTab === 'outfits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white rounded-3xl p-6 border border-[#E2DBD0] shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A5B38] block mb-1">
                      Ocasión: {outfit.ocasion}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#1A1816]">
                      {outfit.nombre}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#2E5E4E] bg-[#E8F2EC]">
                      {outfit.puntuacionIa}% Match
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSnapshotOutfit(outfit);
                        setIsSnapshotModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#1A1816] bg-[#F3EFEA] hover:bg-[#EADBCE] border border-[#DDD5C9] transition-colors cursor-pointer"
                      title="Generar snapshot estilizado y compartir"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#8A5B38]" />
                      <span>Snapshot</span>
                    </button>
                    <button
                      onClick={() => handleDeleteOutfit(outfit.id)}
                      className="text-[#8C8275] hover:text-[#964B44] p-1 cursor-pointer"
                      title="Eliminar combinación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#5E5549] leading-relaxed">
                  {outfit.notas}
                </p>

                {/* Items in outfit */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {outfit.itemIds.map((itemId) => {
                    const item = wardrobe.find((w) => w.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={item.id} className="text-center">
                        <img
                          src={item.imagenUrl}
                          alt={item.nombre}
                          className="w-full h-20 object-cover rounded-xl mb-1 border border-[#E5DFD5]"
                        />
                        <span className="text-[10px] font-medium text-[#1A1816] line-clamp-1 block">
                          {item.nombre}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW TAB 3: WARDROBE ANALYTICS (DEDICATED RECHARTS TAB COMPONENT) */}
      {activeViewTab === 'analytics' && (
        <WardrobeAnalyticsTab wardrobe={wardrobe} styleDNA={styleDNA} />
      )}

      {/* ADD ITEM MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#DDD5C9] shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D9]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8C8275]">
                  Catálogo Inteligente
                </span>
                <h2 className="font-editorial text-2xl font-bold text-[#1A1816]">
                  Añadir Prenda a Mi Armario
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7062] hover:bg-[#F2ECE3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo & Upload */}
            <div className="flex items-center gap-4">
              <img
                src={newImage}
                alt="Nueva prenda"
                className="w-24 h-28 object-cover rounded-2xl border border-[#DDD5C9]"
              />
              <div className="flex-1 space-y-2">
                <label className="py-2 px-3 rounded-xl border border-[#D9D1C5] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#1A1816] text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir foto (Auto-Tagging IA)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {analyzingImage && (
                  <div className="text-xs text-[#8A5B38] flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini Vision analizando atributos...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                  Nombre de la prenda
                </label>
                <input
                  type="text"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9D1C5] bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9D1C5] bg-white text-sm capitalize"
                  >
                    <option value="top">Top / Blusa</option>
                    <option value="bottom">Pantalón / Falda</option>
                    <option value="dress">Vestido</option>
                    <option value="outerwear">Chaqueta / Abrigo</option>
                    <option value="shoes">Calzado</option>
                    <option value="accessory">Accesorio</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Color dominante
                  </label>
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9D1C5] bg-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Formalidad (1-5): {newFormalidad}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newFormalidad}
                    onChange={(e) => setNewFormalidad(Number(e.target.value))}
                    className="w-full accent-[#1A1816]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                    Temporada
                  </label>
                  <select
                    value={newTemporada}
                    onChange={(e) => setNewTemporada(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D9D1C5] bg-white text-sm"
                  >
                    <option value="todo">Todo el año</option>
                    <option value="primavera">Primavera</option>
                    <option value="verano">Verano</option>
                    <option value="otoño">Otoño</option>
                    <option value="invierno">Invierno</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#736859] mb-1">
                  Notas de estilismo
                </label>
                <textarea
                  value={newNotas}
                  onChange={(e) => setNewNotas(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#D9D1C5] bg-white text-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#E8E2D9] flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-full text-xs font-semibold text-[#5E5549] hover:bg-[#F2ECE3]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveItem}
                className="px-6 py-2 rounded-full bg-[#1A1816] text-[#FAF8F5] text-xs font-semibold hover:bg-[#332E2A]"
              >
                Guardar Prenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLIZED OUTFIT SNAPSHOT & SOCIAL EXPORT MODAL */}
      <OutfitSnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        outfit={selectedSnapshotOutfit}
        wardrobe={wardrobe}
        styleDNA={styleDNA}
      />
    </div>
  );
};
