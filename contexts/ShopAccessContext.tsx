import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'jiva_shop_access';

type ShopAccessMode = 'delivery' | 'pickup';

type ShopAccess = {
  zip: string;
  grantedAt: number;
  mode?: ShopAccessMode;
  label?: string | null;
};

type ShopAccessContextValue = {
  isEligible: boolean;
  zip: string | null;
  accessMode: ShopAccessMode;
  accessLabel: string | null;
  grantAccess: (zip: string, mode?: ShopAccessMode, label?: string | null) => void;
  clearAccess: () => void;
};

const ShopAccessContext = createContext<ShopAccessContextValue | null>(null);

function readAccess(): ShopAccess | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShopAccess;
    if (!parsed?.zip) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const ShopAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [access, setAccess] = useState<ShopAccess | null>(() => readAccess());

  const grantAccess = useCallback((zip: string, mode: ShopAccessMode = 'delivery', label: string | null = null) => {
    const next = { zip: zip.trim(), grantedAt: Date.now(), mode, label };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAccess(next);
  }, []);

  const clearAccess = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAccess(null);
  }, []);

  const value = useMemo(
    () => ({
      isEligible: Boolean(access?.zip),
      zip: access?.zip ?? null,
      accessMode: access?.mode ?? 'delivery',
      accessLabel: access?.label ?? null,
      grantAccess,
      clearAccess,
    }),
    [access, grantAccess, clearAccess]
  );

  return <ShopAccessContext.Provider value={value}>{children}</ShopAccessContext.Provider>;
};

export function useShopAccess(): ShopAccessContextValue {
  const ctx = useContext(ShopAccessContext);
  if (!ctx) {
    throw new Error('useShopAccess must be used within ShopAccessProvider');
  }
  return ctx;
}
