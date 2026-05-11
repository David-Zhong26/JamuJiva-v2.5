import React from 'react';
import FlavorShopSection from '../components/FlavorShopSection';
import { useMailingList } from '../contexts/MailingListContext';

const ShopPage: React.FC = () => {
  const { openMailingList } = useMailingList();

  return (
    <main className="pt-28 pb-16">
      <FlavorShopSection onOpenMailingListModal={openMailingList} />
    </main>
  );
};

export default ShopPage;
