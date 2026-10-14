import React, { useState, useMemo } from 'react';
import {
  Receipt,
  FileSpreadsheet,
  FileText,
  Search,
  Calendar,
  CreditCard,
  Trash2,
  Plus,
} from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { exportSalesToExcel, exportSalesToPDF } from '../utils/exportUtils';

interface SalesManagerProps {
  onOpenNewSale: () => void;
}

export const SalesManager: React.FC<SalesManagerProps> = ({ onOpenNewSale }) => {
  const { sales, deleteSale, showcase, currentUser, theme, currency, exchangeRateCop, formatPrice } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    sales.forEach((s) => {
      if (s.date) set.add(s.date.substring(0, 7));
    });
    set.add('2026-10');
    return Array.from(set).sort().reverse();
  }, [sales]);

  const monthLabelsMap: Record<string, string> = {
    '2026-10': 'Octubre 2026',
    '2026-09': 'Septiembre 2026',
    '2026-08': 'Agosto 2026',
    'all': 'Historial Completo',
  };

  const currentMonthLabel = monthLabelsMap[selectedMonth] || selectedMonth;

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesMonth = selectedMonth === 'all' || s.date.startsWith(selectedMonth);
      const matchesSearch =
        s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMethod = selectedMethod === 'all' || s.paymentMethod === selectedMethod;

      return matchesMonth && matchesSearch && matchesMethod;
    });
  }, [sales, selectedMonth, searchQuery, selectedMethod]);

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalSale, 0);
  const totalCost = filteredSales.reduce((acc, s) => acc + s.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
  const totalUnits = filteredSales.reduce((acc, s) => acc + s.quantity, 0);

  const handleDownloadExcel = () => {
    exportSalesToExcel(filteredSales, currentMonthLabel, showcase, currency, exchangeRateCop);
  };

  const handleDownloadPDF = () => {
    exportSalesToPDF(filteredSales, currentMonthLabel, showcase, currency, exchangeRateCop);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar registro de venta de "${name}"?`)) {
      deleteSale(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with direct Excel & PDF download buttons - Clean Minimalist */}
      <div className={`p-6 rounded-2xl border ${styles.bgCard} space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-400">
                Moneda del Libro: {currency}
              </span>
            </div>
            <h1 className="text-2xl font-luxury font-bold tracking-tight">
              Libro de Ventas ({currentMonthLabel})
            </h1>
            <p className={`text-xs mt-0.5 ${styles.textMuted}`}>
              Descarga directa de informes contables en formato Excel (.xlsx) y PDF oficial expresados en {currency}.
            </p>
          </div>

          {/* Action CTAs: Excel & PDF */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadExcel}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 transition-all hover:border-emerald-500/60 hover:text-emerald-300 active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descargar Excel ({currency})</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${styles.buttonPrimary} shadow-sm transition-all active:scale-95`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Descargar PDF ({currency})</span>
            </button>

            <button
              onClick={onOpenNewSale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:text-white transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Venta</span>
            </button>
          </div>
        </div>

        {/* Minimalist Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">
              Venta Total ({currency})
            </span>
            <span className="text-base sm:text-lg font-luxury font-bold text-amber-400">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] text-neutral-500 block">{filteredSales.length} transacciones</span>
          </div>

          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">
              Piezas Vendidas
            </span>
            <span className="text-base sm:text-lg font-luxury font-bold text-neutral-200">
              {totalUnits} uds
            </span>
            <span className="text-[10px] text-neutral-500 block">En el período</span>
          </div>

          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">
              Ganancia Neta ({currency})
            </span>
            <span className="text-base sm:text-lg font-luxury font-bold text-emerald-400">
              {currentUser.permissions.canViewCostsAndMargins
                ? formatPrice(totalProfit)
                : '••••••••'}
            </span>
            <span className="text-[10px] text-neutral-500 block">
              {currentUser.permissions.canViewCostsAndMargins ? 'Utilidad Real' : 'Admin'}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">
              Margen Ponderado
            </span>
            <span className="text-base sm:text-lg font-luxury font-bold text-emerald-400">
              {currentUser.permissions.canViewCostsAndMargins ? `${avgMargin}%` : '••••••••'}
            </span>
            <span className="text-[10px] text-neutral-500 block">Sobre facturación</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className={`p-3 rounded-2xl border ${styles.bgCard}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, joya, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-8 pr-3 py-2 rounded-xl border ${styles.inputBg}`}
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              aria-label="Filtrar ventas por mes"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="2026-10" className="bg-neutral-900 text-white">Octubre 2026 (Actual)</option>
              <option value="2026-09" className="bg-neutral-900 text-white">Septiembre 2026</option>
              <option value="all" className="bg-neutral-900 text-white">Todo el Historial</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-xs">
            <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
            <select
              aria-label="Filtrar por método de pago"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-neutral-900 text-white">Todos los Métodos de Pago</option>
              <option value="Tarjeta de Crédito" className="bg-neutral-900 text-white">Tarjeta de Crédito</option>
              <option value="Transferencia Bancaria" className="bg-neutral-900 text-white">Transferencia Bancaria</option>
              <option value="Efectivo" className="bg-neutral-900 text-white">Efectivo en Bóveda</option>
              <option value="Cripto / USDT" className="bg-neutral-900 text-white">Cripto / USDT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modern Minimalist Sales Table */}
      <div className={`rounded-2xl border overflow-x-auto ${styles.bgCard}`}>
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-800 bg-neutral-900/50 uppercase font-mono text-[10px] text-neutral-400">
            <tr>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Joya / SKU</th>
              <th className="py-3 px-4">Metal</th>
              <th className="py-3 px-4">Cant</th>
              <th className="py-3 px-4">Venta ({currency})</th>
              {currentUser.permissions.canViewCostsAndMargins && (
                <>
                  <th className="py-3 px-4">Costo ({currency})</th>
                  <th className="py-3 px-4">Ganancia ({currency})</th>
                  <th className="py-3 px-4">Margen</th>
                </>
              )}
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Método</th>
              <th className="py-3 px-4">Vendedor</th>
              {currentUser.permissions.canDeleteSales && (
                <th className="py-3 px-4 text-right">Acción</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {filteredSales.length === 0 ? (
              <tr>
                <td
                  colSpan={currentUser.permissions.canViewCostsAndMargins ? 11 : 8}
                  className="py-10 text-center text-neutral-500"
                >
                  <Receipt className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                  No se registraron ventas con los filtros actuales.
                </td>
              </tr>
            ) : (
              filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-800/20 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-semibold text-neutral-200 block">
                      {s.productName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {s.productSku}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-neutral-300 whitespace-nowrap">
                    {s.metal}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-neutral-200">
                    {s.quantity}
                  </td>
                  <td className="py-2.5 px-4 font-luxury font-bold text-amber-400 whitespace-nowrap">
                    {formatPrice(s.totalSale)}
                  </td>
                  {currentUser.permissions.canViewCostsAndMargins && (
                    <>
                      <td className="py-2.5 px-4 text-neutral-400 font-mono whitespace-nowrap">
                        {formatPrice(s.totalCost)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                        +{formatPrice(s.profit)}
                      </td>
                      <td className="py-2.5 px-4 text-emerald-400 font-mono">
                        {s.profitMarginPct.toFixed(1)}%
                      </td>
                    </>
                  )}
                  <td className="py-2.5 px-4 text-neutral-300">
                    <div>{s.clientName}</div>
                    {s.clientDocument && (
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {s.clientDocument}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] font-mono text-neutral-400 whitespace-nowrap">
                      {s.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-neutral-400 whitespace-nowrap">
                    {s.sellerName}
                  </td>
                  {currentUser.permissions.canDeleteSales && (
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id, s.productName)}
                        className="p-1 rounded text-neutral-500 hover:text-rose-400 transition-colors"
                        title="Eliminar venta"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
