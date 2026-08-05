import React from 'react';
import { Link } from 'react-router-dom';

const ShopCancelPage: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#6F2E1E] px-8 pb-16 pt-28">
    <div className="max-w-md text-center">
      <h1 className="font-serif text-4xl font-black text-white">Checkout canceled</h1>
      <p className="mt-4 text-white/85">No charge was made. Your cart is still waiting.</p>
      <Link
        to="/shop"
        className="mt-8 inline-flex rounded-full bg-[#8C3F1F] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#A34D27]"
      >
        Return to shop
      </Link>
    </div>
  </main>
);

export default ShopCancelPage;
