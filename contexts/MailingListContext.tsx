import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MailingListModal from '../components/MailingListModal';
import { useLocation, useNavigate } from 'react-router-dom';

type MailingListContextValue = {
  openMailingList: () => void;
  closeMailingList: () => void;
};

const MailingListContext = createContext<MailingListContextValue | null>(null);

export const MailingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const openMailingList = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('waitlist') === '1') {
      setOpen(true);
    }
  }, [location.search]);

  const closeMailingList = useCallback(() => {
    setOpen(false);

    const params = new URLSearchParams(location.search);
    if (params.get('waitlist') !== '1') return;

    params.delete('waitlist');
    const search = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : '',
        hash: location.hash,
      },
      { replace: true }
    );
  }, [location.hash, location.pathname, location.search, navigate]);

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
