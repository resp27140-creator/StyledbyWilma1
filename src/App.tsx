import React, { useState, useEffect } from 'react';
import {
  FullStyleDNA,
  WardrobeItem,
  OutfitCombination,
  ChatMessage,
  StyleReviewRequest,
  UserProfile,
  PremiumServiceBooking
} from './types/index.ts';
import {
  getStoredStyleDNA,
  saveStoredStyleDNA,
  getStoredWardrobe,
  saveStoredWardrobe,
  getStoredOutfits,
  saveStoredOutfits,
  getStoredChat,
  saveStoredChat,
  getStoredReviews,
  saveStoredReviews,
  getStoredBookings,
  saveStoredBookings,
  getStoredUsage,
  saveStoredUsage,
  DEFAULT_STYLE_DNA,
  DEFAULT_WARDROBE_ITEMS,
  DEFAULT_SAVED_OUTFITS,
  INITIAL_CHAT_MESSAGES
} from './lib/storage.ts';

import { Navbar } from './components/Navbar.tsx';
import { NavigationTabs } from './components/NavigationTabs.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { UpsellModal } from './components/UpsellModal.tsx';

import { DashboardView } from './components/views/DashboardView.tsx';
import { WhatToWearView } from './components/views/WhatToWearView.tsx';
import { StyleCheckView } from './components/views/StyleCheckView.tsx';
import { BuyCheckView } from './components/views/BuyCheckView.tsx';
import { ColorCheckView } from './components/views/ColorCheckView.tsx';
import { ChatStylistView } from './components/views/ChatStylistView.tsx';
import { WardrobeView } from './components/views/WardrobeView.tsx';
import { StyleDNAView } from './components/views/StyleDNAView.tsx';
import { StyleReviewView } from './components/views/StyleReviewView.tsx';
import { ProfileView } from './components/views/ProfileView.tsx';

export default function App() {
  const [styleDNA, setStyleDNA] = useState<FullStyleDNA>(getStoredStyleDNA);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(getStoredWardrobe);
  const [outfits, setOutfits] = useState<OutfitCombination[]>(getStoredOutfits);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(getStoredChat);
  const [reviews, setReviews] = useState<StyleReviewRequest[]>(getStoredReviews);
  const [bookings, setBookings] = useState<PremiumServiceBooking[]>(getStoredBookings);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState<boolean>(false);
  const [upsellTriggerKey, setUpsellTriggerKey] = useState<string>('after_onboarding');

  // Sync state to local persistence
  const handleUpdateDNA = (newDNA: FullStyleDNA) => {
    setStyleDNA(newDNA);
    saveStoredStyleDNA(newDNA);
  };

  const handleUpdateWardrobe = (items: WardrobeItem[]) => {
    setWardrobe(items);
    saveStoredWardrobe(items);
  };

  const handleUpdateOutfits = (newOutfits: OutfitCombination[]) => {
    setOutfits(newOutfits);
    saveStoredOutfits(newOutfits);
  };

  const handleSaveOutfit = (outfit: OutfitCombination) => {
    const updated = [outfit, ...outfits];
    setOutfits(updated);
    saveStoredOutfits(updated);
  };

  const handleUpdateChat = (messages: ChatMessage[]) => {
    setChatMessages(messages);
    saveStoredChat(messages);
  };

  const handleAddReview = (review: StyleReviewRequest) => {
    const updated = [review, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
  };

  const handleBookService = (booking: PremiumServiceBooking) => {
    const updated = [booking, ...bookings];
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    const updatedDNA = { ...styleDNA, user: updatedUser };
    setStyleDNA(updatedDNA);
    saveStoredStyleDNA(updatedDNA);
  };

  const handleOpenUpsell = (triggerKey: string = 'after_onboarding') => {
    setUpsellTriggerKey(triggerKey);
    setIsUpsellOpen(true);
  };

  const handleResetFactory = () => {
    localStorage.clear();
    setStyleDNA(DEFAULT_STYLE_DNA);
    setWardrobe(DEFAULT_WARDROBE_ITEMS);
    setOutfits(DEFAULT_SAVED_OUTFITS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setReviews(getStoredReviews());
    setBookings(getStoredBookings());
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1816] flex flex-col selection:bg-[#EADBCE]">
      {/* Top Brand Navbar */}
      <Navbar
        user={styleDNA.user}
        styleDNA={styleDNA}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Navigation Sub-bar & Mobile Bottom Bar */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 sm:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={styleDNA.user}
            styleDNA={styleDNA}
            wardrobe={wardrobe}
            outfits={outfits}
            onNavigate={setActiveTab}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenUpsell={handleOpenUpsell}
          />
        )}

        {activeTab === 'what-to-wear' && (
          <WhatToWearView
            styleDNA={styleDNA}
            wardrobe={wardrobe}
            onSaveOutfit={handleSaveOutfit}
          />
        )}

        {activeTab === 'style-check' && (
          <StyleCheckView
            styleDNA={styleDNA}
          />
        )}

        {activeTab === 'buy-check' && (
          <BuyCheckView
            styleDNA={styleDNA}
            wardrobe={wardrobe}
          />
        )}

        {activeTab === 'color-check' && (
          <ColorCheckView
            styleDNA={styleDNA}
            onOpenUpsell={handleOpenUpsell}
          />
        )}

        {activeTab === 'chat' && (
          <ChatStylistView
            styleDNA={styleDNA}
            wardrobe={wardrobe}
            messages={chatMessages}
            onUpdateMessages={handleUpdateChat}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobeView
            wardrobe={wardrobe}
            outfits={outfits}
            styleDNA={styleDNA}
            onUpdateWardrobe={handleUpdateWardrobe}
            onUpdateOutfits={handleUpdateOutfits}
          />
        )}

        {activeTab === 'style-dna' && (
          <StyleDNAView
            styleDNA={styleDNA}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === 'style-review' && (
          <StyleReviewView
            styleDNA={styleDNA}
            reviews={reviews}
            onAddReview={handleAddReview}
            onBookService={handleBookService}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={styleDNA.user}
            styleDNA={styleDNA}
            onUpdateUser={handleUpdateUser}
            onUpdateDNA={handleUpdateDNA}
            onResetFactoryData={handleResetFactory}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenUpsell={handleOpenUpsell}
          />
        )}
      </main>

      {/* 3-Stage Streamlined Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentDNA={styleDNA}
        onSaveDNA={handleUpdateDNA}
        onOpenUpsell={handleOpenUpsell}
      />

      {/* Human Stylist Upsell Modal */}
      <UpsellModal
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
        triggerKey={upsellTriggerKey}
        onBookService={handleBookService}
      />

      {/* Editorial Luxury Footer */}
      <footer className="mt-auto border-t border-[#E8E2D9] bg-[#FAF8F5] py-8 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8275]">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-semibold text-[#1A1816] tracking-wider uppercase">
              Styled by Wilma
            </span>
            <span>·</span>
            <span>Plataforma de Asesoría de Imagen y Personal Styling con IA</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Metodología Style DNA™</span>
            <span>·</span>
            <span>Google Gemini 3.8 Intelligence</span>
            <span>·</span>
            <span>Cloudflare Edge Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
