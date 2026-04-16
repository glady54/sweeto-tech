import React, { useState } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Plus, Package, Trash2, Edit, AlertCircle, CheckCircle2, Image as ImageIcon, X, Sparkles, Loader2, Check } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';
import { generateAIProductDescription } from '../../utils/aiService';

const ProductManagerPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, formatPrice, currencySymbol, storeSettings } = useStoreData();
  const { t } = useAdminLocale();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    status: 'active',
    description: '',
    image: '',
    originalPrice: '',
    additionalImages: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
        setError('');
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Please try another one.");
      }
    }
  };

  const handleAdditionalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.additionalImages?.length >= 3) {
        setError('You can only upload up to 3 additional images.');
        return;
      }
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, additionalImages: [...(prev.additionalImages || []), compressedBase64] }));
        setError('');
      } catch (err) {
        console.error("Error processing additional image:", err);
        setError("Failed to process image. Please try another one.");
      }
    }
  };

  const removeAdditionalImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', categoryId: '', status: 'active', description: '', image: '', originalPrice: '', additionalImages: [] });
    setError('');
    setSuccess('');
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price || '',
      categoryId: product.categoryId || '',
      status: product.status || 'active',
      description: product.description || '',
      image: product.image || '',
      originalPrice: product.originalPrice || ''
    });
    setEditingProduct(product);
    setError('');
    setSuccess('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', categoryId: '', status: 'active', description: '', image: '', originalPrice: '' });
    setError('');
    setSuccess('');
    setAiSuggestion('');
  };

  const handleAIGenerate = async () => {
    if (!storeSettings?.geminiApiKey) {
      setError("AI Configuration Required: Please add your Gemini API Key in Store Settings first.");
      // Scroll to the error message
      const errorEl = document.getElementById('ai-error-anchor');
      if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!formData.image) {
      setError("Image Required: Please upload a product image first so the AI can analyze it.");
      return;
    }

    setIsGeneratingAI(true);
    setError('');
    setAiSuggestion('');

    try {
      const description = await generateAIProductDescription(
        formData.image,
        storeSettings.geminiApiKey,
        storeSettings.adminLanguage || 'en',
        { name: formData.name }
      );
      setAiSuggestion(description);
    } catch (err) {
      console.error("AI Generation failed:", err);
      if (err.message === 'MISSING_API_KEY') {
        setError("AI Configuration Required: Please add your Gemini API Key in Store Settings first.");
        return;
      }
      if (err.message === 'INVALID_API_KEY') {
        setError("Invalid API key. Please check your Store Settings and ensure your Gemini API key is active.");
        return;
      }
      if (err.message === 'AI_QUOTA_EXCEEDED') {
        setError("AI Quote exceeded. Please try again in 60 seconds.");
        return;
      }
      if (err.message === 'AI_SAFETY_BLOCK') {
        setError("The AI could not generate a description for this image due to safety policies.");
        return;
      }
      if (err.message === 'AI_MODEL_OVERLOADED') {
        setError("The AI model is currently busy. Please wait a few seconds and try again.");
        return;
      }
      if (err.message === 'AI_MODEL_NOT_FOUND') {
        setError("AI Model Configuration Error: The specified Gemini model version is not available for your API key. Please check your browser console for 'Available Models' and verify your setup in Google AI Studio.");
        return;
      }
      if (err.message.startsWith('AI_GEN_ERROR:')) {
        const detail = err.message.replace('AI_GEN_ERROR: ', '');
        setError(`AI Service Error: ${detail}`);
        return;
      }
      
      setError(`AI Generation failed: ${err.message || 'Unknown error'}. Please check your connection or try again later.`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applyAISuggestion = () => {
    setFormData(prev => ({ ...prev, description: aiSuggestion }));
    setAiSuggestion('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || formData.price === '' || !formData.categoryId) {
      setError('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    if (Number(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setSuccess('Product listing updated successfully!');
    } else {
      // For NEW products added here, we start them with 1 stock so they can be managed in Stock Management
      payload.stockQuantity = 1;
      payload.lowStockThreshold = 5;
      addProduct(payload);
      setSuccess('Product added successfully with 1 initial stock!');
    }

    setTimeout(() => {
      closeForm();
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-500 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">{t('productManagement')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
            <span className="w-8 h-px bg-blue-600 mr-2"></span>
            Manage storefront listings
          </p>
        </div>
        {!showForm && (
          <button
            onClick={openAddForm}
            className="flex items-center px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 dark:shadow-none hover:-translate-y-1"
          >
            <Plus size={20} className="mr-3" />
            {t('addProduct')}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-slate-800 p-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center uppercase italic">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg shadow-blue-200 dark:shadow-none">
                {editingProduct ? <Edit size={24} /> : <Plus size={24} />}
              </div>
              {editingProduct ? `Edit Web Listing: ${editingProduct.name}` : 'Create New Product'}
            </h2>
            <button onClick={closeForm} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-100 dark:bg-slate-800 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. MacBook Pro M3"
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="price">Price ({currencySymbol}) *</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="originalPrice">Original Price (Optional)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    id="originalPrice"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 599.99"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="categoryId">Category *</label>
                   <select
                    name="categoryId"
                    id="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Status</label>
                  <div className="flex gap-4">
                    {['active', 'draft'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, status }))}
                        className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all capitalize font-black tracking-widest text-xs ${formData.status === status
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-lg shadow-blue-500/10'
                            : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-gray-400 dark:text-slate-600 hover:border-gray-200 dark:hover:border-slate-700'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="image">Product Image</label>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                    <input
                      type="text"
                      name="image"
                      id="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Image URL or upload"
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center shrink-0 hover:-rotate-6">
                    <Plus size={24} />
                    <input
                      type="file"
                      id="productImageUpload"
                      name="productImageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1">Additional Images (Max 3)</label>
                <div className="flex gap-4 flex-wrap">
                  {formData.additionalImages?.map((imgStr, idx) => (
                    <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-slate-800">
                      <img src={imgStr} className="w-full h-full object-cover" alt={`Additional ${idx+1}`} />
                      <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full items-center justify-center backdrop-blur-sm">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(!formData.additionalImages || formData.additionalImages.length < 3) && (
                    <label className="cursor-pointer w-24 h-24 flex items-center justify-center flex-col bg-gray-50 dark:bg-slate-950/50 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-gray-400 hover:text-blue-600">
                      <Plus size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Add More</span>
                      <input id="additionalImageUpload" name="additionalImageUpload" type="file" className="hidden" accept="image/*" onChange={handleAdditionalImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2 ml-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500" htmlFor="description">Description</label>
                  <button 
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isGeneratingAI}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border transition-all ${
                      isGeneratingAI 
                      ? 'bg-indigo-50 dark:bg-indigo-900/10 text-indigo-400 border-indigo-100 dark:border-indigo-900/30 cursor-not-allowed'
                      : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 hover:shadow-lg shadow-indigo-500/20 active:scale-95'
                    } disabled:opacity-50`}
                  >
                    {isGeneratingAI ? (
                      <><Loader2 size={12} className="animate-spin" /> ANALYZING IMAGE...</>
                    ) : (
                      <><Sparkles size={12} className="animate-pulse" /> MAGIC DESCRIBE</>
                    )}
                  </button>
                </div>
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell customers about this product..."
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none resize-none text-gray-900 dark:text-white font-medium mb-4"
                ></textarea>

                {/* AI Suggestion Area */}
                {aiSuggestion && (
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30 rounded-2xl p-6 mb-4 animate-ai-zoom-in">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center text-indigo-700 dark:text-indigo-400 gap-2">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Suggested Description</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setAiSuggestion('')}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-6 italic">
                      "{aiSuggestion}"
                    </p>
                    <button
                      type="button"
                      onClick={applyAISuggestion}
                      className="w-full py-3 bg-white dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                    >
                      <Check size={14} className="group-hover:scale-125 transition-transform" /> 
                      Apply Suggestion
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col space-y-4">
                <button
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-600/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  {editingProduct ? 'Update Storefront Listing' : 'Confirm & Save Product'}
                </button>

                {error && (
                  <div id="ai-error-anchor" className="flex items-center text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20 animate-shake">
                    <AlertCircle size={18} className="mr-3 shrink-0" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/20">
                    <CheckCircle2 size={18} className="mr-3 shrink-0" />
                    {success}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-50 dark:bg-slate-950 rounded-2xl mb-5 overflow-hidden border border-gray-100 dark:border-slate-800/50">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-slate-800">
                    <Package size={60} strokeWidth={1} />
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] uppercase font-black tracking-widest shadow-lg ${product.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                  }`}>
                  {product.status}
                </div>
              </div>
              <div className="flex justify-between items-start mb-4 px-1 flex-grow">
                <div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {product.categoryId ? (categories.find(c => c.id.toString() === product.categoryId.toString())?.name || 'Uncategorized') : 'No Category Setup'}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
                    Stock: {product.stockQuantity || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-blue-600 dark:text-blue-400 text-lg font-mono tracking-tighter">{formatPrice(product.price)}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50 dark:border-slate-800">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-grow flex items-center justify-center py-3.5 px-4 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-white dark:text-blue-400 border border-blue-200 hover:border-blue-600 hover:bg-blue-600 dark:border-blue-900/50 dark:hover:bg-blue-600 rounded-xl transition-all"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Listing
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="px-4 flex items-center justify-center py-3.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-red-50 dark:border-red-900/20"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-3xl p-20 text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
            <div className="p-8 bg-gray-50 dark:bg-slate-950 rounded-full w-fit mx-auto mb-6">
              <Package size={80} strokeWidth={1} className="text-gray-200 dark:text-slate-850" />
            </div>
            <h3 className="text-2xl font-black text-gray-700 dark:text-white uppercase tracking-tight italic">No Storefront Items</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-3 font-medium">
              Start by adding an item or defining your physical inventory first in the Stock Management page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagerPage;
