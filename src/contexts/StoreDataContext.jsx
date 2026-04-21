import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const StoreDataContext = createContext();

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) throw new Error('useStoreData must be used within a StoreDataProvider');
  return context;
};

const DEFAULT_SETTINGS = {
  shopName: 'Sweeto-Tech',
  shopLogo: '',
  defaultLanguage: 'en',
  adminLanguage: 'en',
  defaultCurrency: 'XOF',
  contactEmail: 'admin@sweeto-tech.com',
  storeTagline: 'Your trusted electronics destination',
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  whatsappNumber: '',
  shopPhone: '+1-800-SWEETO',
  shopAddress: '123 Tech Street, Silicon Valley, CA',
  facebookUrl: '#',
  instagramUrl: '#',
  twitterUrl: '#'
};

export const StoreDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockAdjustments, setStockAdjustments] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [visits, setVisits] = useState([]);
  const [videoAds, setVideoAds] = useState([]);
  const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // ─── INITIAL FETCH & REAL-TIME LISTENERS ────────────────────────────────────
  useEffect(() => {
    // Helper to fetch initial data for a table
    const fetchInitialData = async () => {
      try {
        const [
          { data: p }, 
          { data: c }, 
          { data: s }, 
          { data: sa }, 
          { data: v }, 
          { data: va }, 
          { data: settings }
        ] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*'),
          supabase.from('sales_records').select('*'),
          supabase.from('stock_adjustments').select('*'),
          supabase.from('visits').select('*'),
          supabase.from('video_ads').select('*'),
          supabase.from('store_settings').select('*').eq('id', 'main').single()
        ]);

        if (p) setProducts(p);
        if (c) setCategories(c);
        if (s) setSalesRecords(s);
        if (sa) setStockAdjustments(sa);
        if (v) setVisits(v);
        if (va) setVideoAds(va);
        if (settings) {
          setStoreSettings({ ...DEFAULT_SETTINGS, ...settings.settings });
        } else {
          // Initialize settings if not exists
          await supabase.from('store_settings').upsert({ id: 'main', settings: DEFAULT_SETTINGS });
        }
        setLoading(false);
      } catch (err) {
        console.error('Initial fetch failed', err);
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up Realtime Subscriptions
    const channels = [
      supabase.channel('products-db').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        if (payload.eventType === 'INSERT') setProducts(prev => [...prev, payload.new]);
        if (payload.eventType === 'UPDATE') setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        if (payload.eventType === 'DELETE') setProducts(prev => prev.filter(p => p.id === payload.old.id));
      }).subscribe(),

      supabase.channel('categories-db').on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, payload => {
        if (payload.eventType === 'INSERT') setCategories(prev => [...prev, payload.new]);
        if (payload.eventType === 'UPDATE') setCategories(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
        if (payload.eventType === 'DELETE') setCategories(prev => prev.filter(c => c.id === payload.old.id));
      }).subscribe(),

      supabase.channel('sales-db').on('postgres_changes', { event: '*', schema: 'public', table: 'sales_records' }, payload => {
        if (payload.eventType === 'INSERT') setSalesRecords(prev => [...prev, payload.new]);
        if (payload.eventType === 'DELETE') setSalesRecords(prev => prev.filter(s => s.id === payload.old.id));
      }).subscribe(),

      supabase.channel('adjustments-db').on('postgres_changes', { event: '*', schema: 'public', table: 'stock_adjustments' }, payload => {
        if (payload.eventType === 'INSERT') setStockAdjustments(prev => [...prev, payload.new]);
      }).subscribe(),

      supabase.channel('visits-db').on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, payload => {
        if (payload.eventType === 'INSERT') setVisits(prev => [...prev, payload.new]);
        if (payload.eventType === 'UPDATE') setVisits(prev => prev.map(v => v.id === payload.new.id ? payload.new : v));
      }).subscribe(),

      supabase.channel('video-ads-db').on('postgres_changes', { event: '*', schema: 'public', table: 'video_ads' }, payload => {
        if (payload.eventType === 'INSERT') setVideoAds(prev => [...prev, payload.new]);
        if (payload.eventType === 'DELETE') setVideoAds(prev => prev.filter(v => v.id === payload.old.id));
      }).subscribe(),

      supabase.channel('settings-db').on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'store_settings', filter: 'id=eq.main' }, payload => {
        setStoreSettings({ ...DEFAULT_SETTINGS, ...payload.new.settings });
      }).subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  // ─── PRODUCT ACTIONS ────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    return data;
  };

  const updateProduct = async (id, updates) => {
    const { error } = await supabase.from('products').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  };

  // ─── STOCK ADJUSTMENT ACTIONS ────────────────────────────────────────────────
  const adjustStock = async (productId, type, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const prevStock = product.stock_quantity || 0;
    const newStock = type === 'increase'
      ? prevStock + Number(quantity)
      : prevStock - Number(quantity);
    if (newStock < 0) return;

    // 1. Update Product table
    await updateProduct(productId, { stock_quantity: newStock });

    // 2. Log Adjustment
    const adjustment = {
      product_id: productId,
      product_name: product.name,
      type: type === 'increase' ? 'restock' : 'correction', // mapping increase/decrease to DB enum
      quantity: Number(quantity),
      previous_stock: prevStock,
      new_stock: newStock
    };
    await supabase.from('stock_adjustments').insert([adjustment]);
  };

  // ─── SALES RECORD ACTIONS ────────────────────────────────────────────────────
  const addSaleRecord = async (record) => {
    const saleRecord = {
      product_id: record.productId,
      product_name: record.productName,
      quantity_sold: record.quantitySold,
      sale_date: new Date().toISOString()
    };
    const { error } = await supabase.from('sales_records').insert([saleRecord]);
    if (error) throw error;

    // Adjust stock using the reduction
    await adjustStock(record.productId, 'decrease', record.quantitySold);
  };

  const deleteSaleRecord = async (id) => {
    const { error } = await supabase.from('sales_records').delete().eq('id', id);
    if (error) throw error;
  };

  // ─── CATEGORY ACTIONS ────────────────────────────────────────────────────────
  const addCategory = async (category) => {
    const { data, error } = await supabase.from('categories').insert([category]).select().single();
    if (error) throw error;
    return data;
  };

  const updateCategory = async (id, updates) => {
    const { error } = await supabase.from('categories').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  };

  const deleteCategory = async (id) => {
    const hasProducts = products.some(p => p.category_id === id);
    if (hasProducts) return { success: false, error: 'Cannot delete category with active products' };
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // ─── VIDEO ADS ACTIONS ───────────────────────────────────────────────────────
  const addVideoAd = async (videoAdPayload) => {
    const { data, error } = await supabase.from('video_ads').insert([videoAdPayload]).select().single();
    if (error) throw error;
    return data;
  };

  const updateVideoAd = async (id, updates) => {
    const { error } = await supabase.from('video_ads').update(updates).eq('id', id);
    if (error) throw error;
  };

  const deleteVideoAd = async (id) => {
    const { error } = await supabase.from('video_ads').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  };

  // ─── SETTINGS ACTIONS ────────────────────────────────────────────────────────
  const updateStoreSettings = async (updates) => {
    try {
      const newSettings = { ...storeSettings, ...updates };
      const { error } = await supabase.from('store_settings').update({ settings: newSettings }).eq('id', 'main');
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Failed to update settings', e);
      return false;
    }
  };

  // ─── ANALYTICS (visits written from analyticsService) ────────────────────────
  // Visits are written directly by analyticsService.js using Firestore

  // ─── CURRENCY FORMATTING ─────────────────────────────────────────────────────
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
    if (isNaN(numericAmount)) {
      return currency.position === 'before' ? `${currency.symbol}0` : `0 ${currency.symbol}`;
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
    products, categories, storeSettings, stockAdjustments, salesRecords, visits, videoAds,
    loading,
    addProduct, updateProduct, deleteProduct,
    adjustStock, addSaleRecord, deleteSaleRecord,
    addCategory, updateCategory, deleteCategory,
    addVideoAd, updateVideoAd, deleteVideoAd,
    updateStoreSettings,
    formatPrice, currencySymbol
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};
