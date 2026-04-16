import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, doc, getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

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
  const [storeSettings, setStoreSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // ─── REAL-TIME LISTENERS ────────────────────────────────────────────────────
  useEffect(() => {
    const unsubs = [];

    // Products
    unsubs.push(
      onSnapshot(collection(db, 'products'), snap => {
        setProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      })
    );

    // Categories
    unsubs.push(
      onSnapshot(collection(db, 'categories'), snap => {
        setCategories(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      })
    );

    // salesRecords
    unsubs.push(
      onSnapshot(collection(db, 'salesRecords'), snap => {
        setSalesRecords(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      })
    );

    // stockAdjustments
    unsubs.push(
      onSnapshot(collection(db, 'stockAdjustments'), snap => {
        setStockAdjustments(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      })
    );

    // visits
    unsubs.push(
      onSnapshot(collection(db, 'visits'), snap => {
        setVisits(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      })
    );

    // storeSettings (single document)
    unsubs.push(
      onSnapshot(doc(db, 'storeSettings', 'main'), snap => {
        if (snap.exists()) {
          setStoreSettings({ ...DEFAULT_SETTINGS, ...snap.data() });
        } else {
          // Create default settings doc on first run
          setDoc(doc(db, 'storeSettings', 'main'), DEFAULT_SETTINGS);
        }
        setLoading(false);
      })
    );

    return () => unsubs.forEach(u => u());
  }, []);

  // ─── PRODUCT ACTIONS ────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    const now = new Date().toISOString();
    const payload = { ...product, createdAt: now, updatedAt: now };
    // Optimistic — Firestore listener will sync
    const docRef = await addDoc(collection(db, 'products'), payload);
    return { ...payload, id: docRef.id };
  };

  const updateProduct = async (id, updates) => {
    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, 'products', id), { ...updates, updatedAt });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
  };

  // ─── STOCK ADJUSTMENT ACTIONS ────────────────────────────────────────────────
  const adjustStock = async (productId, type, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const prevStock = product.stockQuantity || 0;
    const newStock = type === 'increase'
      ? prevStock + Number(quantity)
      : prevStock - Number(quantity);
    if (newStock < 0) return;

    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, 'products', productId), { stockQuantity: newStock, updatedAt });

    const adjustment = {
      productId,
      productName: product.name,
      type,
      quantity: Number(quantity),
      previousStock: prevStock,
      newStock,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'stockAdjustments'), adjustment);
  };

  // ─── SALES RECORD ACTIONS ────────────────────────────────────────────────────
  const addSaleRecord = async (record) => {
    const saleRecord = { ...record, saleDate: new Date().toISOString() };
    await addDoc(collection(db, 'salesRecords'), saleRecord);
    await adjustStock(record.productId, 'decrease', record.quantitySold);
  };

  // ─── CATEGORY ACTIONS ────────────────────────────────────────────────────────
  const addCategory = async (category) => {
    const now = new Date().toISOString();
    const payload = { ...category, createdAt: now, updatedAt: now };
    const docRef = await addDoc(collection(db, 'categories'), payload);
    return { ...payload, id: docRef.id };
  };

  const updateCategory = async (id, updates) => {
    const updatedAt = new Date().toISOString();
    await updateDoc(doc(db, 'categories', id), { ...updates, updatedAt });
  };

  const deleteCategory = async (id) => {
    const hasProducts = products.some(p => p.categoryId === id);
    if (hasProducts) return { success: false, error: 'Cannot delete category with active products' };
    await deleteDoc(doc(db, 'categories', id));
    return { success: true };
  };

  // ─── SETTINGS ACTIONS ────────────────────────────────────────────────────────
  const updateStoreSettings = async (updates) => {
    try {
      await setDoc(doc(db, 'storeSettings', 'main'), { ...storeSettings, ...updates }, { merge: true });
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
    products, categories, storeSettings, stockAdjustments, salesRecords, visits,
    loading,
    addProduct, updateProduct, deleteProduct,
    adjustStock, addSaleRecord,
    addCategory, updateCategory, deleteCategory,
    updateStoreSettings,
    formatPrice, currencySymbol
  };

  return (
    <StoreDataContext.Provider value={value}>
      {children}
    </StoreDataContext.Provider>
  );
};
