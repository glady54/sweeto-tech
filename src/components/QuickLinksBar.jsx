import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, Star, Tag } from 'lucide-react';

const quickLinks = [
  {
    id: 'best-sellers',
    label: 'Best Sellers',
    sub: 'Shop Now',
    icon: TrendingUp,
    color: 'bg-orange-100 text-orange-500',
    href: '/search?q=bestseller',
  },
  {
    id: 'new-arrivals',
    label: 'New Arrivals',
    sub: 'Shop Now',
    icon: Sparkles,
    color: 'bg-blue-100 text-blue-500',
    href: '/search?q=new',
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    sub: 'Shop Now',
    icon: Star,
    color: 'bg-purple-100 text-purple-500',
    href: '/search?q=top',
  },
  {
    id: 'on-sale',
    label: 'On Sale',
    sub: 'Shop Now',
    icon: Tag,
    color: 'bg-green-100 text-green-500',
    href: '/search?q=sale',
  },
];

const QuickLinksBar = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              to={item.href}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.label}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 group-hover:text-blue-600 transition-colors">
                  {item.sub} →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickLinksBar;
