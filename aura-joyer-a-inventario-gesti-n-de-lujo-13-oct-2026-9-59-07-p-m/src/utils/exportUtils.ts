import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { SaleRecord, ShowcaseConfig, CurrencyType } from '../types/jewelry';

export function formatCurrencyValue(
  amountInUsd: number,
  currency: CurrencyType = 'USD',
  exchangeRate: number = 4000
): string {
  if (currency === 'COP') {
    const copAmount = Math.round(amountInUsd * exchangeRate);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(copAmount);
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInUsd);
}

// Fallback signature for convenience
export function formatCurrency(amount: number): string {
  return formatCurrencyValue(amount, 'USD', 4000);
}

export function exportSalesToExcel(
  sales: SaleRecord[],
  monthLabel: string,
  showcase: ShowcaseConfig,
  currency: CurrencyType = 'USD',
  exchangeRate: number = 4000
) {
  const currLabel = currency === 'COP' ? 'COP' : 'USD';
  const multiplier = currency === 'COP' ? exchangeRate : 1;

  // Calculate summary figures in selected currency
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalSale, 0) * multiplier;
  const totalCost = sales.reduce((sum, s) => sum + s.totalCost, 0) * multiplier;
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0);

  // 1. Detailed Sales rows
  const salesRows = sales.map((sale) => {
    const saleTotal = sale.totalSale * multiplier;
    const saleCost = sale.totalCost * multiplier;
    const saleProfit = sale.profit * multiplier;
    const unitPrice = sale.unitSalePrice * multiplier;
    const unitCost = sale.unitCost * multiplier;

    return {
      'ID Venta': sale.id,
      'Fecha': sale.date,
      'SKU': sale.productSku,
      'Producto / Joya': sale.productName,
      'Categoría': sale.category.toUpperCase(),
      'Metal': sale.metal,
      'Cantidad': sale.quantity,
      [`Precio Venta Unit. (${currLabel})`]: unitPrice,
      [`Venta Total (${currLabel})`]: saleTotal,
      [`Costo Unit. (${currLabel})`]: unitCost,
      [`Costo Total (${currLabel})`]: saleCost,
      [`Ganancia Neta (${currLabel})`]: saleProfit,
      'Margen (%)': `${sale.profitMarginPct.toFixed(1)}%`,
      'Moneda': currLabel,
      'Método de Pago': sale.paymentMethod,
      'Vendedor/a': sale.sellerName,
      'Cliente': sale.clientName,
      'Documento': sale.clientDocument || 'N/A',
      'Observaciones': sale.notes || '',
    };
  });

  // 2. Summary rows
  const summaryRows = [
    { 'Métrica Operativa': 'Empresa / Joyería', 'Valor': showcase.storeName },
    { 'Métrica Operativa': 'Período del Reporte', 'Valor': monthLabel },
    { 'Métrica Operativa': 'Moneda Aplicada', 'Valor': currency === 'COP' ? `Pesos Colombianos (COP) @ TRM ${exchangeRate}` : 'Dólares Americanos (USD)' },
    { 'Métrica Operativa': 'Fecha de Emisión', 'Valor': new Date().toLocaleDateString('es-ES') },
    { 'Métrica Operativa': 'Total de Unidades Vendidas', 'Valor': totalUnits },
    { 'Métrica Operativa': `Ingresos Brutos Totales (${currLabel})`, 'Valor': totalRevenue },
    { 'Métrica Operativa': `Costo Total de Adquisición (${currLabel})`, 'Valor': totalCost },
    { 'Métrica Operativa': `Ganancia Neta Total (${currLabel})`, 'Valor': totalProfit },
    { 'Métrica Operativa': 'Margen de Utilidad Promedio (%)', 'Valor': `${avgMargin}%` },
  ];

  // Create workbook and append sheets
  const wb = XLSX.utils.book_new();

  const wsSales = XLSX.utils.json_to_sheet(salesRows);
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);

  wsSales['!cols'] = [
    { wch: 12 }, // ID Venta
    { wch: 12 }, // Fecha
    { wch: 14 }, // SKU
    { wch: 36 }, // Producto
    { wch: 14 }, // Categoría
    { wch: 18 }, // Metal
    { wch: 10 }, // Cantidad
    { wch: 20 }, // Precio Unit
    { wch: 20 }, // Venta Total
    { wch: 18 }, // Costo Unit
    { wch: 18 }, // Costo Total
    { wch: 20 }, // Ganancia Neta
    { wch: 12 }, // Margen
    { wch: 10 }, // Moneda
    { wch: 20 }, // Metodo Pago
    { wch: 18 }, // Vendedor
    { wch: 24 }, // Cliente
    { wch: 16 }, // Documento
    { wch: 32 }, // Observaciones
  ];

  wsSummary['!cols'] = [
    { wch: 35 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(wb, wsSales, 'Ventas_Detalladas');
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen_Financiero');

  const safeMonth = monthLabel.replace(/\s+/g, '_').toLowerCase();
  XLSX.writeFile(wb, `Reporte_Ventas_${showcase.storeName.replace(/\s+/g, '_')}_${currLabel}_${safeMonth}.xlsx`);
}

export function exportSalesToPDF(
  sales: SaleRecord[],
  monthLabel: string,
  showcase: ShowcaseConfig,
  currency: CurrencyType = 'USD',
  exchangeRate: number = 4000
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const currLabel = currency === 'COP' ? 'COP' : 'USD';
  const multiplier = currency === 'COP' ? exchangeRate : 1;

  // Modern Minimalist Header (Clean White / Off-white with crisp dark lines)
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Fine metallic hairline
  doc.setFillColor(212, 175, 55);
  doc.rect(0, 38, pageWidth, 1.2, 'F');

  // Store title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(showcase.storeName.toUpperCase(), margin, 16);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(170, 170, 170);
  doc.text(showcase.tagline, margin, 23);
  doc.text(`${showcase.address} | Tel: ${showcase.phoneWhatsApp}`, margin, 29);

  // Currency badge right-aligned
  doc.setFillColor(28, 28, 28);
  doc.roundedRect(pageWidth - margin - 48, 10, 48, 20, 2, 2, 'F');
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(pageWidth - margin - 48, 10, 48, 20, 2, 2, 'S');

  doc.setTextColor(212, 175, 55);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`INFORME OFICIAL (${currLabel})`, pageWidth - margin - 45, 17);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9.5);
  doc.text(monthLabel.toUpperCase(), pageWidth - margin - 45, 25);

  let currentY = 48;

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalSale, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0);

  // Minimalist KPI Cards
  const kpis = [
    { title: `INGRESOS (${currLabel})`, val: formatCurrencyValue(totalRevenue, currency, exchangeRate), sub: `${sales.length} ventas` },
    { title: `COSTO MERCANCÍA`, val: formatCurrencyValue(totalCost, currency, exchangeRate), sub: `${totalUnits} piezas` },
    { title: `UTILIDAD NETA`, val: formatCurrencyValue(totalProfit, currency, exchangeRate), sub: 'Margen realizado' },
    { title: `MARGEN COMERCIAL`, val: `${avgMargin}%`, sub: 'Rendimiento general' },
  ];

  const cardWidth = (pageWidth - margin * 2 - 9) / 4;
  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + 3);
    doc.setFillColor(250, 250, 248);
    doc.roundedRect(cardX, currentY, cardWidth, 20, 1.5, 1.5, 'F');
    doc.setDrawColor(225, 222, 215);
    doc.roundedRect(cardX, currentY, cardWidth, 20, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(kpi.title, cardX + 3, currentY + 5.5);

    doc.setFontSize(9);
    doc.setTextColor(20, 20, 20);
    // shorten long strings if in COP
    const displayVal = kpi.val.length > 15 ? kpi.val.substring(0, 14) + '…' : kpi.val;
    doc.text(displayVal, cardX + 3, currentY + 12.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(140, 140, 140);
    doc.text(kpi.sub, cardX + 3, currentY + 17);
  });

  currentY += 28;

  // Table title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(25, 25, 25);
  doc.text(`Detalle de Transacciones — Moneda: ${currLabel}${currency === 'COP' ? ` (Tasa $${exchangeRate.toLocaleString()} COP/USD)` : ''}`, margin, currentY);
  currentY += 5;

  // Table header
  doc.setFillColor(22, 22, 24);
  doc.rect(margin, currentY, pageWidth - margin * 2, 6.5, 'F');
  doc.setTextColor(230, 205, 120);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');

  const colX = {
    fecha: margin + 2,
    sku: margin + 17,
    joya: margin + 36,
    metal: margin + 88,
    cant: margin + 114,
    venta: margin + 124,
    costo: margin + 148,
    ganancia: margin + 168,
  };

  doc.text('FECHA', colX.fecha, currentY + 4.5);
  doc.text('SKU', colX.sku, currentY + 4.5);
  doc.text('PIEZA / MODELO', colX.joya, currentY + 4.5);
  doc.text('METAL', colX.metal, currentY + 4.5);
  doc.text('UDS', colX.cant, currentY + 4.5);
  doc.text(`VENTA (${currLabel})`, colX.venta, currentY + 4.5);
  doc.text(`COSTO`, colX.costo, currentY + 4.5);
  doc.text(`GANANCIA`, colX.ganancia, currentY + 4.5);

  currentY += 6.5;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);

  sales.forEach((sale, i) => {
    if (currentY > pageHeight - 28) {
      doc.addPage();
      currentY = 18;
    }

    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 251);
      doc.rect(margin, currentY, pageWidth - margin * 2, 6, 'F');
    }
    doc.setDrawColor(240, 238, 232);
    doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6);

    doc.setTextColor(60, 60, 60);
    doc.text(sale.date.substring(5), colX.fecha, currentY + 4.2);
    doc.text(sale.productSku, colX.sku, currentY + 4.2);

    const cleanName = sale.productName.length > 28
      ? sale.productName.substring(0, 27) + '…'
      : sale.productName;
    doc.text(cleanName, colX.joya, currentY + 4.2);

    doc.text(sale.metal.replace('Oro 18k ', '18k '), colX.metal, currentY + 4.2);
    doc.text(String(sale.quantity), colX.cant + 2, currentY + 4.2);
    doc.text(formatCurrencyValue(sale.totalSale, currency, exchangeRate), colX.venta, currentY + 4.2);

    doc.setTextColor(110, 110, 110);
    doc.text(formatCurrencyValue(sale.totalCost, currency, exchangeRate), colX.costo, currentY + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(18, 125, 65);
    doc.text(formatCurrencyValue(sale.profit, currency, exchangeRate), colX.ganancia, currentY + 4.2);
    doc.setFont('helvetica', 'normal');

    currentY += 6;
  });

  // Total summary footer row
  currentY += 3;
  doc.setFillColor(238, 234, 222);
  doc.rect(margin, currentY, pageWidth - margin * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(20, 20, 20);
  doc.text('TOTALES CONSOLIDADOS:', colX.joya, currentY + 4.8);
  doc.text(String(totalUnits), colX.cant + 2, currentY + 4.8);
  doc.text(formatCurrencyValue(totalRevenue, currency, exchangeRate), colX.venta, currentY + 4.8);
  doc.text(formatCurrencyValue(totalCost, currency, exchangeRate), colX.costo, currentY + 4.8);
  doc.setTextColor(18, 125, 65);
  doc.text(formatCurrencyValue(totalProfit, currency, exchangeRate), colX.ganancia, currentY + 4.8);

  currentY += 15;

  if (currentY > pageHeight - 25) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Informe financiero emitido por ${showcase.storeName}. Moneda oficial del informe: ${currLabel}.`,
    margin,
    currentY
  );
  doc.text(
    `Fecha de generación: ${new Date().toLocaleString('es-ES')} | Versión Minimalista v2.5`,
    margin,
    currentY + 4
  );

  doc.setFillColor(15, 15, 15);
  doc.rect(0, pageHeight - 7, pageWidth, 7, 'F');
  doc.setFontSize(6.8);
  doc.setTextColor(212, 175, 55);
  doc.text(`${showcase.storeName} — Todos los derechos reservados.`, margin, pageHeight - 2.5);

  const safeMonth = monthLabel.replace(/\s+/g, '_').toLowerCase();
  doc.save(`Reporte_Oficial_${showcase.storeName.replace(/\s+/g, '_')}_${currLabel}_${safeMonth}.pdf`);
}
