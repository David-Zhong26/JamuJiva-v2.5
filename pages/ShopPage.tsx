import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PreLaunchProductWindow from '../components/PreLaunchProductWindow';
import ShopIndex from '../components/ShopIndex';

const ShopContent: React.FC = () => {
  const location = useLocation();
  const isShopHub = location.pathname === '/shop' || location.pathname === '/shop/';

  return (
    <main className={`pb-0 ${isShopHub ? 'bg-transparent pt-0' : 'bg-transparent pt-0'}`}>
      <Routes>
        <Route index element={<ShopIndex />} />
        <Route path="drinks" element={<PreLaunchProductWindow />} />
        {/* Old product PDP URLs go to pre-launch drinks */}
        <Route path=":slug" element={<Navigate to="/shop/drinks" replace />} />
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </main>
  );
};

const ShopPage: React.FC = () => <ShopContent />;

export default ShopPage;
