import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { JewelryProduct, ProductCategory, MetalType } from '../types/jewelry';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: JewelryProduct | null;
}

const PRESET_JEWELRY_IMAGES = [
  { label: 'Anillo Diamante Solitario', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Collar Esmeralda Real', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Pulsera Tennis Brillantes', url: 'https://images.unsplash.com/photo-1611591475850-25096a6f1993?w=800&auto=format&fit=crop&q=80' },
  { label: 'Reloj Cronógrafo Platino', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80' },
  { label: 'Aretes Perlas Mares Sur', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sortija Zafiro Ceilán', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dije Cruz Filigrana Oro', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80' },
  { label: 'Brazalete Plata 925 Rodio', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, theme, currency, formatPrice } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [sku, setSku] = useState(productToEdit?.sku || `JW-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'anillos');
  const [metal, setMetal] = useState<MetalType>(productToEdit?.metal || 'Oro 18k Amarillo');
  const [weightGrams, setWeightGrams] = useState(productToEdit?.weightGrams || 5.0);
  const [gemstone, setGemstone] = useState(productToEdit?.gemstone || 'Diamante Natural');
  const [carat, setCarat] = useState(productToEdit?.carat || 0.5);
  const [stock, setStock] = useState(productToEdit?.stock ?? 1);
  const [minStockAlert, setMinStockAlert] = useState(productToEdit?.minStockAlert ?? 1);
  const [costPrice, setCostPrice] = useState(productToEdit?.costPrice || 1000);
  const [salePrice, setSalePrice] = useState(productToEdit?.salePrice || 2200);
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || PRESET_JEWELRY_IMAGES[0].url);
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [certification, setCertification] = useState(productToEdit?.certification || 'GIA-Certificado');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        sku,
        name: name.trim(),
        category,
        metal,
        weightGrams: Number(weightGrams),
        gemstone: gemstone.trim(),
        carat: Number(carat),
        stock: Number(stock),
        minStockAlert: Number(minStockAlert),
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        certification: certification.trim(),
      });
    } else {
      addProduct({
        sku,
        name: name.trim(),
        category,
        metal,
        weightGrams: Number(weightGrams),
        gemstone: gemstone.trim(),
        carat: Number(carat),
        stock: Number(stock),
        minStockAlert: Number(minStockAlert),
        costPrice: Number(costPrice),
        salePrice: Number(salePrice),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        certification: certification.trim(),
      });
    }

    onClose();
  };

  const calculatedProfit = salePrice - costPrice;
  const calculatedMargin = salePrice > 0 ? ((calculatedProfit / salePrice) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-8 ${styles.bgCard}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-luxury font-bold">
              {productToEdit ? 'Modificar Joya en Inventario' : 'Ingresar Nueva Joya al Inventario'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: SKU & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Código SKU
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                placeholder="AN-ORO-001"
                className={`w-full text-xs font-mono px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Nombre de la Joya / Modelo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Anillo Solitario Éternité Oro 18k"
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Row 2: Category & Metal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Categoría de Joyería
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              >
                <option value="anillos">Anillos & Alianzas</option>
                <option value="collares">Collares & Gargantillas</option>
                <option value="pulseras">Pulseras & Brazaletes</option>
                <option value="aretes">Aretes & Pendientes</option>
                <option value="relojes">Relojes de Alta Gama</option>
                <option value="dijes">Dijes & Colgantes</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Metal Precioso / Pureza
              </label>
              <select
                value={metal}
                onChange={(e) => setMetal(e.target.value as MetalType)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              >
                <option value="Oro 24k">Oro 24k (Puro 99.9%)</option>
                <option value="Oro 18k Amarillo">Oro 18k Amarillo (Ley 750)</option>
                <option value="Oro 18k Blanco">Oro 18k Blanco</option>
                <option value="Oro Rosa 18k">Oro Rosa 18k</option>
                <option value="Platino 950">Platino 950 Macizo</option>
                <option value="Plata Esterlina 925">Plata Esterlina 925</option>
              </select>
            </div>
          </div>

          {/* Row 3: Weight, Gemstone, Carats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Peso en Gramos (g)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={weightGrams}
                onChange={(e) => setWeightGrams(parseFloat(e.target.value) || 0)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Gema Principal / Piedras
              </label>
              <input
                type="text"
                value={gemstone}
                onChange={(e) => setGemstone(e.target.value)}
                placeholder="Diamante, Esmeralda, Zafiro..."
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Quilates (ct)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={carat}
                onChange={(e) => setCarat(parseFloat(e.target.value) || 0)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Row 4: Stock & Min Stock Alert */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Stock Inicial en Bóveda / Vitrina
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Alerta de Stock Crítico (Reorden)
              </label>
              <input
                type="number"
                min="1"
                value={minStockAlert}
                onChange={(e) => setMinStockAlert(parseInt(e.target.value, 10) || 1)}
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Row 5: Financials: Cost, Sale Price & Margin Preview */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Configuración de Precios & Margen Operativo
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-400">
                  Costo de Compra ($ USD base)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
                />
                <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">
                  Equivalente en {currency}: <strong className="text-neutral-200">{formatPrice(costPrice)}</strong>
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-neutral-400">
                  PVP Venta al Público ($ USD base)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={salePrice}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
                />
                <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">
                  Equivalente en {currency}: <strong className="text-amber-400">{formatPrice(salePrice)}</strong>
                </span>
              </div>
            </div>

            {/* Live Margin Calculation */}
            <div className="flex items-center justify-between text-xs pt-1 px-1 text-neutral-300">
              <span>Ganancia Estimada por Unidad ({currency}):</span>
              <span className="font-bold text-emerald-400 font-mono">
                {formatPrice(calculatedProfit)} ({calculatedMargin}%)
              </span>
            </div>
          </div>

          {/* Row 6: Image URL and quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Fotografía de la Joya (URL)
              </label>
              <span className="text-[11px] text-neutral-500">Seleccionar presets:</span>
            </div>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_JEWELRY_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                    imageUrl === preset.url
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7: Description & Certificate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Certificado Gemológico / Trazabilidad
              </label>
              <input
                type="text"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
                placeholder="Ej. GIA-18293, IGI o Joyero Oficial"
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-400">
                Descripción / Notas Técnicas
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Montura, talla de diamante, detalles de orfebrería"
                className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-semibold ${styles.buttonPrimary}`}
            >
              {productToEdit ? 'Guardar Cambios' : 'Ingresar Joya a Bóveda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
