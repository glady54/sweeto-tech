import React, { useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import QuickLinksBar from '../components/QuickLinksBar';
import FeaturedProductsGrid from '../components/FeaturedProductsGrid';
import JustArrivedSection from '../components/JustArrivedSection';
import CategoryBanners from '../components/CategoryBanners';
import TrendingProducts from '../components/TrendingProducts';
import { updateSEO } from '../utils/seoHelper';

const HomePage = () => {
  useEffect(() => {
    updateSEO();
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-20 bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Hero stays as-is */}
      <HeroBanner />

      {/* Section wrapper on a light background */}
      <div className="flex flex-col gap-10">
        {/* 1. Quick links: Best Sellers, New Arrivals, Top Rated, On Sale */}
        <QuickLinksBar />

        {/* 2. Featured Products with tabs + promo card */}
        <FeaturedProductsGrid />

        {/* 4. Category promo banners (3 wide cards) */}
        <CategoryBanners />

        {/* 5. Trending / More Products */}
        <TrendingProducts />
      </div>
    </div>
  );
};

export default HomePage;
