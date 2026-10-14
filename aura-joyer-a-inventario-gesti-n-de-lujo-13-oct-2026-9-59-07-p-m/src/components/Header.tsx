import React from 'react';
import {
  Diamond,
  LayoutDashboard,
  Gem,
  Receipt,
  Globe,
  Settings,
  Wifi,
  WifiOff,
  UserCheck,
  Sun,
  Moon,
  ExternalLink,
  Coins,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';

interface HeaderProps {
  activeTab: 'dashboard' | 'inventory' | 'sales' | 'showcase-cms' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'sales' | 'showcase-cms' | 'settings') => void;
  viewingPublicSite: boolean;
  setViewingPublicSite: (viewing: boolean) => void;
  onOpenNewSale: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewingPublicSite,
  setViewingPublicSite,
  onOpenNewSale,
}) => {
  const {
    currentUser,
    switchUser,
    theme,
    setThemeMode,
    isOffline,
    showcase,
    currency,
    setCurrency,
  } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${
      theme.mode === 'dark' ? 'bg-neutral-950/80 border-neutral-800/60' : 'bg-white/80 border-stone-200/70'
    }`}>
      {/* Top minimal bar */}
      <div className={`px-4 sm:px-6 py-1.5 text-xs flex justify-between items-center transition-colors border-b ${
        theme.mode === 'dark'
          ? 'bg-neutral-950/50 border-neutral-800/40 text-neutral-400'
          : 'bg-stone-50/50 border-stone-200/50 text-stone-500'
      }`}>
        <div className="flex items-center gap-3">
          {isOffline ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <WifiOff className="w-3 h-3 animate-pulse" />
              <span>Offline</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium text-emerald-400/90">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conectado</span>
            </span>
          )}
          <span className="hidden sm:inline text-neutral-600 dark:text-neutral-700">/</span>
          <span className="hidden sm:inline font-mono text-[11px] tracking-wider text-neutral-400">
            {showcase.storeName}
          </span>
        </div>

        {/* Currency Switcher & Role Bar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Currency Toggle (USD vs COP) */}
          <div className="flex items-center gap-1 bg-neutral-900/60 dark:bg-neutral-900/80 p-0.5 rounded-lg border border-neutral-800/60 text-[11px]">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded font-mono font-medium transition-all ${
                currency === 'USD'
                  ? 'bg-amber-500/20 text-amber-400 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Cambiar moneda a Dólares Americanos (USD)"
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('COP')}
              className={`px-2 py-0.5 rounded font-mono font-medium transition-all ${
                currency === 'COP'
                  ? 'bg-amber-500/20 text-amber-400 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Cambiar moneda a Pesos Colombianos (COP)"
            >
              COP ($)
            </button>
          </div>

          {/* User Role Quick Switch */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <select
              aria-label="Seleccionar usuario y rol"
              value={currentUser.role}
              onChange={(e) => switchUser(e.target.value as 'admin' | 'standard')}
              className={`rounded-lg px-2 py-1 text-[11px] font-medium border cursor-pointer transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              <option value="admin" className="bg-neutral-950 text-white">
                Admin: Carlos Mendoza
              </option>
              <option value="standard" className="bg-neutral-950 text-white">
                Ventas: Elena Rojas
              </option>
            </select>
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={() => setThemeMode(theme.mode === 'dark' ? 'light' : 'dark')}
            title={`Cambiar a modo ${theme.mode === 'dark' ? 'claro' : 'oscuro'}`}
            className={`p-1.5 rounded-lg border transition-all ${
              theme.mode === 'dark'
                ? 'border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-neutral-700'
                : 'border-stone-300 text-stone-600 hover:text-stone-900 hover:border-stone-400'
            }`}
          >
            {theme.mode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Minimalist Luxury */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { setViewingPublicSite(false); setActiveTab('dashboard'); }}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              theme.accent === 'gold'
                ? 'bg-neutral-900 border-amber-500/40 text-amber-400 group-hover:border-amber-400'
                : theme.accent === 'silver'
                ? 'bg-neutral-900 border-slate-400/40 text-slate-200 group-hover:border-slate-300'
                : 'bg-neutral-900 border-[#E07A5F]/40 text-[#E07A5F] group-hover:border-[#E07A5F]'
            }`}>
              <Diamond className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-luxury text-base tracking-[0.2em] font-bold uppercase">
                  AURA
                </span>
                <span className="text-[9px] tracking-widest font-mono uppercase px-1.5 py-0.2 rounded border border-neutral-800 text-neutral-400">
                  {currency}
                </span>
              </div>
              <p className="text-[9px] tracking-widest text-neutral-500 uppercase font-sans">
                Haute Joaillerie
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          {!viewingPublicSite && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? styles.badgeAccent + ' font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'inventory'
                    ? styles.badgeAccent + ' font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <Gem className="w-3.5 h-3.5" />
                <span>Catálogo</span>
              </button>

              <button
                onClick={() => setActiveTab('sales')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'sales'
                    ? styles.badgeAccent + ' font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Ventas & Reportes</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('showcase-cms')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'showcase-cms'
                      ? styles.badgeAccent + ' font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Editor Web</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'settings'
                    ? styles.badgeAccent + ' font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Ajustes & Moneda</span>
              </button>
            </nav>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Toggle Public Showcase View */}
            <button
              onClick={() => setViewingPublicSite(!viewingPublicSite)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                viewingPublicSite
                  ? styles.buttonPrimary
                  : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:text-white hover:border-neutral-700'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {viewingPublicSite ? 'Panel de Gestión' : 'Ver Web Pública'}
              </span>
              <span className="sm:hidden">
                {viewingPublicSite ? 'Panel' : 'Web'}
              </span>
            </button>

            {/* Quick Record Sale button */}
            {!viewingPublicSite && (
              <button
                onClick={onOpenNewSale}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${styles.buttonPrimary} flex items-center gap-1.5`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>+ Registrar Venta</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        {!viewingPublicSite && (
          <div className="md:hidden flex items-center justify-around py-2 border-t border-neutral-800/60 overflow-x-auto text-[11px]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'dashboard' ? styles.badgeAccent : 'text-neutral-400'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'inventory' ? styles.badgeAccent : 'text-neutral-400'}`}
            >
              Joyas
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'sales' ? styles.badgeAccent : 'text-neutral-400'}`}
            >
              Ventas
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('showcase-cms')}
                className={`px-2.5 py-1 rounded-md ${activeTab === 'showcase-cms' ? styles.badgeAccent : 'text-neutral-400'}`}
              >
                Web CMS
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-2.5 py-1 rounded-md ${activeTab === 'settings' ? styles.badgeAccent : 'text-neutral-400'}`}
            >
              Ajustes
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
