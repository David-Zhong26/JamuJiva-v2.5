import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import ShopIndex from '../components/ShopIndex';
import shopDrinksImg from '../materials/shop-drinks.png';

/** Temporary stand-in while purchase is paused. Full shop lives on archive/shop-with-purchase. */
const DrinksComingSoon: React.FC = () => (
  <main className="relative flex jj-min-screen items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={shopDrinksImg}
        alt=""
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#3A1A10]/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.12),transparent_55%)]" />
    </div>
    <div className="relative z-10 px-6 pb-16 pt-28 text-center">
      <h1 className="font-serif text-5xl leading-none text-[#F6F1E8] sm:text-6xl md:text-[4.25rem]">
        Drinks
      </h1>
      <p className="mt-4 text-base text-white/90 sm:text-lg">Coming soon.</p>
    </div>
  </main>
);

const ShopContent: React.FC = () => {
  const location = useLocation();
  const isShopHub = location.pathname === '/shop' || location.pathname === '/shop/';

  return (
    <main className={`pb-0 ${isShopHub ? 'bg-transparent pt-0' : 'bg-transparent pt-0'}`}>
      <Routes>
        <Route index element={<ShopIndex />} />
        <Route path="drinks" element={<DrinksComingSoon />} />
        {/* Old product PDP URLs redirect to drinks coming soon */}
        <Route path=":slug" element={<Navigate to="/shop/drinks" replace />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </main>
  );
};

const ShopPage: React.FC = () => <ShopContent />;

export default ShopPage;
