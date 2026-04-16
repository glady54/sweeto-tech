import React, { useState } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { Settings, Save, Globe, Banknote, Mail, Info, Image as ImageIcon, Plus, Sparkles, ExternalLink, Loader2, MessageSquare, Phone, MapPin, Share2, Camera, MessageCircle } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

const StoreSettingsPage = () => {
  const { storeSettings, updateStoreSettings } = useStoreData();
  const { t } = useAdminLocale();
  
  const [formData, setFormData] = useState({ ...storeSettings });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal form state if store settings load after initial mount
  React.useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      ...storeSettings,
      // Keep unsaved changes if the user already started typing
      ...(Object.keys(formData).some(key => formData[key] !== storeSettings[key]) ? {} : storeSettings)
    }));
  }, [storeSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, shopLogo: compressedBase64 }));
      } catch (err) {
        console.error("Error processing shop logo image:", err);
        setSuccess("Failed to process image. Please try another one.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    setError('');

    const wasSuccessful = await updateStoreSettings(formData);
    
    setIsSaving(false);
    if (wasSuccessful) {
      setSuccess('Settings saved! Please refresh (F5) to ensure all services are updated.');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError('Failed to save settings. Please check your connection and try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto transition-colors duration-500 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight italic uppercase">{t('storeSettings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide flex items-center">
          <span className="w-8 h-px bg-blue-600 mr-2"></span>
          Configure your store identity and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Shop Identity Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Info className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Shop Identity</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="shopName">Shop Name</label>
                <input
                  id="shopName"
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  autoComplete="organization"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="shopLogo">Shop Logo</label>
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-600" size={18} />
                    <input
                      id="shopLogo"
                      type="text"
                      name="shopLogo"
                      value={formData.shopLogo}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white text-sm"
                      placeholder="Logo URL or upload"
                    />
                  </div>
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center shrink-0 hover:-rotate-6">
                    <Plus size={24} />
                    <input 
                      type="file" 
                      id="shopLogoUpload"
                      name="shopLogoUpload"
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="storeTagline">Store Tagline</label>
              <input
                id="storeTagline"
                type="text"
                name="storeTagline"
                value={formData.storeTagline}
                onChange={handleInputChange}
                autoComplete="off"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Regional & Contact Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Globe className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Regional & Contact</h2>
          </div>
          <div className="p-8 space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="defaultCurrency">
                  <Banknote size={14} className="mr-1.5" /> Default Currency
                </label>
                <select
                  id="defaultCurrency"
                  name="defaultCurrency"
                  value={formData.defaultCurrency}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="XOF">XOF - CFA Franc</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="defaultLanguage">
                  <Globe size={14} className="mr-1.5" /> {t('defaultLanguage')}
                </label>
                <select
                  id="defaultLanguage"
                  name="defaultLanguage"
                  value={formData.defaultLanguage}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="adminLanguage">
                  <Globe size={14} className="mr-1.5" /> {t('adminPanelLanguage')}
                </label>
                <select
                  id="adminLanguage"
                  name="adminLanguage"
                  value={formData.adminLanguage}
                  onChange={handleInputChange}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-bold appearance-none"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="contactEmail">
                  <Mail size={14} className="mr-1.5" /> Contact Email
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="whatsappNumber">
                  <MessageSquare size={14} className="mr-1.5" /> WhatsApp Number
                </label>
                <input
                  id="whatsappNumber"
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 2376XXXXXXXX"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="shopPhone">
                  <Phone size={14} className="mr-1.5" /> Support Phone
                </label>
                <input
                  id="shopPhone"
                  type="text"
                  name="shopPhone"
                  value={formData.shopPhone || ''}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="shopAddress">
                  <MapPin size={14} className="mr-1.5" /> Store Address
                </label>
                <input
                  id="shopAddress"
                  type="text"
                  name="shopAddress"
                  value={formData.shopAddress || ''}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Presence Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Share2 className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">Social Presence</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="facebookUrl">
                <MessageCircle size={14} className="mr-1.5" /> Facebook URL
              </label>
              <input
                id="facebookUrl"
                type="text"
                name="facebookUrl"
                value={formData.facebookUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="instagramUrl">
                <Camera size={14} className="mr-1.5" /> Instagram URL
              </label>
              <input
                id="instagramUrl"
                type="text"
                name="instagramUrl"
                value={formData.instagramUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1 flex items-center" htmlFor="twitterUrl">
                <Share2 size={14} className="mr-1.5" /> Twitter / X URL
              </label>
              <input
                id="twitterUrl"
                type="text"
                name="twitterUrl"
                value={formData.twitterUrl || ''}
                onChange={handleInputChange}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>
        
        {/* AI Configuration Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="px-8 py-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex items-center relative z-10">
            <Sparkles className="text-indigo-600 dark:text-indigo-400 mr-3" size={20} />
            <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs italic">AI Configuration</h2>
          </div>
          <div className="p-8 space-y-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-grow w-full">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 ml-1" htmlFor="geminiApiKey">Gemini API Key</label>
                <div className="relative">
                  <input
                    id="geminiApiKey"
                    type="password"
                    name="geminiApiKey"
                    value={formData.geminiApiKey || ''}
                    onChange={handleInputChange}
                    placeholder="Enter your Google AI API key"
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-950 transition-all outline-none text-gray-900 dark:text-white font-mono"
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="md:w-64 pt-6">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 w-full"
                >
                  Get Free API Key <ExternalLink size={14} />
                </a>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium leading-relaxed italic">
              * The Gemini API key enables AI-powered product descriptions. Keys are stored locally in your database. 
              We recommend using a restricted key for security.
            </p>
          </div>
        </div>


        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 italic font-medium">
            * Changes are saved immediately to local state and synchronized.
          </p>
          <div className="flex items-center gap-6 w-full md:w-auto">
            {success && (
              <span className="text-green-600 dark:text-green-400 font-black uppercase tracking-widest text-[10px] animate-pulse">
                {success}
              </span>
            )}
            {error && (
              <span className="text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] animate-shake">
                {error}
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className={`flex-grow md:flex-none px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-2xl shadow-blue-600/20 hover:-translate-y-1 active:scale-95 flex items-center justify-center ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <><Loader2 size={20} className="mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save size={20} className="mr-2" /> Save All Settings</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingsPage;
