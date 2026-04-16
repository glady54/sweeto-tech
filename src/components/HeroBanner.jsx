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
  const promoProduct = activeProducts[5] || activeProducts[1] || { name: 'Limited Deal', price: 0, image: '', id: '' };
  const subProduct1 = activeProducts[6] || activeProducts[2] || { name: 'Featured Tech', price: 0, image: '', id: '' };
  const subProduct2 = activeProducts[7] || activeProducts[3] || { name: 'New Arrival', price: 0, image: '', id: '' };

  return (
    <section className="max-w-[1400px] mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
        
        {/* Main Banner Slider - Left (Large) */}
        <div className="lg:col-span-6 group relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1200}
            loop={true}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="h-full w-full hero-swiper"
          >
            {featuredSliderProducts.length > 0 ? (
              featuredSliderProducts.map((product) => (
                <SwiperSlide key={product.id} className="h-full overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block h-full w-full">
                    {/* Background with Professional Overlay */}
                    <div className="absolute inset-0 z-10 transition-transform duration-1000 scale-100 group-hover:scale-105">
                      {product.image ? (
                        <>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] ease-out swiper-image-zoom" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-950 to-slate-950"></div>
                      )}
                    </div>
                    
                    {/* Content with Staggered Animations */}
                    <div className="relative z-20 h-full p-12 flex flex-col justify-center max-w-xl">
                      <span className="slide-content-badge bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8 w-fit">
                        Featured Selection
                      </span>
                      
                      <h2 className="slide-content-title text-4xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter">
                        {product.name}
                      </h2>
                      
                      <p className="slide-content-desc text-gray-400 text-lg lg:text-xl mb-10 line-clamp-2 font-medium max-w-md leading-relaxed">
                        Experience precision engineering and unparalleled design. Redefine your tech standards today.
                      </p>
                      
                      <div className="slide-content-btn flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Price</span>
                          <span className="text-3xl font-black text-white tracking-tight">{formatPrice(product.price)}</span>
                        </div>
                        
                        <div className="group/btn relative overflow-hidden bg-white text-slate-950 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-500 flex items-center gap-3 shadow-2xl shadow-white/5 active:scale-95">
                          Discover <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="h-full bg-slate-900 flex items-center justify-center p-10 text-center">
                <h2 className="text-4xl font-black text-white">Curating Excellence...</h2>
              </SwiperSlide>
            )}
          </Swiper>
          
          <style dangerouslySetInnerHTML={{ __html: `
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
            .hero-swiper .swiper-slide-active .swiper-image-zoom { transform: scale(1.15); }
            
            /* Professional Pagination */
            .hero-swiper .swiper-pagination { bottom: 40px !important; left: 48px !important; width: fit-content !important; text-align: left; }
            .hero-swiper .swiper-pagination-bullet { background: #fff; width: 8px; height: 8px; opacity: 0.2; border-radius: 4px; transition: all 0.4s; margin: 0 4px !important; }
            .hero-swiper .swiper-pagination-bullet-active { background: #2563eb; width: 32px; opacity: 1; }
          `}} />
        </div>

        {/* Right Side Grid - Static Banners */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 gap-6">
          

          {/* Top Promo Banner - Unified Cinematic Design */}
          <div className="md:col-span-2 relative overflow-hidden rounded-[3rem] bg-slate-950 shadow-2xl group border border-slate-800 h-[320px] lg:h-auto">
            <Link to={`/product/${promoProduct.id}`} className="block h-full w-full flex items-center">
              {/* Technical Background Pattern */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent"></div>
              </div>

              <div className="p-10 relative z-20 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 pulse-glow"></div>
                    <span className="relative bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-blue-400/30 flex items-center gap-2 shadow-lg shadow-blue-500/20">
                      <Clock size={12} className="opacity-80" /> Limited Time
                    </span>
                  </div>
                </div>
                
                <h3 className="text-3xl lg:text-5xl font-black text-white mb-2 tracking-tighter leading-tight drop-shadow-2xl">
                  {promoProduct.name}
                </h3>
                <p className="text-blue-400 font-black text-lg mb-8 tracking-widest uppercase opacity-80">Flash Sale Event</p>
                
                <div className="flex gap-4">
                  {[
                    { val: timeLeft.hrs, label: 'Hrs' },
                    { val: timeLeft.min, label: 'Min' },
                    { val: timeLeft.sec, label: 'Sec' }
                  ].map((unit, i) => (
                    <div key={i} className="bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 text-white text-center min-w-[70px] shadow-2xl group-hover:border-blue-500/30 transition-colors">
                      <p className="text-2xl font-black tracking-tight text-blue-50">{unit.val}</p>
                      <p className="text-[9px] uppercase font-black tracking-widest text-blue-400/60 mt-0.5">{unit.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 h-full relative overflow-hidden hidden md:flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 to-transparent"></div>
                {/* Floating Glow Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
                <img 
                  src={promoProduct.image} 
                  alt={promoProduct.name} 
                  className="relative z-10 w-full h-[85%] object-contain transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3 drop-shadow-[0_35px_60px_rgba(0,0,0,0.8)]"
                />
              </div>
            </Link>
          </div>

          {/* Bottom Left Square - High-End Layout */}
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 shadow-2xl group h-[260px] border border-slate-800">
            <Link to={`/product/${subProduct1.id}`} className="block h-full w-full">
              <div className="absolute inset-0 z-10 overflow-hidden">
                {/* Background Image with Lume Effect */}
                <img 
                  src={subProduct1.image} 
                  alt={subProduct1.name} 
                  className="w-full h-full object-cover opacity-50 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-30 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_100%)]"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 z-30">
                <span className="bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl group-hover:border-blue-500/50 transition-colors">
                  Elite Access
                </span>
              </div>
              
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h4 className="text-xl lg:text-2xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl group-hover:-translate-y-4 transition-transform duration-500">
                  {subProduct1.name}
                </h4>
                
                <div className="absolute bottom-8 left-8 overflow-hidden h-0 group-hover:h-6 transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                    View Specs <ArrowRight size={14} className="animate-bounce-x" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Right Square - High-End Layout */}
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 shadow-2xl group h-[260px] border border-slate-800">
            <Link to={`/product/${subProduct2.id}`} className="block h-full w-full">
              <div className="absolute inset-0 z-10 overflow-hidden">
                <img 
                  src={subProduct2.image} 
                  alt={subProduct2.name} 
                  className="w-full h-full object-cover opacity-50 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-30 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_100%)]"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 left-6 z-30">
                <span className="bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl group-hover:border-emerald-500/50 transition-colors">
                  Cyber Monday
                </span>
              </div>
              
              <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                <h4 className="text-xl lg:text-2xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl group-hover:-translate-y-4 transition-transform duration-500">
                  {subProduct2.name}
                </h4>
                
                <div className="absolute bottom-8 left-8 overflow-hidden h-0 group-hover:h-6 transition-all duration-500 opacity-0 group-hover:opacity-100">
                  <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                    Shop Now <ArrowRight size={14} className="animate-bounce-x" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
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
