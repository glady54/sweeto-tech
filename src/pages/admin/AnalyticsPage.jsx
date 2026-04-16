import React, { useMemo } from 'react';
import { useStoreData } from '../../contexts/StoreDataContext';
import { useAdminLocale } from '../../contexts/AdminLocaleContext';
import { 
  Users, 
  MousePointer2, 
  Globe, 
  ArrowLeft, 
  Layers, 
  ExternalLink,
  Calendar,
  Smartphone,
  Monitor,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const { visits, formatPrice } = useStoreData();
  const { t } = useAdminLocale();

  // --- ANALYTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const uniqueSessions = new Set(visits.map(v => v.sessionId)).size;
    
    // Visits today
    const today = new Date().toISOString().split('T')[0];
    const visitsToday = visits.filter(v => v.timestamp?.startsWith(today)).length;

    // Top Referrers
    const referrers = {};
    visits.forEach(v => {
      let ref = v.referrer || 'Direct';
      // Clean up referrer (e.g., extract domain)
      try {
        if (ref !== 'Direct') {
          const url = new URL(ref);
          ref = url.hostname;
        }
      } catch (e) {
        // Fallback to raw referrer if not a valid URL
      }
      referrers[ref] = (referrers[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Top Pages
    const pages = {};
    visits.forEach(v => {
      const path = v.path || '/';
      pages[path] = (pages[path] || 0) + 1;
    });
    const topPages = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Device breakdown (rough estimate from User Agent)
    const devices = { Mobile: 0, Desktop: 0 };
    visits.forEach(v => {
      if (/Mobi|Android/i.test(v.userAgent)) {
        devices.Mobile++;
      } else {
        devices.Desktop++;
      }
    });

    return {
      totalVisits,
      uniqueSessions,
      visitsToday,
      topReferrers,
      topPages,
      devices
    };
  }, [visits]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ArrowLeft size={24} className="text-gray-500" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">
                  Audience <span className="text-blue-600 dark:text-blue-400">Insights</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time visitor analytics and traffic sources</p>
              </div>
            </div>
            <div className="hidden md:flex bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800/30 items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest">Live Tracking Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            label="Total Page Views" 
            value={stats.totalVisits} 
            icon={MousePointer2} 
            color="text-blue-600" 
            bgColor="bg-blue-50 dark:bg-blue-900/20" 
          />
          <StatCard 
            label="Unique Visitors" 
            value={stats.uniqueSessions} 
            icon={Users} 
            color="text-purple-600" 
            bgColor="bg-purple-50 dark:bg-purple-900/20" 
          />
          <StatCard 
            label="Visits Today" 
            value={stats.visitsToday} 
            icon={Calendar} 
            color="text-green-600" 
            bgColor="bg-green-50 dark:bg-green-900/20" 
          />
          <StatCard 
            label="Avg. Session" 
            value="Coming Soon" 
            icon={Layers} 
            color="text-amber-600" 
            bgColor="bg-amber-50 dark:bg-amber-900/20" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Top Sources */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center space-x-3">
              <Globe className="text-blue-500" size={20} />
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Traffic Sources</h3>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {stats.topReferrers.map(([source, count], index) => (
                  <div key={source} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                        {source === 'Direct' ? <Search size={14} className="mr-2 opacity-50" /> : <ExternalLink size={14} className="mr-2 opacity-50" />}
                        {source}
                      </span>
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                        {count} views ({Math.round((count / stats.totalVisits) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-1000" 
                        style={{ width: `${(count / stats.totalVisits) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {stats.topReferrers.length === 0 && (
                  <div className="text-center py-10 opacity-50">No traffic data yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex items-center space-x-3">
              <Layers className="text-purple-500" size={20} />
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Most Visited Pages</h3>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                {stats.topPages.map(([page, count], index) => (
                  <div key={page} className="flex items-center justify-between group p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-lg text-xs font-black text-gray-500">
                        #{index + 1}
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px] md:max-w-xs block">
                        {page}
                      </span>
                    </div>
                    <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-black font-mono">
                      {count} hits
                    </span>
                  </div>
                ))}
                {stats.topPages.length === 0 && (
                  <div className="text-center py-10 opacity-50">No page data yet</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="mt-10 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8">
          <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-8">Device Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-around space-y-8 md:space-y-0">
            <DeviceStat 
              label="Desktop" 
              count={stats.devices.Desktop} 
              total={stats.totalVisits} 
              icon={Monitor} 
              color="text-blue-500" 
            />
            <div className="hidden md:block w-px h-20 bg-gray-100 dark:bg-slate-800" />
            <DeviceStat 
              label="Mobile / Tablet" 
              count={stats.devices.Mobile} 
              total={stats.totalVisits} 
              icon={Smartphone} 
              color="text-green-500" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 dark:border-slate-800 group">
    <div className="flex items-center">
      <div className={`flex-shrink-0 ${bgColor} rounded-2xl p-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
      <div className="ml-5">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white font-mono">{value}</p>
      </div>
    </div>
  </div>
);

const DeviceStat = ({ label, count, total, icon: Icon, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 mb-4`}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      <span className="text-sm font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black text-gray-900 dark:text-white font-mono">{percentage}%</span>
      <span className="text-xs font-bold text-gray-400 mt-1 italic">{count} total views</span>
    </div>
  );
}

export default AnalyticsPage;
