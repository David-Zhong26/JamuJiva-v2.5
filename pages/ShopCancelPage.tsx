import React from 'react';
import { Link } from 'react-router-dom';

const ShopCancelPage: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] px-8 pb-16 pt-28">
    <div className="max-w-md text-center">
      <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">Checkout canceled</h1>
      <p className="mt-4 text-[#2D4F3E]/75">No charge was made. Your cart is still waiting.</p>
      <Link
        to="/shop"
        className="mt-8 inline-flex rounded-full bg-[#2D4F3E] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
      >
        Return to shop
      </Link>
    </div>
  </main>
);

export default ShopCancelPage;
