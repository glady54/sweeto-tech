import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStoreData } from '../contexts/StoreDataContext';
import { ArrowRight, Clock } from 'lucide-react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroBanner = () => {
  const { products, formatPrice } = useStoreData();

  const [timeLeft, setTimeLeft] = useState({ hrs: '08', min: '24', sec: '55' });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setTimeLeft({
        hrs: String(23 - now.getHours()).padStart(2, '0'),
        min: String(59 - now.getMinutes()).padStart(2, '0'),
        sec: String(59 - now.getSeconds()).padStart(2, '0')
      });
    };
    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Get active products for the grid
  const activeProducts = products.filter(p => (p.status === 'active' || !p.status) && (p.stockQuantity > 0 || p.stockQuantity === undefined));

  // Featured products for the slider (top 5)
  const featuredSliderProducts = activeProducts.slice(0, 5);

  // Selecting secondary products (starting from index 5 to avoid duplication)
  const subProduct1 = activeProducts[5] || activeProducts[1] || { name: 'Featured Tech', price: 0, image: '', id: '' };
  const subProduct2 = activeProducts[6] || activeProducts[2] || { name: 'New Arrival', price: 0, image: '', id: '' };

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">

        {/* Main Banner Slider - Left (Large) */}
        <div className="lg:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl h-[450px] lg:h-full">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1200}
            loop={featuredSliderProducts.length >= 3}
            autoplay={featuredSliderProducts.length > 1 ? { delay: 6000, disableOnInteraction: false } : false}
            pagination={{ clickable: true }}
            className="h-full w-full hero-swiper"
          >
            {featuredSliderProducts.length > 0 ? (
              featuredSliderProducts.map((product) => (
                <SwiperSlide key={product.id} className="h-full overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block h-full w-full">
                    {/* Background */}
                    <div className="absolute inset-0 z-10 transition-transform duration-1000 scale-100 group-hover:scale-105">
                      {product.image ? (
                        <>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover opacity-60 lg:opacity-60 transition-transform duration-[20s] ease-out swiper-image-zoom"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 lg:from-slate-950/50 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-950 to-slate-950"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative z-20 h-full p-6 sm:p-12 flex flex-col justify-center max-w-xl">
                      <span className="slide-content-badge bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4 lg:mb-8 w-fit">
                        Featured Selection
                      </span>

                      <h2 className="slide-content-title text-3xl sm:text-4xl lg:text-7xl font-black text-white leading-[1.1] mb-4 lg:mb-6 tracking-tighter">
                        {product.name}
                      </h2>

                      <p className="slide-content-desc text-gray-400 text-sm lg:text-xl mb-6 lg:mb-10 line-clamp-2 font-medium max-w-md leading-relaxed hidden sm:block">
                        Experience precision engineering and unparalleled design. Redefine your tech standards today.
                      </p>

                      <div className="slide-content-btn flex items-center gap-4 lg:gap-8">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Price</span>
                          <span className="text-xl lg:text-3xl font-black text-white tracking-tight">{formatPrice(product.price)}</span>
                        </div>

                        <div className="group/btn relative overflow-hidden bg-white text-slate-950 px-6 lg:px-10 py-3 lg:py-5 rounded-2xl font-black uppercase text-[10px] lg:text-xs tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-white/5 active:scale-95">
                          Discover <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="h-full bg-slate-900 flex items-center justify-center p-10 text-center">
                <h2 className="text-2xl lg:text-4xl font-black text-white">Curating Excellence...</h2>
              </SwiperSlide>
            )}
          </Swiper>

          <style dangerouslySetInnerHTML={{
            __html: `
            /* Professional Staggered Animations */
            @keyframes contentIn {
              from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
              to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }

            .hero-swiper .swiper-slide-active .slide-content-badge { animation: contentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            .hero-swiper .swiper-slide-active .slide-content-title { animation: contentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
            .hero-swiper .swiper-slide-active .slide-content-desc { animation: contentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
            .hero-swiper .swiper-slide-active .slide-content-btn { animation: contentIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }

            /* Ken Burns Effect */
            .hero-swiper .swiper-slide-active .swiper-image-zoom { transform: scale(1.1); }
            
            /* Professional Pagination */
            .hero-swiper .swiper-pagination { bottom: 20px !important; left: 24px !important; width: fit-content !important; text-align: left; }
            @media (min-width: 1024px) {
              .hero-swiper .swiper-pagination { bottom: 40px !important; left: 48px !important; }
            }
            .hero-swiper .swiper-pagination-bullet { background: #fff; width: 6px; height: 6px; opacity: 0.2; border-radius: 4px; transition: all 0.4s; margin: 0 4px !important; }
            .hero-swiper .swiper-pagination-bullet-active { background: #2563eb; width: 24px; opacity: 1; }
          `}} />
        </div>

        {/* Side Banners - Right (Cinematic Tiles) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Top Cinematic Tile: Elite Selection */}
          <div className="flex-1 relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl group">
            <Link to={`/product/${subProduct1.id}`} className="block h-full w-full">
              {/* Background Glows */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] group-hover:bg-blue-600/30 transition-colors duration-1000"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-800/40 rounded-full blur-[80px]"></div>
              </div>

              {/* Dynamic Image */}
              <div className="absolute inset-0 z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-1000">
                {subProduct1.image ? (
                  <img
                    src={subProduct1.image}
                    alt={subProduct1.name}
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              </div>

              {/* Content Overlay */}
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-blue-600/10 backdrop-blur-md border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-lg mb-4">
                    Elite Selection
                  </span>
                  <h3 className="text-xl lg:text-2xl font-black text-white tracking-tighter leading-tight group-hover:translate-x-2 transition-transform duration-500">
                    {subProduct1.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3 group-hover:translate-y-[-4px] transition-transform duration-500">
                   <div className="h-0.5 w-8 bg-blue-600 rounded-full group-hover:w-12 transition-all duration-500"></div>
                   <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Explore Tech</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Cinematic Tile: Pro Series */}
          <div className="flex-1 relative overflow-hidden rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl group">
            <Link to={`/product/${subProduct2.id}`} className="block h-full w-full">
               {/* Cyber Grid Background */}
               <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
               </div>

               {/* Ambient Glow */}
               <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>

               <div className="absolute inset-0 z-10 flex items-center justify-end pr-4">
                 {subProduct2.image ? (
                   <img
                     src={subProduct2.image}
                     alt={subProduct2.name}
                     className="w-[60%] h-[80%] object-contain group-hover:scale-110 group-hover:rotate-6 transition-transform duration-1000 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                   />
                 ) : (
                   <div className="w-20 h-20 bg-slate-800 rounded-full blur-2xl" />
                 )}
               </div>

               <div className="relative z-20 h-full p-8 flex flex-col justify-center max-w-[50%]">
                 <span className="text-indigo-400 font-black text-[9px] uppercase tracking-[0.4em] mb-2 block">Pro Series</span>
                 <h3 className="text-xl font-black text-white tracking-tighter leading-tight mb-4 group-hover:text-indigo-300 transition-colors">
                   {subProduct2.name}
                 </h3>
                 <div className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl w-fit group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                   Get Now
                 </div>
               </div>
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        /* Professional Pulse Logic */
        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }
        .pulse-glow { animation: pulseGlow 3s infinite ease-in-out; }

        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounceX 1.5s infinite; }

        /* General Professional Refinements */
        .hero-swiper .swiper-pagination-bullet { width: 8px; height: 8px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-swiper .swiper-pagination-bullet-active { width: 32px; background: #2563eb !important; border-radius: 4px; }
      `}} />
    </section>
  );
};

export default HeroBanner;
