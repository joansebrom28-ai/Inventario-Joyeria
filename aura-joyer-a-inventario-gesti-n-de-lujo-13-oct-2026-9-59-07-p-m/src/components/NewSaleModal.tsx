import React, { useState, useEffect } from 'react';
import { X, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import { useJewelry } from '../context/JewelryContext';
import { PaymentMethod } from '../types/jewelry';
import { getThemeClasses } from '../utils/themeStyles';
import { formatCurrency } from '../utils/exportUtils';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProductId?: string;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  preselectedProductId,
}) => {
  const { products, recordSale, currentUser, theme, currency, formatPrice } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const availableProducts = products.filter((p) => p.stock > 0);

  const [productId, setProductId] = useState<string>(
    preselectedProductId || availableProducts[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [clientName, setClientName] = useState<string>('');
  const [clientDocument, setClientDocument] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tarjeta de Crédito');
  const [notes, setNotes] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync selected product price
  useEffect(() => {
    if (preselectedProductId) {
      setProductId(preselectedProductId);
    } else if (!productId && availableProducts.length > 0) {
      setProductId(availableProducts[0].id);
    }
  }, [preselectedProductId, availableProducts, productId]);

  const selectedProduct = products.find((p) => p.id === productId);

  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.salePrice);
      if (quantity > selectedProduct.stock) {
        setQuantity(Math.max(1, selectedProduct.stock));
      }
    }
  }, [productId, selectedProduct]);

  if (!isOpen) return null;

  const totalSale = (unitPrice || 0) * (quantity || 1);
  const totalCost = selectedProduct ? selectedProduct.costPrice * quantity : 0;
  const estimatedProfit = totalSale - totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (quantity > selectedProduct.stock) {
      setFeedback({
        type: 'error',
        message: `La cantidad supera el stock disponible (${selectedProduct.stock})`,
      });
      return;
    }

    const res = recordSale({
      productId: selectedProduct.id,
      quantity,
      unitSalePrice: unitPrice,
      clientName: clientName || 'Cliente de Salón',
      clientDocument,
      paymentMethod,
      notes,
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setFeedback(null);
        onClose();
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${styles.bgCard}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-luxury font-bold">
              Registrar Venta de Joyería
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product selector */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-400">
              Seleccionar Pieza del Catálogo
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={`w-full text-xs px-3 py-2.5 rounded-xl border font-medium ${styles.inputBg}`}
              required
            >
              {availableProducts.length === 0 ? (
                <option value="">No hay piezas disponibles en inventario</option>
              ) : (
                availableProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.sku}] — {p.metal} (Stock: {p.stock}) — {formatPrice(p.salePrice)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Selected Product Quick Info */}
          {selectedProduct && (
            <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/50 flex items-center gap-3">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-12 h-12 rounded-lg object-cover border border-neutral-700"
              />
              <div className="text-xs min-w-0">
                <p className="font-semibold text-neutral-200 truncate">{selectedProduct.name}</p>
                <p className="text-neutral-400 text-[11px] font-mono">
                  Gema: {selectedProduct.gemstone} • {selectedProduct.weightGrams}g
                </p>
                <p className="text-amber-400 font-bold text-xs mt-0.5">
                  Stock disponible: {selectedProduct.stock} unidades
                </p>
              </div>
            </div>
          )}

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Cantidad a Vender
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.stock || 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Precio Unitario Acordado ($ USD)
              </label>
              <input
                type="number"
                min="1"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Nombre del Cliente
              </label>
              <input
                type="text"
                placeholder="Ej. Sofía Benítez"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Documento / Pasaporte (Opcional)
              </label>
              <input
                type="text"
                placeholder="DNI / PAS-12345"
                value={clientDocument}
                onChange={(e) => setClientDocument(e.target.value)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Payment Method & Seller attribution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              >
                <option value="Tarjeta de Crédito">Tarjeta de Crédito / Débito</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                <option value="Efectivo">Efectivo en Bóveda</option>
                <option value="Cripto / USDT">Cripto / USDT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Vendedor Responsable
              </label>
              <input
                type="text"
                readOnly
                value={`${currentUser.name} (${currentUser.roleTitle})`}
                className="w-full text-xs px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Sale Notes */}
          <div>
            <label className="block text-xs font-semibold mb-1 text-neutral-400">
              Notas de la Venta (Garantía, empaque, grabado)
            </label>
            <input
              type="text"
              placeholder="Ej. Anillo con grabado interior 'Para siempre', certificado entregado"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
            />
          </div>

          {/* Total Summary Strip */}
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/70 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400 block">Total a Cobrar ({currency}):</span>
              <span className="text-lg font-luxury font-bold text-amber-400">
                {formatPrice(totalSale)}
              </span>
            </div>
            {currentUser.permissions.canViewCostsAndMargins && (
              <div className="text-right">
                <span className="text-neutral-400 block">Ganancia Neta ({currency}):</span>
                <span className="font-semibold text-emerald-400">
                  +{formatPrice(estimatedProfit)}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={availableProducts.length === 0}
              className={`px-5 py-2 rounded-xl text-xs font-semibold ${styles.buttonPrimary} disabled:opacity-50`}
            >
              Confirmar & Descontar Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
