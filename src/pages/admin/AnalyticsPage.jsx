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
  Search,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const { visits } = useStoreData();
  const { t } = useAdminLocale();

  // --- ANALYTICS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalVisits = visits.length;
    const uniqueSessions = new Set(visits.map(v => v.sessionId)).size;
    
    // Total Duration for Avg calculation
    let totalDurationInSeconds = 0;
    visits.forEach(v => {
      totalDurationInSeconds += (v.duration || 0);
    });
    
    const avgDurationSeconds = totalVisits > 0 ? Math.round(totalDurationInSeconds / totalVisits) : 0;

    // Format Duration for display
    const formatDuration = (sec) => {
      if (sec < 60) return `${sec}s`;
      const mins = Math.floor(sec / 60);
      const remainingSecs = sec % 60;
      return `${mins}m ${remainingSecs}s`;
    };

    // Visits today
    const today = new Date().toISOString().split('T')[0];
    const visitsToday = visits.filter(v => v.timestamp?.startsWith(today)).length;

    // Top Referrers
    const referrers = {};
    visits.forEach(v => {
      let ref = v.referrerSource || 'Direct';
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

    // Top Countries
    const rawCountries = {};
    visits.forEach(v => {
      const country = v.country || 'Unknown';
      rawCountries[country] = (rawCountries[country] || 0) + 1;
    });
    const topCountries = Object.entries(rawCountries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Top Browsers
    const rawBrowsers = {};
    visits.forEach(v => {
      const browser = v.browser || 'Other';
      rawBrowsers[browser] = (rawBrowsers[browser] || 0) + 1;
    });
    const topBrowsers = Object.entries(rawBrowsers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Device breakdown
    const devices = { Mobile: 0, Desktop: 0 };
    visits.forEach(v => {
      if (v.device === 'Mobile' || v.device === 'Tablet') {
        devices.Mobile++;
      } else {
        devices.Desktop++;
      }
    });

    return {
      totalVisits,
      uniqueSessions,
      visitsToday,
      avgDuration: formatDuration(avgDurationSeconds),
      topReferrers,
      topPages,
      topCountries,
      topBrowsers,
      devices
    };
  }, [visits]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="p-2.5 bg-gray-50 dark:bg-slate-950 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 rounded-2xl transition-all border border-gray-100 dark:border-slate-800 text-gray-500">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic uppercase">
                  Audience <span className="text-blue-600 dark:text-blue-400">Insights</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm tracking-wide">Real-time visitor behavior and traffic intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-5 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex items-center space-x-3">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest">Global Heartbeat Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Page Views" value={stats.totalVisits} icon={MousePointer2} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/10" />
          <StatCard label="Unique Visitors" value={stats.uniqueSessions} icon={Users} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-900/10" />
          <StatCard label="Visits Today" value={stats.visitsToday} icon={Calendar} color="text-green-600" bgColor="bg-green-50 dark:bg-green-900/10" />
          <StatCard label="Avg. Stay Duration" value={stats.avgDuration} icon={Clock} color="text-orange-600" bgColor="bg-orange-50 dark:bg-orange-900/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-10">
            {/* Top Countries */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden group">
              <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/5">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Top Geographic Hubs</h3>
                </div>
              </div>
              <div className="p-10">
                <div className="space-y-8">
                  {stats.topCountries.length > 0 ? stats.topCountries.map(([country, count]) => (
                    <div key={country} className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">{country}</span>
                        <span className="font-black text-rose-600 dark:text-rose-400 font-mono italic">{count} visits</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full transition-all duration-1000"
                          style={{ width: `${(count / stats.totalVisits) * 100}%` }}
                        />
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 font-bold uppercase tracking-widest py-10 opacity-50 italic">No geographic data yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Device Distribution */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/5">
                  <Monitor size={24} />
                </div>
                Device Environment
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-12">
                <DeviceStat label="Desktop" count={stats.devices.Desktop} total={stats.totalVisits} icon={Monitor} color="text-indigo-500" />
                <div className="hidden sm:block w-px h-24 bg-gray-100 dark:border-slate-800" />
                <DeviceStat label="Mobile / Tablet" count={stats.devices.Mobile} total={stats.totalVisits} icon={Smartphone} color="text-emerald-500" />
              </div>
            </div>

            {/* Top Browsers */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
                  <Globe size={24} />
                </div>
                Browser Ecosystem
              </h3>
              <div className="space-y-6">
                {stats.topBrowsers.map(([browser, count]) => (
                  <div key={browser} className="flex justify-between items-center group/item hover:bg-gray-50/50 dark:hover:bg-slate-950/50 p-4 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-slate-800 transition-all">
                    <span className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-tighter">{browser}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-blue-600 font-mono italic">{count} hits</span>
                      <div className="w-24 bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / stats.totalVisits) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {/* Top Pages */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
               <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Content Performance</h3>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="space-y-2">
                  {stats.topPages.map(([page, count], index) => (
                    <div key={page} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-black text-gray-300 dark:text-slate-600 font-mono italic">#{index + 1}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800 dark:text-white truncate max-w-[200px]">{page}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Route</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">{count}</span>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Hits logged</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traffic Channels */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
               <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
                    <TrendingUp size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Referral Channels</h3>
                </div>
              </div>
              <div className="p-10 pt-6">
                 <div className="space-y-2">
                  {stats.topReferrers.map(([ref, count], index) => (
                    <div key={ref} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-center text-gray-400">
                          {ref === 'Direct' ? <Search size={18} /> : <ExternalLink size={18} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800 dark:text-white">{ref}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Traffic Origin</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">{count}</span>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Visitors</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent User Activity */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden group relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600 opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
               <div className="px-10 py-8 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Live User Stream</h3>
                </div>
              </div>
              <div className="p-10 pt-6">
                 <div className="space-y-3">
                  {visits.slice(0, 8).map((v, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/30 dark:bg-slate-950/20 rounded-2xl border border-transparent hover:border-emerald-500/20 transition-all group/item">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800 dark:text-white group-hover/item:text-emerald-600 transition-colors uppercase tracking-tight">{v.user || 'Guest Visitor'}</span>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">
                            {v.browser} on {v.device} • {v.country}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                          {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {visits.length === 0 && (
                    <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest opacity-50 italic">No activity recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.02] rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />
    <div className="flex items-center gap-6 relative z-10">
      <div className={`p-5 ${bgColor} ${color} rounded-[1.5rem] shadow-lg shadow-current/5 group-hover:rotate-6 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 mb-1">{label}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{value}</p>
      </div>
    </div>
  </div>
);

const DeviceStat = ({ label, count, total, icon: Icon, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center group">
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center bg-gray-50 dark:bg-slate-950 mb-6 border border-gray-100 dark:border-slate-800 group-hover:border-current transition-all duration-500`}>
        <Icon className={`h-8 w-8 ${color} group-hover:scale-110 transition-transform`} />
      </div>
      <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-3xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{percentage}%</span>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-60" />
        <span className="text-[10px] font-bold text-gray-400 italic">{count} absolute sessions</span>
      </div>
    </div>
  );
}

export default AnalyticsPage;
