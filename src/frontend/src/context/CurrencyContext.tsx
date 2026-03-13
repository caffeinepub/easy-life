import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type Currency = "USD" | "INR";

const EXCHANGE_RATE_USD_TO_INR = 83; // approximate

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (usdAmount: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const STORAGE_KEY = "easylife_currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Currency) ?? "INR";
  });

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const symbol = currency === "INR" ? "₹" : "$";

  const format = (usdAmount: number): string => {
    if (currency === "INR") {
      const inr = usdAmount * EXCHANGE_RATE_USD_TO_INR;
      return `₹${inr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
