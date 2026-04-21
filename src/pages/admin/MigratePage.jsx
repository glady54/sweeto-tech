import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { supabase } from '../../supabase';
import { 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Play, 
  ShieldCheck, 
  Package, 
  Tag, 
  Settings, 
  Video 
} from 'lucide-react';

const MigratePage = () => {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const append = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const migrateCollection = async (firebaseColl, supabaseTable, transformFn = (d) => d) => {
    append(`🔍 Scanning Firebase: ${firebaseColl}...`);
    const snapshot = await getDocs(collection(db, firebaseColl));
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (docs.length === 0) {
      append(`ℹ️ No documents found in ${firebaseColl}. Skipping.`, 'warning');
      return;
    }

    append(`🚀 Found ${docs.length} items. Migrating to Supabase "${supabaseTable}"...`);
    setProgress({ current: 0, total: docs.length });

    for (let i = 0; i < docs.length; i++) {
      const docData = transformFn(docs[i]);
      const { error } = await supabase.from(supabaseTable).upsert(docData);
      
      if (error) {
        append(`❌ Error migrating ${docs[i].id}: ${error.message}`, 'error');
      } else {
        setProgress(p => ({ ...p, current: i + 1 }));
      }
    }
    append(`✅ Successfully migrated ${docs.length} records to ${supabaseTable}.`, 'success');
  };

  const runMigration = async () => {
    if (!window.confirm("This will copy ALL data from Firebase to Supabase. Existing records in Supabase with same IDs will be updated. Proceed?")) return;

    setStatus('running');
    setLog([]);
    try {
      // 1. Store Settings
      await migrateCollection('storeSettings', 'store_settings', (d) => {
        const { id, ...data } = d;
        return { id: d.id === 'main' ? 1 : d.id, ...data }; // Supabase uses serial/int for settings id usually or just 1
      });

      // 2. Categories
      await migrateCollection('categories', 'categories');

      // 3. Products
      await migrateCollection('products', 'products', (d) => {
        const { id, ...data } = d;
        return { 
          id: d.id, 
          ...data,
          updated_at: new Date().toISOString()
        };
      });

      // 4. Video Ads
      await migrateCollection('videoAds', 'video_ads');

      // 5. Sales Records
      await migrateCollection('salesRecords', 'sales_records');

      append('🎉 DATABASE MIGRATION PROTOCOL COMPLETE!', 'success');
      setStatus('done');
    } catch (err) {
      append(`🛑 FATAL ERROR: ${err.message}`, 'error');
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/20 mb-6 group hover:rotate-12 transition-transform">
            <Database className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase italic">
            Backend Migration Bridge
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Safely transfer your entire product catalog, settings, and business history from Firebase to your new Supabase infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-500/5">
              <h2 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6 flex items-center">
                <ShieldCheck size={16} className="mr-2" /> Migration Readiness
              </h2>
              
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <Package size={14} />, text: 'Products & Inventory' },
                  { icon: <Tag size={14} />, text: 'Category Hierarchy' },
                  { icon: <Settings size={14} />, text: 'Store Configurations' },
                  { icon: <Video size={14} />, text: 'Marketing Campaigns' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    <span className="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                      {item.icon}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={runMigration}
                disabled={status === 'running' || status === 'done'}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                  status === 'running' 
                  ? 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : status === 'done'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 translate-y-0 hover:-translate-y-1'
                }`}
              >
                {status === 'running' ? (
                  <><Loader2 className="animate-spin" size={18} /> Migrating Data...</>
                ) : status === 'done' ? (
                  <><CheckCircle2 size={18} /> Migration Finished</>
                ) : (
                  <><Play size={18} /> Start Migration</>
                )}
              </button>
            </div>

            {status === 'running' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 animate-pulse">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Current Task Progress</span>
                  <span className="text-[10px] font-black text-blue-600">{Math.round((progress.current / progress.total) * 100 || 0)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 h-[500px] flex flex-col overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Console Output</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-6 font-mono text-xs space-y-3 custom-scrollbar">
                {log.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                    <Database size={40} className="mb-4 opacity-10" />
                    Waiting for initiation signal...
                  </div>
                )}
                {log.map((entry, i) => (
                  <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300 ${
                    entry.type === 'error' ? 'text-red-400' : 
                    entry.type === 'success' ? 'text-emerald-400' : 
                    entry.type === 'warning' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    <span className="opacity-30 shrink-0">[{entry.time}]</span>
                    <span className="leading-relaxed">{entry.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">Important Note</h3>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/60 font-medium leading-relaxed">
              Ensure your Supabase project URL and Service Role Key (not Anon Key) are correctly configured if you experience permission issues. This tool will overwrite records in Supabase if IDs match.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigratePage;
