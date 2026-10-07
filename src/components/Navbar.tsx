import React from 'react';
import { UserProfile, FullStyleDNA } from '../types/index.ts';
import { Crown, RotateCcw } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  styleDNA: FullStyleDNA;
  onOpenOnboarding: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  styleDNA,
  onOpenOnboarding,
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Zone 1: Single Brand text element */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-left cursor-pointer group"
          >
            <span className="font-editorial text-2xl tracking-[0.15em] font-bold text-[#1A1816] uppercase whitespace-nowrap">
              Styled by Wilma
            </span>
          </button>

          {/* Zone 2: 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#665D50]">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`hover:text-[#1A1816] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'dashboard' ? 'text-[#1A1816] font-bold underline underline-offset-4' : ''
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => onSelectTab('chat')}
              className={`hover:text-[#1A1816] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'chat' ? 'text-[#1A1816] font-bold underline underline-offset-4' : ''
              }`}
            >
              Stylist 24/7
            </button>
            <button
              onClick={() => onSelectTab('wardrobe')}
              className={`hover:text-[#1A1816] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'wardrobe' ? 'text-[#1A1816] font-bold underline underline-offset-4' : ''
              }`}
            >
              Armario
            </button>
            <button
              onClick={() => onSelectTab('style-dna')}
              className={`hover:text-[#1A1816] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'style-dna' ? 'text-[#1A1816] font-bold underline underline-offset-4' : ''
              }`}
            >
              Style DNA
            </button>
            <button
              onClick={() => onSelectTab('style-review')}
              className={`hover:text-[#1A1816] transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'style-review' ? 'text-[#1A1816] font-bold underline underline-offset-4' : ''
              }`}
            >
              Servicios Wilma
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOnboarding}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5E5549] hover:text-[#1A1816] hover:bg-[#F0EBE3] transition-colors border border-[#DDD5C9] cursor-pointer whitespace-nowrap"
              title="Volver a realizar el diagnóstico inicial de 3 etapas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Test Estilo</span>
            </button>

            {/* Plan Badge / Profile Trigger */}
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full text-xs font-medium bg-[#1A1816] text-[#FAF8F5] hover:bg-[#332E2A] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5 text-[#C9A88C]" />
              <span className="capitalize">{user.subscriptionPlan.replace('_', '+')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
