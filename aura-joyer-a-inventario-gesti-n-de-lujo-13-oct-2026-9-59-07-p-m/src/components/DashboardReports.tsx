import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Scale,
  Sparkles,
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Coins,
  Calendar,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { exportSalesToExcel, exportSalesToPDF } from '../utils/exportUtils';

export const DashboardReports: React.FC = () => {
  const { products, sales, showcase, theme, currentUser, currency, exchangeRateCop, formatPrice } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');

  // Available months from sales
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    sales.forEach((s) => {
      if (s.date) {
        set.add(s.date.substring(0, 7));
      }
    });
    set.add('2026-10');
    return Array.from(set).sort().reverse();
  }, [sales]);

  // Filter sales for the selected month
  const monthlySales = useMemo(() => {
    return sales.filter((s) => s.date.startsWith(selectedMonth));
  }, [sales, selectedMonth]);

  const monthLabelsMap: Record<string, string> = {
    '2026-10': 'Octubre 2026',
    '2026-09': 'Septiembre 2026',
    '2026-08': 'Agosto 2026',
  };
  const currentMonthLabel = monthLabelsMap[selectedMonth] || selectedMonth;

  // Monthly Financial Calculations
  const monthlyRevenue = monthlySales.reduce((acc, s) => acc + s.totalSale, 0);
  const monthlyCost = monthlySales.reduce((acc, s) => acc + s.totalCost, 0);
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const monthlyMarginPct = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;
  const monthlyUnits = monthlySales.reduce((acc, s) => acc + s.quantity, 0);

  // Inventory Valuations
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalInventoryRetailValue = products.reduce((acc, p) => acc + p.salePrice * p.stock, 0);
  const totalInventoryCostValue = products.reduce((acc, p) => acc + p.costPrice * p.stock, 0);

  // Low stock products alert
  const lowStockProducts = products.filter((p) => p.stock <= p.minStockAlert);

  // Category breakdown for sales
  const categoryStats = useMemo(() => {
    const map: Record<string, { count: number; revenue: number; profit: number }> = {};
    monthlySales.forEach((s) => {
      if (!map[s.category]) {
        map[s.category] = { count: 0, revenue: 0, profit: 0 };
      }
      map[s.category].count += s.quantity;
      map[s.category].revenue += s.totalSale;
      map[s.category].profit += s.profit;
    });
    return Object.entries(map).map(([category, val]) => ({
      category,
      ...val,
      margin: val.revenue > 0 ? (val.profit / val.revenue) * 100 : 0,
    })).sort((a, b) => b.revenue - a.revenue);
  }, [monthlySales]);

  // Metal capital breakdown in inventory
  const metalBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalGrams: number; retailValue: number }> = {};
    products.forEach((p) => {
      if (!map[p.metal]) {
        map[p.metal] = { count: 0, totalGrams: 0, retailValue: 0 };
      }
      map[p.metal].count += p.stock;
      map[p.metal].totalGrams += p.weightGrams * p.stock;
      map[p.metal].retailValue += p.salePrice * p.stock;
    });
    return Object.entries(map).map(([metal, val]) => ({
      metal,
      ...val,
    })).sort((a, b) => b.retailValue - a.retailValue);
  }, [products]);

  // Handle downloads with current currency
  const handleDownloadExcel = () => {
    exportSalesToExcel(monthlySales, currentMonthLabel, showcase, currency, exchangeRateCop);
  };

  const handleDownloadPDF = () => {
    exportSalesToPDF(monthlySales, currentMonthLabel, showcase, currency, exchangeRateCop);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Modern Minimalist */}
      <div className={`p-6 rounded-2xl border transition-all ${styles.bgCard} relative`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400">
                Moneda Activa: {currency} {currency === 'COP' ? `(1 USD = $${exchangeRateCop.toLocaleString()} COP)` : ''}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-luxury font-bold tracking-tight">
              Rendimiento & Operación
            </h1>
            <p className={`text-xs sm:text-sm ${styles.textMuted}`}>
              Indicadores financieros consolidados y análisis de existencias en metales y gemas nobles.
            </p>
          </div>

          {/* Month selector & Minimal Export Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/50 text-xs">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <select
                aria-label="Seleccionar período mensual"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs font-medium text-neutral-200 focus:outline-none cursor-pointer"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m} className="bg-neutral-900 text-white">
                    {monthLabelsMap[m] || m}
                  </option>
                ))}
              </select>
            </div>

            {/* Excel Download button */}
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-all hover:border-emerald-500/60 hover:text-emerald-300 active:scale-95"
              title={`Descargar Excel en ${currency}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel ({currency})</span>
            </button>

            {/* PDF Download button */}
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${styles.buttonPrimary} shadow-sm transition-all active:scale-95`}
              title={`Descargar PDF en ${currency}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF ({currency})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards: Clean Modernist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <div className={`p-5 rounded-2xl border ${styles.bgCard} transition-all hover:border-neutral-700`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${styles.textSubtle}`}>
              Ingresos ({currentMonthLabel})
            </span>
            <span className="text-[10px] font-mono text-neutral-500">{currency}</span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-luxury font-bold tracking-tight">
              {formatPrice(monthlyRevenue)}
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>{monthlySales.length} transacciones</span>
          </div>
        </div>

        {/* Cost of Goods */}
        <div className={`p-5 rounded-2xl border ${styles.bgCard} transition-all hover:border-neutral-700`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${styles.textSubtle}`}>
              Costo de Mercancía
            </span>
            <span className="text-[10px] font-mono text-neutral-500">{currency}</span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-luxury font-bold tracking-tight">
              {currentUser.permissions.canViewCostsAndMargins
                ? formatPrice(monthlyCost)
                : '••••••••'}
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            <span>{monthlyUnits} piezas vendidas</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-5 rounded-2xl border ${styles.bgCard} transition-all hover:border-neutral-700`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${styles.textSubtle}`}>
              Utilidad Neta Realizada
            </span>
            <span className="text-[10px] font-mono text-emerald-400">{monthlyMarginPct.toFixed(0)}%</span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-luxury font-bold tracking-tight text-emerald-400">
              {currentUser.permissions.canViewCostsAndMargins
                ? formatPrice(monthlyProfit)
                : '••••••••'}
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-400/80 font-medium">
            <span>
              {currentUser.permissions.canViewCostsAndMargins
                ? `Margen sobre ventas ${monthlyMarginPct.toFixed(1)}%`
                : 'Reservado a Gerencia'}
            </span>
          </div>
        </div>

        {/* Inventory Stock Valuation */}
        <div className={`p-5 rounded-2xl border ${styles.bgCard} transition-all hover:border-neutral-700`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${styles.textSubtle}`}>
              Valor en Bóveda / Vitrina
            </span>
            <span className="text-[10px] font-mono text-neutral-500">{products.length} modelos</span>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-luxury font-bold tracking-tight">
              {formatPrice(totalInventoryRetailValue)}
            </span>
          </div>
          <div className="mt-2 text-xs text-neutral-400">
            <span>{totalStockUnits} joyas en existencia física</span>
          </div>
        </div>
      </div>

      {/* Modernist Operational Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommendations & Categories */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${styles.bgCard} space-y-6`}>
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <div>
              <h2 className="text-base font-luxury font-bold tracking-wide">
                Diagnóstico Operativo de Joyería
              </h2>
              <p className={`text-xs mt-0.5 ${styles.textMuted}`}>
                Pautas de rotación y asignación de capital para maximizar el retorno de inversión.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider block">
                Mayor Margen: Solitarios & Anillos
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Los solitarios de compromiso registran un retorno promedio de <strong>49.9%</strong>. Sugerido mantener abastecimiento continuo en gemas de 1.0ct a 1.5ct con certificación internacional.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
              <span className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider block">
                Frecuencia: Oro Blanco & Plata 925
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Representan el <strong>65% de transacciones mensuales</strong>. Mantener un umbral de seguridad de 3 unidades para evitar pérdidas de venta inmediata.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block">
                Política Comercial ({currency})
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Margen bruto saludable del {monthlyMarginPct.toFixed(0)}%. Espacio para otorgar hasta 5% por pronto pago en transferencia bancaria.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/30 space-y-1.5">
              <span className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider block">
                Rotación de Piezas Exclusivas
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                {currentUser.permissions.canViewCostsAndMargins ? (
                  <>
                    Capital inmovilizado en compras: <strong>{formatPrice(totalInventoryCostValue)}</strong>. Exhibir en la portada web las piezas con baja rotación.
                  </>
                ) : (
                  'Impulsar en la web de presentación las joyas de alta gama para acelerar visitas al showroom.'
                )}
              </p>
            </div>
          </div>

          {/* Clean Minimalist Category Bars */}
          <div className="pt-2 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              Desglose de Ventas por Categoría ({currentMonthLabel})
            </span>
            {categoryStats.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No hay transacciones este mes.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((item) => {
                  const pct = monthlyRevenue > 0 ? (item.revenue / monthlyRevenue) * 100 : 0;
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="capitalize text-neutral-300">
                          {item.category} ({item.count} uds)
                        </span>
                        <span className="text-neutral-400 font-medium">
                          {formatPrice(item.revenue)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reorder Alerts & Vault Metals */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-luxury font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Alertas de Reabastecimiento
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400">
                {lowStockProducts.length} piezas
              </span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {lowStockProducts.length === 0 ? (
                <div className="p-3 text-xs text-neutral-500 text-center">
                  Existencias en nivel adecuado.
                </div>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-medium text-neutral-200 truncate">{p.name}</p>
                      <p className="text-[10px] font-mono text-neutral-500">{p.metal}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      p.stock === 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {p.stock === 0 ? 'Agotado' : `${p.stock} ud`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Precious Metals Breakdown */}
          <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-luxury font-bold flex items-center gap-2">
                <Scale className="w-4 h-4 text-neutral-400" />
                Existencias por Metal
              </h2>
              <span className="text-[10px] font-mono text-neutral-500">{currency}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {metalBreakdown.map((m) => (
                <div key={m.metal} className="flex items-center justify-between border-b border-neutral-800/50 pb-2">
                  <div>
                    <span className="text-neutral-300 font-medium">{m.metal}</span>
                    <p className="text-[10px] font-mono text-neutral-500">
                      {m.totalGrams.toFixed(1)}g en {m.count} piezas
                    </p>
                  </div>
                  <span className="font-mono text-neutral-300 font-medium">
                    {formatPrice(m.retailValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
