import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import MailingListModal from '../components/MailingListModal';

type MailingListContextValue = {
  openMailingList: () => void;
  closeMailingList: () => void;
};

const MailingListContext = createContext<MailingListContextValue | null>(null);

export const MailingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const openMailingList = useCallback(() => setOpen(true), []);
  const closeMailingList = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openMailingList, closeMailingList }),
    [openMailingList, closeMailingList]
  );

  return (
    <MailingListContext.Provider value={value}>
      {children}
      <MailingListModal open={open} onClose={closeMailingList} />
    </MailingListContext.Provider>
  );
};

export function useMailingList(): MailingListContextValue {
  const ctx = useContext(MailingListContext);
  if (!ctx) {
    throw new Error('useMailingList must be used within MailingListProvider');
  }
  return ctx;
}
