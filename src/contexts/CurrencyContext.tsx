import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'UYU' | 'USD' | 'ARS';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number, fromCurrency: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const exchangeRates: Record<Currency, number> = {
  UYU: 1,
  USD: 40,
  ARS: 0.85
};

const currencySymbols: Record<Currency, string> = {
  UYU: '$',
  USD: 'US$',
  ARS: 'AR$'
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferred_currency');
    return (saved as Currency) || 'UYU';
  });

  useEffect(() => {
    localStorage.setItem('preferred_currency', currency);
  }, [currency]);

  const convertPrice = (amount: number, fromCurrency: Currency = 'UYU'): number => {
    const amountInUYU = amount * exchangeRates[fromCurrency];
    return amountInUYU / exchangeRates[currency];
  };

  const formatPrice = (amount: number): string => {
    const converted = convertPrice(amount);
    return `${currencySymbols[currency]} ${converted.toLocaleString('es-UY', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}