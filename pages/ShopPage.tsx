import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import MaScreeningModal from '../components/MaScreeningModal';
import ProductShopPage from '../components/ProductShopPage';
import ShopIndex from '../components/ShopIndex';
import ShoppingCart from '../components/ShoppingCart';
import { CartProvider } from '../contexts/CartContext';
import { useMailingList } from '../contexts/MailingListContext';
import { ShopAccessProvider, useShopAccess } from '../contexts/ShopAccessContext';

const ShopContent: React.FC = () => {
  const { isEligible } = useShopAccess();
  const { openMailingList } = useMailingList();
  const [screeningOpen, setScreeningOpen] = useState(true);

  if (!isEligible) {
    return (
      <>
        <main className="flex min-h-[70vh] items-center justify-center bg-[#F5E8CA] px-8 pb-16 pt-28">
          <div className="max-w-md text-center">
            <h1 className="font-serif text-4xl font-black text-[#2D4F3E] md:text-5xl">Shop</h1>
            <p className="mt-4 text-[#2D4F3E]/75">
              Tell us where you&apos;re located so we can show delivery options or the waitlist.
            </p>
            {!screeningOpen ? (
              <button
                type="button"
                onClick={() => setScreeningOpen(true)}
                className="mt-8 rounded-full bg-[#2D4F3E] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
              >
                Check delivery area
              </button>
            ) : null}
            <button
              type="button"
              onClick={openMailingList}
              className="mt-4 block w-full text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/70 underline underline-offset-2"
            >
              Join the waitlist
            </button>
            <Link
              to="/"
              className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-[#2D4F3E]/50 hover:text-[#2D4F3E]"
            >
              Back to home
            </Link>
          </div>
        </main>
        <MaScreeningModal open={screeningOpen} onClose={() => setScreeningOpen(false)} />
      </>
    );
  }

  return (
    <CartProvider>
      <main className="bg-[#F5E8CA] pb-16 pt-28">
        <Routes>
          <Route index element={<ShopIndex />} />
          <Route path=":slug" element={<ProductShopPage />} />
        </Routes>
        <ShoppingCart />
      </main>
    </CartProvider>
  );
};

const ShopPage: React.FC = () => (
  <ShopAccessProvider>
    <ShopContent />
  </ShopAccessProvider>
);

export default ShopPage;
