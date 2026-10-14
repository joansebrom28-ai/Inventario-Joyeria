import React, { useState } from 'react';
import { JewelryProvider, useJewelry } from './context/JewelryContext';
import { Header } from './components/Header';
import { DashboardReports } from './components/DashboardReports';
import { InventoryManager } from './components/InventoryManager';
import { SalesManager } from './components/SalesManager';
import { ShowcaseWebsite } from './components/ShowcaseWebsite';
import { ShowcaseEditor } from './components/ShowcaseEditor';
import { SettingsAppearance } from './components/SettingsAppearance';
import { NewSaleModal } from './components/NewSaleModal';
import { getThemeClasses } from './utils/themeStyles';

function AppContent() {
  const { theme } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'showcase-cms' | 'settings'>('dashboard');
  const [viewingPublicSite, setViewingPublicSite] = useState<boolean>(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState<boolean>(false);
  const [salePreselectedProduct, setSalePreselectedProduct] = useState<string | undefined>(undefined);

  const handleOpenSaleModal = (productId?: string) => {
    setSalePreselectedProduct(productId);
    setIsSaleModalOpen(true);
  };

  // If user is viewing the public presentation website
  if (viewingPublicSite) {
    return (
      <ShowcaseWebsite
        onReturnToAdmin={() => setViewingPublicSite(false)}
        onOpenCMS={() => {
          setViewingPublicSite(false);
          setActiveTab('showcase-cms');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${styles.bgMain} flex flex-col font-sans-luxury transition-colors duration-200`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewingPublicSite={viewingPublicSite}
        setViewingPublicSite={setViewingPublicSite}
        onOpenNewSale={() => handleOpenSaleModal()}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <DashboardReports />}
        {activeTab === 'inventory' && <InventoryManager onOpenNewSale={handleOpenSaleModal} />}
        {activeTab === 'sales' && <SalesManager onOpenNewSale={() => handleOpenSaleModal()} />}
        {activeTab === 'showcase-cms' && (
          <ShowcaseEditor onPreviewPublicSite={() => setViewingPublicSite(true)} />
        )}
        {activeTab === 'settings' && <SettingsAppearance />}
      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs transition-colors ${
        theme.mode === 'dark' ? 'border-neutral-900 text-neutral-500 bg-neutral-950' : 'border-stone-200 text-stone-500 bg-stone-100'
      }`}>
        <p className="font-luxury font-semibold tracking-wider">
          AURA JOYERÍA & ATELIER — SISTEMA INTEGRAL DE GESTIÓN DE INVENTARIO
        </p>
        <p className="text-[11px] mt-1 text-neutral-400">
          Soporte Offline Activo • Trazabilidad de Metales & Gemología • Exportación Contable
        </p>
      </footer>

      {/* Global New Sale Modal */}
      <NewSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => {
          setIsSaleModalOpen(false);
          setSalePreselectedProduct(undefined);
        }}
        preselectedProductId={salePreselectedProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <JewelryProvider>
      <AppContent />
    </JewelryProvider>
  );
}
