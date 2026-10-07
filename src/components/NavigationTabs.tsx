import React from 'react';
import {
  Home,
  MessageCircle,
  FolderHeart,
  User,
  Sparkles,
  Dna,
  Shirt
} from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab
}) => {
  // Mobile primary 4 navigation items
  const mobileTabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home, isCenter: false },
    { id: 'chat', label: 'Chat Stylist', icon: MessageCircle, isCenter: true },
    { id: 'wardrobe', label: 'Armario', icon: FolderHeart, isCenter: false },
    { id: 'profile', label: 'Perfil', icon: User, isCenter: false },
  ];

  // Desktop refined navigation destinations
  const desktopTabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'chat', label: 'Habla con Wilma', icon: MessageCircle },
    { id: 'wardrobe', label: 'Mi Armario', icon: FolderHeart },
    { id: 'what-to-wear', label: '¿Qué me pongo?', icon: Shirt },
    { id: 'style-dna', label: 'Style DNA', icon: Dna },
    { id: 'style-review', label: 'Servicios Wilma', icon: Sparkles },
    { id: 'profile', label: 'Mi Perfil & Planes', icon: User },
  ];

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* DESKTOP SUB-BAR (hidden on mobile, visible on sm and up)       */}
      {/* ------------------------------------------------------------- */}
      <nav className="hidden sm:block bg-[#FAF8F5]/90 border-b border-[#E8E2D9] sticky top-16 z-30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 py-2 overflow-x-auto">
            {desktopTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1A1816] text-[#FAF8F5] shadow-xs'
                      : 'text-[#615749] hover:text-[#1A1816] hover:bg-[#F2ECE3]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9A88C]' : 'text-[#8A8071]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE FIXED BOTTOM BAR (visible on mobile, hidden on sm+)    */}
      {/* ------------------------------------------------------------- */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D9] px-4 py-2 pb-safe">
        <div className="grid grid-cols-4 items-center justify-items-center max-w-md mx-auto">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isCenter) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className="flex flex-col items-center -mt-5 cursor-pointer relative group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                      isActive
                        ? 'bg-[#1A1816] text-[#FAF8F5] ring-2 ring-[#C9A88C]'
                        : 'bg-[#1A1816] text-[#FAF8F5]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#C9A88C]" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight mt-1 ${isActive ? 'text-[#1A1816]' : 'text-[#736859]'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center py-1 px-2 cursor-pointer transition-colors ${
                  isActive ? 'text-[#1A1816]' : 'text-[#8C8275] hover:text-[#1A1816]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#1A1816]' : 'text-[#8C8275]'}`} />
                <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'font-bold text-[#1A1816]' : 'text-[#736859]'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
