import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Tag,
  Edit2,
  Trash2,
  ShoppingCart,
  LayoutGrid,
  List,
  AlertCircle,
  Gem,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { JewelryProduct, ProductCategory, MetalType } from '../types/jewelry';
import { useJewelry } from '../context/JewelryContext';
import { getThemeClasses } from '../utils/themeStyles';
import { ProductFormModal } from './ProductFormModal';
import { JewelryTagModal } from './JewelryTagModal';

interface InventoryManagerProps {
  onOpenNewSale: (productId?: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ onOpenNewSale }) => {
  const { products, deleteProduct, currentUser, theme, formatPrice, currency } = useJewelry();
  const styles = getThemeClasses(theme.mode, theme.accent);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<JewelryProduct | null>(null);
  const [productForTag, setProductForTag] = useState<JewelryProduct | null>(null);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gemstone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.certification && p.certification.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesMetal = selectedMetal === 'all' || p.metal === selectedMetal;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'disponible' && p.stock > p.minStockAlert) ||
        (selectedStatus === 'bajo_stock' && p.stock > 0 && p.stock <= p.minStockAlert) ||
        (selectedStatus === 'agotado' && p.stock <= 0);

      return matchesSearch && matchesCategory && matchesMetal && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedMetal, selectedStatus]);

  const handleEdit = (product: JewelryProduct) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleCreate = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar "${name}" del inventario de la joyería?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar - Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-luxury font-bold tracking-tight">
            Catálogo & Bóveda
          </h1>
          <p className={`text-xs mt-0.5 ${styles.textMuted}`}>
            {filteredProducts.length} de {products.length} piezas • Precios exhibidos en {currency}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-neutral-800/80 p-0.5 bg-neutral-900/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? styles.badgeAccent : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista cuadrícula"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? styles.badgeAccent : 'text-neutral-400 hover:text-white'
              }`}
              title="Vista lista de auditoría"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Product Button (Admin only) */}
          {currentUser.permissions.canAddEditProducts ? (
            <button
              onClick={handleCreate}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${styles.buttonPrimary} shadow-sm`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Joya</span>
            </button>
          ) : (
            <div className="text-[11px] px-3 py-1.5 rounded-xl border border-neutral-800 text-neutral-400 bg-neutral-900/30">
              Modo Solo Ventas
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar - Sleek & Modern */}
      <div className={`p-3 rounded-2xl border ${styles.bgCard}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por joya, SKU, gema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-8 pr-3 py-2 rounded-xl border ${styles.inputBg}`}
            />
          </div>

          {/* Category Filter */}
          <select
            aria-label="Filtrar por categoría"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
          >
            <option value="all">Todas las Categorías</option>
            <option value="anillos">Anillos & Solitarios</option>
            <option value="collares">Collares & Gargantillas</option>
            <option value="pulseras">Pulseras & Tennis</option>
            <option value="aretes">Aretes & Pendientes</option>
            <option value="relojes">Relojes de Platino</option>
            <option value="dijes">Dijes & Colgantes</option>
          </select>

          {/* Metal Filter */}
          <select
            aria-label="Filtrar por metal"
            value={selectedMetal}
            onChange={(e) => setSelectedMetal(e.target.value)}
            className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
          >
            <option value="all">Todos los Metales</option>
            <option value="Oro 24k">Oro 24k Puro</option>
            <option value="Oro 18k Amarillo">Oro 18k Amarillo</option>
            <option value="Oro 18k Blanco">Oro 18k Blanco</option>
            <option value="Oro Rosa 18k">Oro Rosa 18k</option>
            <option value="Platino 950">Platino 950</option>
            <option value="Plata Esterlina 925">Plata Esterlina 925</option>
          </select>

          {/* Stock Status Filter */}
          <select
            aria-label="Filtrar por estado de stock"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`w-full text-xs px-3 py-2 rounded-xl border ${styles.inputBg}`}
          >
            <option value="all">Todos los Estados</option>
            <option value="disponible">En Stock</option>
            <option value="bajo_stock">Bajo Stock</option>
            <option value="agotado">Agotados</option>
          </select>
        </div>
      </div>

      {/* Inventory Products: Modern Grid View */}
      {viewMode === 'grid' ? (
        filteredProducts.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${styles.bgCard}`}>
            <Gem className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
            <p className="text-xs font-semibold text-neutral-300">
              No se encontraron piezas con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isLow = product.stock > 0 && product.stock <= product.minStockAlert;
              const isOut = product.stock <= 0;
              const profitMargin =
                product.salePrice > 0
                  ? (((product.salePrice - product.costPrice) / product.salePrice) * 100).toFixed(0)
                  : '0';

              return (
                <div
                  key={product.id}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    styles.bgCard
                  } ${styles.bgCardHover} group hover:shadow-lg`}
                >
                  {/* Clean Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      loading="lazy"
                    />

                    {/* Minimalist Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-950/80 text-neutral-300 border border-neutral-800 backdrop-blur-md">
                        {product.sku}
                      </span>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      {isOut ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-950/90 text-red-400 border border-red-500/30 backdrop-blur-md">
                          Agotado
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-950/90 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                          Últimas {product.stock}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-950/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Micro specs overlay */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 text-[10px] font-mono text-neutral-300 flex justify-between bg-neutral-950/70 backdrop-blur-md px-2 py-0.5 rounded-md">
                      <span>{product.metal}</span>
                      <span>{product.weightGrams}g</span>
                    </div>
                  </div>

                  {/* Body Content - Minimalist typography */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-luxury font-bold text-sm tracking-wide line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 font-light">
                        {product.gemstone} • {product.description}
                      </p>
                    </div>

                    {/* Price and Profit Section */}
                    <div className="pt-2 border-t border-neutral-800/60">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono block">
                            PVP ({currency})
                          </span>
                          <span className="text-base font-luxury font-bold text-amber-400">
                            {formatPrice(product.salePrice)}
                          </span>
                        </div>

                        {currentUser.permissions.canViewCostsAndMargins && (
                          <div className="text-right">
                            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono block">
                              Margen
                            </span>
                            <span className="text-xs font-mono font-semibold text-emerald-400">
                              +{profitMargin}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Clean Action Buttons */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          disabled={product.stock <= 0}
                          onClick={() => onOpenNewSale(product.id)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                            product.stock <= 0
                              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                              : `${styles.buttonPrimary}`
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Vender</span>
                        </button>

                        <button
                          onClick={() => setProductForTag(product)}
                          className="py-1.5 px-2 rounded-xl text-xs font-medium border border-neutral-700/80 bg-neutral-800/40 text-neutral-300 hover:text-white hover:border-neutral-600 flex items-center justify-center gap-1 transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          <span>Etiqueta</span>
                        </button>
                      </div>

                      {/* Admin micro links */}
                      {currentUser.permissions.canAddEditProducts && (
                        <div className="mt-2 pt-2 border-t border-neutral-800/40 flex items-center justify-between text-[10px] text-neutral-400">
                          <button
                            onClick={() => handleEdit(product)}
                            className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> Editar
                          </button>
                          {currentUser.permissions.canDeleteProducts && (
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-2.5 h-2.5" /> Eliminar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Minimalist Table View */
        <div className={`rounded-2xl border overflow-x-auto ${styles.bgCard}`}>
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-900/50 uppercase font-mono text-[10px] text-neutral-400">
              <tr>
                <th className="py-3 px-4">Joya</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Metal</th>
                <th className="py-3 px-4">Gemas & Quilates</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">PVP ({currency})</th>
                {currentUser.permissions.canViewCostsAndMargins && (
                  <>
                    <th className="py-3 px-4">Costo ({currency})</th>
                    <th className="py-3 px-4">Margen</th>
                  </>
                )}
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {filteredProducts.map((p) => {
                const margin =
                  p.salePrice > 0
                    ? (((p.salePrice - p.costPrice) / p.salePrice) * 100).toFixed(0)
                    : '0';

                return (
                  <tr key={p.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="py-2.5 px-4 font-medium flex items-center gap-2.5">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-8 h-8 rounded-lg object-cover border border-neutral-800 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-neutral-200">{p.name}</div>
                        <div className="text-[10px] text-neutral-500">{p.category}</div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-neutral-400">{p.sku}</td>
                    <td className="py-2.5 px-4 text-neutral-300">{p.metal}</td>
                    <td className="py-2.5 px-4 text-neutral-400">
                      {p.gemstone} {p.carat ? `(${p.carat}ct)` : ''}
                    </td>
                    <td className="py-2.5 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock <= 0
                            ? 'bg-rose-500/20 text-rose-400'
                            : p.stock <= p.minStockAlert
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-luxury font-bold text-amber-400">
                      {formatPrice(p.salePrice)}
                    </td>
                    {currentUser.permissions.canViewCostsAndMargins && (
                      <>
                        <td className="py-2.5 px-4 text-neutral-400 font-mono">
                          {formatPrice(p.costPrice)}
                        </td>
                        <td className="py-2.5 px-4 text-emerald-400 font-mono font-medium">
                          +{margin}%
                        </td>
                      </>
                    )}
                    <td className="py-2.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onOpenNewSale(p.id)}
                        disabled={p.stock <= 0}
                        className="p-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-amber-400 disabled:opacity-30"
                        title="Vender pieza"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProductForTag(p)}
                        className="p-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                        title="Imprimir etiqueta"
                      >
                        <Tag className="w-3.5 h-3.5" />
                      </button>
                      {currentUser.permissions.canAddEditProducts && (
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-amber-400"
                          title="Editar joya"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Security Tag Modal */}
      <JewelryTagModal
        product={productForTag}
        onClose={() => setProductForTag(null)}
      />
    </div>
  );
};
