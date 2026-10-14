export type ProductCategory = 'anillos' | 'collares' | 'pulseras' | 'aretes' | 'relojes' | 'dijes';

export type MetalType = 
  | 'Oro 24k'
  | 'Oro 18k Amarillo'
  | 'Oro 18k Blanco'
  | 'Oro Rosa 18k'
  | 'Plata Esterlina 925'
  | 'Platino 950';

export interface JewelryProduct {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  metal: MetalType;
  weightGrams: number;
  gemstone: string;
  carat?: number;
  stock: number;
  minStockAlert: number;
  costPrice: number;
  salePrice: number;
  status: 'disponible' | 'bajo_stock' | 'agotado';
  imageUrl: string;
  description: string;
  certification?: string;
  createdAt: string;
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta de Crédito' | 'Transferencia Bancaria' | 'Cripto / USDT';

export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  category: ProductCategory;
  metal: MetalType;
  quantity: number;
  unitCost: number;
  unitSalePrice: number;
  totalSale: number;
  totalCost: number;
  profit: number;
  profitMarginPct: number;
  clientName: string;
  clientDocument?: string;
  paymentMethod: PaymentMethod;
  sellerName: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export type ThemeMode = 'dark' | 'light';
export type AccentColor = 'gold' | 'silver' | 'copper';
export type CurrencyType = 'USD' | 'COP';

export interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  currency: CurrencyType;
  exchangeRateUsdToCop: number;
}

export type UserRole = 'admin' | 'standard';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  permissions: {
    canViewCostsAndMargins: boolean;
    canAddEditProducts: boolean;
    canDeleteProducts: boolean;
    canRegisterSales: boolean;
    canDeleteSales: boolean;
    canExportReports: boolean;
    canEditShowcaseWebsite: boolean;
    canChangeAppearance: boolean;
  };
}

export interface ShowcaseConfig {
  storeName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  phoneWhatsApp: string;
  address: string;
  email: string;
  schedule: string;
  bannerNotice: string;
  showBanner: boolean;
  featuredProductIds: string[];
}
