import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  UserCheck,
  Check,
  RotateCcw,
  HardDrive,
  Info,
  Coins,
  RefreshCw,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { AccentColor, ThemeMode, CurrencyType } from '../types/jewelry';

export const SettingsAppearance: React.FC = () => {
  const {
    theme,
    setThemeMode,
    setThemeAccent,
    currency,
    setCurrency,
    exchangeRateCop,
    setExchangeRateCop,
    currentUser,
    switchUser,
    isOffline,
    isSimulatedOffline,
    toggleSimulateOffline,
    lastSyncTime,
    resetToInitialData,
    products,
    sales,
    formatPrice,
  } = useJewelry();

  const styles = getThemeClasses(theme.mode, theme.accent);
  const [tempRate, setTempRate] = useState<number>(exchangeRateCop);
  const [rateSaved, setRateSaved] = useState(false);

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempRate > 0) {
      setExchangeRateCop(tempRate);
      setRateSaved(true);
      setTimeout(() => setRateSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header - Minimalist */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-1`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400">
            Ajustes Globales
          </span>
        </div>
        <h1 className="text-2xl font-luxury font-bold tracking-tight">
          Moneda, Apariencia & Roles
        </h1>
        <p className={`text-xs ${styles.textMuted}`}>
          Configuración de divisa (USD / COP), tasa de cambio, tema minimalista y control de accesos.
        </p>
      </div>

      {/* Section 1: Currency Selector (USD vs COP) */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-5`}>
        <div className="border-b border-neutral-800/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-luxury font-bold">
              1. Tipo de Moneda & Tasa de Cambio (USD / COP)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Moneda actual: <strong className="text-amber-400">{currency}</strong>
          </span>
        </div>

        <p className={`text-xs ${styles.textMuted}`}>
          Seleccione la moneda en que se exhiben todos los precios del catálogo, el registro de ventas y los informes en Excel y PDF.
        </p>

        {/* Currency Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* USD Option */}
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currency === 'USD'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-neutral-100 flex items-center gap-2">
                <span>Dólar Estadounidense</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-neutral-700 text-amber-400">USD ($)</span>
              </span>
              {currency === 'USD' && <Check className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-400 font-light">
              Moneda base internacional de gemología y metales preciosos (Ej. $4,890 USD).
            </p>
          </button>

          {/* COP Option */}
          <button
            type="button"
            onClick={() => setCurrency('COP')}
            className={`p-4 rounded-xl border text-left transition-all ${
              currency === 'COP'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-sm text-neutral-100 flex items-center gap-2">
                <span>Peso Colombiano</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border border-neutral-700 text-amber-400">COP ($)</span>
              </span>
              {currency === 'COP' && <Check className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-neutral-400 font-light">
              Moneda nacional colombiana con formato local de miles (Ej. $ 19.560.000 COP).
            </p>
          </button>
        </div>

        {/* Exchange Rate Setting Form */}
        <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-neutral-200 block">
                Tasa de Conversión (TRM USD → COP)
              </span>
              <p className="text-[11px] text-neutral-400">
                1 Dólar (USD) equivale actualmente a:
              </p>
            </div>

            <form onSubmit={handleSaveRate} className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-neutral-400">$</span>
                <input
                  type="number"
                  min="100"
                  step="10"
                  value={tempRate}
                  onChange={(e) => setTempRate(Number(e.target.value))}
                  className="w-32 text-xs font-mono pl-7 pr-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${styles.buttonPrimary} flex items-center gap-1`}
              >
                <RefreshCw className="w-3 h-3" />
                <span>Actualizar</span>
              </button>
            </form>
          </div>

          {rateSaved && (
            <span className="text-[11px] text-emerald-400 font-mono block">
              ✓ Tasa de conversión actualizada a ${tempRate.toLocaleString()} COP por USD.
            </span>
          )}

          {/* Live Preview Comparison */}
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Ejemplo de conversión en vivo:</span>
            <span className="text-neutral-200">
              $1,000 USD = <strong className="text-amber-400">{formatPrice(1000)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Appearance & Colors - Minimalist */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-5`}>
        <div className="border-b border-neutral-800/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-luxury font-bold">
              2. Apariencia & Acentos Metálicos
            </h2>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {theme.mode.toUpperCase()} • {styles.accentName}
          </span>
        </div>

        {/* Theme Mode Toggle (Dark / Light) */}
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
            Tema de Interfaz
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                theme.mode === 'dark'
                  ? 'bg-neutral-900 border-amber-500/50 ring-1 ring-amber-500/20'
                  : 'bg-neutral-900/30 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-neutral-200">Modo Oscuro (Negro Ónix)</span>
              </div>
              {theme.mode === 'dark' && <Check className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                theme.mode === 'light'
                  ? 'bg-stone-50 border-amber-600 ring-1 ring-amber-500/20 text-stone-900'
                  : 'bg-stone-100/40 border-stone-300 text-stone-600 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold">Modo Claro (Blanco Marfil)</span>
              </div>
              {theme.mode === 'light' && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>
          </div>
        </div>

        {/* Accent Color Picker (Gold, Silver, Copper) */}
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2.5">
            Tono Metálico de Acento
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gold */}
            <button
              type="button"
              onClick={() => setThemeAccent('gold')}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme.accent === 'gold'
                  ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                  <span className="font-bold text-xs text-amber-300">Dorado</span>
                </div>
                {theme.accent === 'gold' && <Check className="w-3 h-3 text-amber-400" />}
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">Oro 18k / 24k</span>
            </button>

            {/* Silver */}
            <button
              type="button"
              onClick={() => setThemeAccent('silver')}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme.accent === 'silver'
                  ? 'border-slate-300 bg-slate-300/10 ring-1 ring-slate-400/30'
                  : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
                  <span className="font-bold text-xs text-slate-200">Plateado</span>
                </div>
                {theme.accent === 'silver' && <Check className="w-3 h-3 text-slate-200" />}
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">Platino & Plata 925</span>
            </button>

            {/* Copper */}
            <button
              type="button"
              onClick={() => setThemeAccent('copper')}
              className={`p-3 rounded-xl border text-left transition-all ${
                theme.accent === 'copper'
                  ? 'border-[#E07A5F] bg-[#E07A5F]/10 ring-1 ring-[#E07A5F]/30'
                  : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#E07A5F]" />
                  <span className="font-bold text-xs text-[#E07A5F]">Cobre</span>
                </div>
                {theme.accent === 'copper' && <Check className="w-3 h-3 text-[#E07A5F]" />}
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">Oro Rosa & Bronce</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: User Roles & Access Control */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
        <div className="border-b border-neutral-800/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-luxury font-bold">
              3. Roles de Usuario & Permisos
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {currentUser.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => switchUser('admin')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentUser.role === 'admin'
                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-100">Carlos Mendoza (Administrador)</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 font-light">
              Acceso a costos confidenciales, márgenes netos, edición de la web CMS y borrado de ventas.
            </p>
          </div>

          <div
            onClick={() => switchUser('standard')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentUser.role === 'standard'
                ? 'border-slate-400 bg-slate-400/10 ring-1 ring-slate-400/30'
                : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-100">Elena Rojas (Estándar / Ventas)</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300">
                ESTÁNDAR
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 font-light">
              Registro de ventas y consulta de stock disponible. Costos de compra confidenciales ocultos.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Offline Support & Storage Engine */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
        <div className="border-b border-neutral-800/60 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-luxury font-bold">
              4. Modo Offline & Base de Datos Local
            </h2>
          </div>
          {isOffline ? (
            <span className="text-[11px] font-mono text-amber-400">● Offline Activo</span>
          ) : (
            <span className="text-[11px] font-mono text-emerald-400">● Conectado</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono text-neutral-500 block">Joyas Almacenadas</span>
            <span className="text-base font-luxury font-bold text-neutral-200">{products.length} piezas</span>
          </div>
          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono text-neutral-500 block">Ventas en Memoria</span>
            <span className="text-base font-luxury font-bold text-neutral-200">{sales.length} registros</span>
          </div>
          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono text-neutral-500 block">Último Guardado</span>
            <span className="text-base font-mono font-bold text-emerald-400">{lastSyncTime}</span>
          </div>
        </div>

        {/* Offline simulator toggle */}
        <div className="p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-200 block">
              Simular Modo Sin Conexión (Offline Testing)
            </span>
            <p className="text-[11px] text-neutral-400 font-light">
              Comprueba ventas y exportación de reportes desconectando virtualmente la red.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSimulateOffline}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulatedOffline
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
          >
            {isSimulatedOffline ? 'Simulación Activa' : 'Simular Desconexión'}
          </button>
        </div>

        {/* Reset Database button */}
        <div className="pt-2 flex items-center justify-between border-t border-neutral-800/50">
          <span className="text-xs text-neutral-500 font-light">
            Restablecer inventario, ventas y configuración web iniciales
          </span>
          <button
            type="button"
            onClick={() => {
              if (confirm('¿Restablecer datos al lote inicial de demostración?')) {
                resetToInitialData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer Datos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
