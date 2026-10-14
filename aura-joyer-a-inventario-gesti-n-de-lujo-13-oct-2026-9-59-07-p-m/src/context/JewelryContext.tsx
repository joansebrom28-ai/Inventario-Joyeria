import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  JewelryProduct,
  SaleRecord,
  UserAccount,
  UserRole,
  ShowcaseConfig,
  ThemeSettings,
  ThemeMode,
  AccentColor,
  PaymentMethod,
  CurrencyType,
} from '../types/jewelry';
import { formatCurrencyValue } from '../utils/exportUtils';
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  INITIAL_USERS,
  INITIAL_SHOWCASE,
} from '../data/initialData';

interface JewelryContextType {
  products: JewelryProduct[];
  sales: SaleRecord[];
  users: UserAccount[];
  currentUser: UserAccount;
  showcase: ShowcaseConfig;
  theme: ThemeSettings;
  isOffline: boolean;
  isSimulatedOffline: boolean;
  lastSyncTime: string;
  addProduct: (product: Omit<JewelryProduct, 'id' | 'createdAt' | 'status'>) => void;
  updateProduct: (id: string, updates: Partial<JewelryProduct>) => void;
  deleteProduct: (id: string) => void;
  recordSale: (saleInput: {
    productId: string;
    quantity: number;
    unitSalePrice?: number;
    clientName: string;
    clientDocument?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => { success: boolean; message: string };
  deleteSale: (saleId: string) => void;
  updateShowcase: (updates: Partial<ShowcaseConfig>) => void;
  switchUser: (role: UserRole) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeAccent: (accent: AccentColor) => void;
  currency: CurrencyType;
  exchangeRateCop: number;
  setCurrency: (currency: CurrencyType) => void;
  setExchangeRateCop: (rate: number) => void;
  formatPrice: (amountInUsd: number) => string;
  convertAmount: (amountInUsd: number) => number;
  toggleSimulateOffline: () => void;
  resetToInitialData: () => void;
}

const STORAGE_KEYS = {
  PRODUCTS: 'aura_jewelry_products_v2',
  SALES: 'aura_jewelry_sales_v2',
  SHOWCASE: 'aura_jewelry_showcase_v2',
  THEME: 'aura_jewelry_theme_v2',
  ACTIVE_USER_ROLE: 'aura_jewelry_user_role_v2',
  LAST_SYNC: 'aura_jewelry_last_sync_v2',
  CURRENCY: 'aura_jewelry_currency_v2',
  EXCHANGE_RATE: 'aura_jewelry_exchange_rate_v2',
};

const JewelryContext = createContext<JewelryContextType | undefined>(undefined);

export const JewelryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state with localStorage persistence
  const [products, setProducts] = useState<JewelryProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Sales state with localStorage persistence
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  // Showcase state with localStorage persistence
  const [showcase, setShowcase] = useState<ShowcaseConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOWCASE);
      return saved ? JSON.parse(saved) : INITIAL_SHOWCASE;
    } catch {
      return INITIAL_SHOWCASE;
    }
  });

  // Theme settings with localStorage persistence
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? JSON.parse(saved) : { mode: 'dark', accent: 'gold', currency: 'USD', exchangeRateUsdToCop: 4000 };
    } catch {
      return { mode: 'dark', accent: 'gold', currency: 'USD', exchangeRateUsdToCop: 4000 };
    }
  });

  // Currency selection: USD or COP
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return saved === 'COP' ? 'COP' : 'USD';
    } catch {
      return 'USD';
    }
  });

  // Exchange rate USD to COP (default 4000 COP)
  const [exchangeRateCop, setExchangeRateCopState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
      return saved ? Number(saved) : 4000;
    } catch {
      return 4000;
    }
  });

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  const setExchangeRateCop = (rate: number) => {
    const validRate = rate > 0 ? rate : 4000;
    setExchangeRateCopState(validRate);
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, String(validRate));
  };

  const formatPrice = (amountInUsd: number): string => {
    return formatCurrencyValue(amountInUsd, currency, exchangeRateCop);
  };

  const convertAmount = (amountInUsd: number): number => {
    return currency === 'COP' ? Math.round(amountInUsd * exchangeRateCop) : amountInUsd;
  };

  // User role state
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ROLE);
      return (saved === 'standard' ? 'standard' : 'admin');
    } catch {
      return 'admin';
    }
  });

  // Offline detection & simulation
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  });

  // Network listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(time);
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, time);
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOffline = !isBrowserOnline || isSimulatedOffline;

  // Persist products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Error saving products to localStorage', e);
    }
  }, [products]);

  // Persist sales
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    } catch (e) {
      console.warn('Error saving sales to localStorage', e);
    }
  }, [sales]);

  // Persist showcase
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOWCASE, JSON.stringify(showcase));
    } catch (e) {
      console.warn('Error saving showcase to localStorage', e);
    }
  }, [showcase]);

  // Persist theme & apply to root
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
      
      const root = document.documentElement;
      if (theme.mode === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.style.backgroundColor = '#0a0a0a';
        document.body.style.color = '#f5f5f5';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.style.backgroundColor = '#faf9f6';
        document.body.style.color = '#1c1917';
      }
      
      // Set accent CSS custom properties
      if (theme.accent === 'gold') {
        root.style.setProperty('--accent-primary', '#D4AF37');
        root.style.setProperty('--accent-glow', 'rgba(212, 175, 55, 0.25)');
        root.style.setProperty('--accent-border', 'rgba(212, 175, 55, 0.4)');
      } else if (theme.accent === 'silver') {
        root.style.setProperty('--accent-primary', '#CBD5E1');
        root.style.setProperty('--accent-glow', 'rgba(203, 213, 225, 0.25)');
        root.style.setProperty('--accent-border', 'rgba(203, 213, 225, 0.4)');
      } else if (theme.accent === 'copper') {
        root.style.setProperty('--accent-primary', '#E07A5F');
        root.style.setProperty('--accent-glow', 'rgba(224, 122, 95, 0.25)');
        root.style.setProperty('--accent-border', 'rgba(224, 122, 95, 0.4)');
      }
    } catch (e) {
      console.warn('Error saving theme', e);
    }
  }, [theme]);

  // Persist user role
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, activeRole);
  }, [activeRole]);

  const currentUser = INITIAL_USERS.find((u) => u.role === activeRole) || INITIAL_USERS[0];

  const switchUser = (role: UserRole) => {
    setActiveRole(role);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  const setThemeAccent = (accent: AccentColor) => {
    setTheme((prev) => ({ ...prev, accent }));
  };

  const toggleSimulateOffline = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  const addProduct = (productData: Omit<JewelryProduct, 'id' | 'createdAt' | 'status'>) => {
    const status: JewelryProduct['status'] =
      productData.stock <= 0
        ? 'agotado'
        : productData.stock <= productData.minStockAlert
        ? 'bajo_stock'
        : 'disponible';

    const newProduct: JewelryProduct = {
      ...productData,
      id: `jewel-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status,
    };

    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<JewelryProduct>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // re-eval status based on stock
          if (updated.stock <= 0) {
            updated.status = 'agotado';
          } else if (updated.stock <= updated.minStockAlert) {
            updated.status = 'bajo_stock';
          } else {
            updated.status = 'disponible';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const recordSale = (saleInput: {
    productId: string;
    quantity: number;
    unitSalePrice?: number;
    clientName: string;
    clientDocument?: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): { success: boolean; message: string } => {
    const product = products.find((p) => p.id === saleInput.productId);
    if (!product) {
      return { success: false, message: 'Producto no encontrado' };
    }

    if (product.stock < saleInput.quantity) {
      return {
        success: false,
        message: `Stock insuficiente. Disponible: ${product.stock} unidades.`,
      };
    }

    const salePrice = saleInput.unitSalePrice ?? product.salePrice;
    const totalSale = salePrice * saleInput.quantity;
    const totalCost = product.costPrice * saleInput.quantity;
    const profit = totalSale - totalCost;
    const profitMarginPct = totalSale > 0 ? (profit / totalSale) * 100 : 0;

    const newSale: SaleRecord = {
      id: `sal-${Date.now().toString(36)}`,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      category: product.category,
      metal: product.metal,
      quantity: saleInput.quantity,
      unitCost: product.costPrice,
      unitSalePrice: salePrice,
      totalSale,
      totalCost,
      profit,
      profitMarginPct,
      clientName: saleInput.clientName.trim() || 'Cliente Mostrador',
      clientDocument: saleInput.clientDocument?.trim(),
      paymentMethod: saleInput.paymentMethod,
      sellerName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      notes: saleInput.notes,
    };

    // Update product stock
    const newStock = product.stock - saleInput.quantity;
    updateProduct(product.id, { stock: newStock });

    // Append sale
    setSales((prev) => [newSale, ...prev]);

    return {
      success: true,
      message: `Venta de ${product.name} registrada exitosamente por ${currentUser.name}`,
    };
  };

  const deleteSale = (saleId: string) => {
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const updateShowcase = (updates: Partial<ShowcaseConfig>) => {
    setShowcase((prev) => ({ ...prev, ...updates }));
  };

  const resetToInitialData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSales(INITIAL_SALES);
    setShowcase(INITIAL_SHOWCASE);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.SHOWCASE);
  };

  return (
    <JewelryContext.Provider
      value={{
        products,
        sales,
        users: INITIAL_USERS,
        currentUser,
        showcase,
        theme,
        isOffline,
        isSimulatedOffline,
        lastSyncTime,
        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        deleteSale,
        updateShowcase,
        switchUser,
        setThemeMode,
        setThemeAccent,
        currency,
        exchangeRateCop,
        setCurrency,
        setExchangeRateCop,
        formatPrice,
        convertAmount,
        toggleSimulateOffline,
        resetToInitialData,
      }}
    >
      {children}
    </JewelryContext.Provider>
  );
};

export const useJewelry = () => {
  const context = useContext(JewelryContext);
  if (!context) {
    throw new Error('useJewelry must be used within a JewelryProvider');
  }
  return context;
};
