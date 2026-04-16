import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreDataContext = createContext();

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return context;
};

// In production, use VITE_API_URL env var (e.g. your Render backend URL).
// In development, fall back to the dynamic hostname for local network testing.
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;

export const StoreDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockAdjustments, setStockAdjustments] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [storeSettings, setStoreSettings] = useState({
    shopName: 'Sweeto-Tech',
    shopLogo: '',
    defaultLanguage: 'en',
    adminLanguage: 'en',
    defaultCurrency: 'USD',
    contactEmail: 'admin@sweeto-tech.com',
    storeTagline: 'Your trusted electronics destination',
    geminiApiKey: '',
    whatsappNumber: '',
    shopPhone: '+1-800-SWEETO',
    shopAddress: '123 Tech Street, Silicon Valley, CA',
    facebookUrl: '#',
    instagramUrl: '#',
    twitterUrl: '#'
  });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, setRes, adjRes, salesRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/storeSettings`),
          fetch(`${API_URL}/stockAdjustments`),
          fetch(`${API_URL}/salesRecords`)
        ]);
        
        if (prodRes.ok) setProducts(await prodRes.json());
        if (catRes.ok) setCategories(await catRes.json());
        if (setRes.ok) {
          const settings = await setRes.json();
          // With our restructuring, json-server returns an array or the object with ID 1
          if (Array.isArray(settings) && settings.length > 0) {
            setStoreSettings(settings[0]);
          } else if (settings && settings.id) {
            setStoreSettings(settings);
          }
        }
        if (adjRes.ok) setStockAdjustments(await adjRes.json());
        if (salesRes.ok) setSalesRecords(await salesRes.json());
      } catch (error) {
        console.error("Failed to fetch from Local API", error);
      }
    };
    fetchData();
  }, []);

  // --- PRODUCT ACTIONS ---
  const addProduct = async (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Optimistic UI Update
    setProducts(prev => [...prev, newProduct]);
    
    try {
      await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
    } catch (e) {
      console.error("Failed to add product to API", e);
    }
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    const updatedAt = new Date().toISOString();
    // Optimistic UI Update
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt } : p
    ));

    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, updatedAt })
      });
    } catch (e) {
      console.error("Failed to update product", e);
    }
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete product", e);
    }
  };


  // --- STOCK ADJUSTMENT ACTIONS ---
  const adjustStock = async (productId, type, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const prevStock = product.stockQuantity || 0;
    const newStock = type === 'increase' ? prevStock + Number(quantity) : prevStock - Number(quantity);
    if (newStock < 0) return;

    // Update the product stock
    const updatedAt = new Date().toISOString();
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stockQuantity: newStock, updatedAt } : p));
    try {
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock, updatedAt })
      });
    } catch (e) { console.error('Failed to update product stock', e); }

    // Create adjustment log
    const adjustment = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type,
      quantity: Number(quantity),
      previousStock: prevStock,
      newStock,
      timestamp: new Date().toISOString()
    };
    setStockAdjustments(prev => [...prev, adjustment]);
    try {
      await fetch(`${API_URL}/stockAdjustments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustment)
      });
    } catch (e) { console.error('Failed to log stock adjustment', e); }
  };

  // --- SALES RECORD ACTIONS ---
  const addSaleRecord = async (record) => {
    const saleRecord = {
      ...record,
      id: Date.now().toString(),
      saleDate: new Date().toISOString()
    };

    setSalesRecords(prev => [...prev, saleRecord]);
    try {
      await fetch(`${API_URL}/salesRecords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleRecord)
      });
    } catch (e) { console.error('Failed to add sale record', e); }

    // Auto-deduct stock
    await adjustStock(record.productId, 'decrease', record.quantitySold);
  };


  // --- CATEGORY ACTIONS ---
  const addCategory = async (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCategories(prev => [...prev, newCategory]);
    
    try {
      await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
    } catch (e) {
      console.error("Failed to add category", e);
    }
    return newCategory;
  };

  const updateCategory = async (id, updates) => {
    const updatedAt = new Date().toISOString();
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt } : c
    ));
    
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, updatedAt })
      });
    } catch (e) {
      console.error("Failed to update category", e);
    }
  };

  const deleteCategory = async (id) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) {
      return { success: false, error: 'Cannot delete category with active products' };
    }
    
    setCategories(prev => prev.filter(c => c.id !== id));
    
    try {
      await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Failed to delete category", e);
    }
    return { success: true };
  };


  // --- SETTINGS ACTIONS ---
  const updateStoreSettings = async (updates) => {
    // Merge updates with current settings
    const newSettings = { ...storeSettings, ...updates };
    setStoreSettings(newSettings);
    
    try {
      // Use /storeSettings/1 for reliable persistence with json-server
      const response = await fetch(`${API_URL}/storeSettings/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        return true;
      } else {
        console.error("Server returned error when saving settings:", response.status);
        return false;
      }
    } catch (e) {
      console.error("Failed to update settings", e);
      return false;
    }
  };

  // --- CURRENCY FORMATTING ---
  const currencyMap = {
    USD: { symbol: '$', position: 'before' },
    EUR: { symbol: '€', position: 'before' },
    XOF: { symbol: 'FCFA', position: 'after' },
    GBP: { symbol: '£', position: 'before' }
  };

  const currencySymbol = (currencyMap[storeSettings?.defaultCurrency] || currencyMap.USD).symbol;

  const formatPrice = (amount) => {
    const currency = currencyMap[storeSettings?.defaultCurrency] || currencyMap.USD;
    const numericAmount = Number(amount);
    
    // Safety check for NaN
    if (isNaN(numericAmount)) {
      const fallback = "0";
      return currency.position === 'before' 
        ? `${currency.symbol}${fallback}`
        : `${fallback} ${currency.symbol}`;
    }

    const formattedAmount = numericAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return currency.position === 'before' 
      ? `${currency.symbol}${formattedAmount}`
      : `${formattedAmount} ${currency.symbol}`;
  };

  const value = {
    products,
    categories,
    storeSettings,
    stockAdjustments,
    salesRecords,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    addSaleRecord,
    addCategory,
    updateCategory,
    deleteCategory,
    updateStoreSettings,
    formatPrice,
    currencySymbol
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};
