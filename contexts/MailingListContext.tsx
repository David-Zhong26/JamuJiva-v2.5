import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const autoOpenedRef = useRef(false);

  const openMailingList = useCallback(() => {
    autoOpenedRef.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('waitlist') === '1' || autoOpenedRef.current) return;

    const triggerAutoOpen = () => {
      if (autoOpenedRef.current) return;
      autoOpenedRef.current = true;
      setOpen(true);
      window.removeEventListener('scroll', handleScroll);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollableHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollableHeight <= 0) return;
      if (scrollTop / scrollableHeight >= 0.1) {
        triggerAutoOpen();
      }
    };

    const timerId = window.setTimeout(triggerAutoOpen, 3000);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('waitlist') === '1') {
      autoOpenedRef.current = true;
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
