import { Package, Zap } from 'lucide-react';
import { useStoreData } from '../contexts/StoreDataContext';

const LoadingScreen = () => {
  const { storeSettings } = useStoreData();
  const shopName = storeSettings?.shopName || 'SWEETO TECH';
  const firstWord = shopName.split(' ')[0];
  const restOfName = shopName.split(' ').slice(1).join(' ');
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-950 flex flex-col items-center justify-center">
      {/* Cyber Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated 3D Logo Block */}
        <div className="relative mb-8">
          <div className="h-20 w-20 sm:h-24 sm:w-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] shine-effect transform perspective-1000">
            <Package size={40} className="text-white animate-spin-y sm:w-12 sm:h-12" strokeWidth={2} />
          </div>
          {/* Pulsing Tech Ring */}
          <div className="absolute inset-0 border-2 border-blue-500/40 rounded-2xl animate-ping" style={{ animationDuration: '2.5s' }}></div>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col items-center animate-chill text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-3">
            {firstWord}
            <span className="text-blue-600 dark:text-blue-500">{restOfName ? `-${restOfName}` : ''}</span>
          </h2>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50">
            <Zap size={12} className="text-blue-600 fill-blue-600 animate-pulse" />
            <p className="text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
              {storeSettings?.shopTagline || 'System Initialization'}
            </p>
          </div>
        </div>

        {/* Cyber Progress Bar */}
        <div className="mt-12 w-48 sm:w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
