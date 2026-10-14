import React from 'react';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';
import { JewelryProduct } from '../types/jewelry';
import { useJewelry } from '../context/JewelryContext';

interface JewelryTagModalProps {
  product: JewelryProduct | null;
  onClose: () => void;
}

export const JewelryTagModal: React.FC<JewelryTagModalProps> = ({ product, onClose }) => {
  const { formatPrice, currency } = useJewelry();
  if (!product) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-luxury font-bold text-neutral-300">
            Etiqueta Holográfica & Certificado de Bóveda
          </span>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Jewelry Label Card */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-full bg-[#141414] border-2 border-amber-500/50 rounded-xl p-5 shadow-2xl relative overflow-hidden">
            {/* Top gold bar */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-amber-400 font-luxury font-bold tracking-widest text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                AURA HAUTE JOAILLERIE
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {product.certification || 'CERT-AUTÉNTICO'}
              </span>
            </div>

            {/* Product details */}
            <div className="space-y-1.5 text-xs">
              <h3 className="font-luxury font-bold text-neutral-100 text-sm">
                {product.name}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-400 pt-1">
                <div>
                  <span className="text-neutral-500 block">Metal:</span>
                  <span className="font-semibold text-neutral-200">{product.metal}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Peso Neto:</span>
                  <span className="font-semibold text-neutral-200">{product.weightGrams} g</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Gema:</span>
                  <span className="font-semibold text-neutral-200">{product.gemstone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Quilates:</span>
                  <span className="font-semibold text-neutral-200">{product.carat ? `${product.carat} ct` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Price & Barcode */}
            <div className="mt-4 pt-3 border-t border-dashed border-neutral-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-mono">
                  PVP Oficial ({currency})
                </span>
                <span className="text-xl font-luxury font-bold text-amber-400">
                  {formatPrice(product.salePrice)}
                </span>
              </div>

              {/* Barcode representation */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-neutral-400">
                  <QrCode className="w-5 h-5 text-neutral-400" />
                  <span className="font-mono text-xs font-bold tracking-wider text-neutral-200">
                    {product.sku}
                  </span>
                </div>
                {/* Visual barcode stripes */}
                <div className="flex items-center gap-[2px] h-4 mt-1">
                  {[4, 2, 5, 2, 6, 3, 2, 5, 3, 6, 2, 4, 3, 5, 2, 4, 6].map((h, i) => (
                    <div
                      key={i}
                      className="bg-neutral-300 w-[2px] rounded-sm"
                      style={{ height: `${h * 2.5}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2 text-xs font-medium text-neutral-400 border border-neutral-800 rounded-xl hover:text-white"
            >
              Cerrar
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-2 text-xs font-semibold bg-amber-500 text-neutral-950 rounded-xl hover:bg-amber-400 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimir Etiqueta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
