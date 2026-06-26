import React from 'react';
import { Link } from 'react-router-dom';

const ShopSuccessPage: React.FC = () => (
  <main className="flex min-h-screen items-center justify-center bg-[#F5E8CA] px-8 pb-16 pt-28">
    <div className="max-w-md text-center">
      <h1 className="font-serif text-4xl font-black text-[#2D4F3E]">Thank you for your order!</h1>
      <p className="mt-4 text-[#2D4F3E]/75">
        Your order has been confirmed, and your payment was successfully received. A receipt will be sent to your email. Our team will contact you shortly to coordinate your delivery date and time.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-[#2D4F3E] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#F47C3E]"
      >
        Back home
      </Link>
    </div>
  </main>
);

export default ShopSuccessPage;
