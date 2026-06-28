import { useSettings } from "@/context/SettingsContext";

export function useFormatCurrency() {
  const { currency, exchangeRates } = useSettings();

  return (amount: number): string => {
    let converted = amount;
    if (currency !== "LKR" && exchangeRates[currency]) {
      converted = amount * exchangeRates[currency];
    }
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };
}
