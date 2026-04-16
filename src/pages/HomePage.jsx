import React from 'react';
import HeroBanner from '../components/HeroBanner';
import TopCategories from '../components/TopCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingProducts from '../components/TrendingProducts';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 lg:gap-16 py-8 pb-20">
      <HeroBanner />
      <TopCategories />
      <FeaturedProducts />
      <TrendingProducts />
    </div>
  );
};

export default HomePage;
