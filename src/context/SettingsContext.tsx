import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "EN" | "SI" | "AR" | "DE" | "ZH";
export type Currency = "LKR" | "USD" | "EUR" | "GBP" | "AUD";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  exchangeRates: Record<string, number>;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations: Record<string, Record<Language, string>> = {
  "Free Shipping On All Orders": { EN: "Free Shipping On All Orders", SI: "සියලුම ඇණවුම් සඳහා නොමිලේ ප්‍රවාහනය", AR: "شحن مجاني لجميع الطلبات", DE: "Kostenloser Versand für alle Bestellungen", ZH: "所有订单免运费" },
  "Home": { EN: "Home", SI: "මුල් පිටුව", AR: "الرئيسية", DE: "Startseite", ZH: "主页" },
  "All Gems": { EN: "All Gems", SI: "සියලුම මැණික්", AR: "جميع الأحجار الكريمة", DE: "Alle Edelsteine", ZH: "所有宝石" },
  "Sapphires": { EN: "Sapphires", SI: "නිල් මැණික්", AR: "الياقوت", DE: "Saphire", ZH: "蓝宝石" },
  "Rubies": { EN: "Rubies", SI: "රතු මැණික්", AR: "الياقوت الأحمر", DE: "Rubine", ZH: "红宝石" },
  "Emeralds": { EN: "Emeralds", SI: "මරකත", AR: "الزمرد", DE: "Smaragde", ZH: "祖母绿" },
  "Search gems...": { EN: "Search gems...", SI: "මැණික් සොයන්න...", AR: "البحث عن الأحجار...", DE: "Edelsteine suchen...", ZH: "搜索宝石..." },
  "Admin Dashboard": { EN: "Admin Dashboard", SI: "පරිපාලක පුවරුව", AR: "لوحة تحكم المشرف", DE: "Admin-Dashboard", ZH: "管理面板" },
  "Shop Collection": { EN: "Shop Collection", SI: "එකතුව බලන්න", AR: "تسوق المجموعة", DE: "Kollektion ansehen", ZH: "选购系列" },
  "Our Heritage": { EN: "Our Heritage", SI: "අපේ උරුමය", AR: "تراثنا", DE: "Unser Erbe", ZH: "我们的传承" },
  "Secure Checkout": { EN: "Secure Checkout", SI: "ආරක්ෂිත ගෙවීම", AR: "دفع آمن", DE: "Sicherer Checkout", ZH: "安全结账" },
  "Delivery to Home": { EN: "Delivery to Home", SI: "නිවසටම ගෙන්වාගන්න", AR: "التوصيل للمنزل", DE: "Lieferung nach Hause", ZH: "送货上门" },
  "Buy at Shop": { EN: "Buy at Shop", SI: "කඩෙන් මිලදීගන්න", AR: "الشراء من المتجر", DE: "Im Geschäft kaufen", ZH: "在店内购买" },
  "Card Payment": { EN: "Card Payment", SI: "කාඩ්පතෙන් ගෙවන්න", AR: "الدفع بالبطاقة", DE: "Kartenzahlung", ZH: "银行卡支付" },
  "Cash On Delivery": { EN: "Cash On Delivery", SI: "භාණ්ඩ ලැබුණු පසු ගෙවන්න", AR: "الدفع عند الاستلام", DE: "Nachnahme", ZH: "货到付款" },
  "Total": { EN: "Total", SI: "එකතුව", AR: "المجموع", DE: "Gesamt", ZH: "总计" },
  "Subtotal": { EN: "Subtotal", SI: "අතුරු එකතුව", AR: "المجموع الفرعي", DE: "Zwischensumme", ZH: "小计" },
  "Shipping": { EN: "Shipping", SI: "ප්‍රවාහන ගාස්තු", AR: "الشحن", DE: "Versand", ZH: "运费" },
  "Free": { EN: "Free", SI: "නොමිලේ", AR: "مجاني", DE: "Kostenlos", ZH: "免费" },
  "Order Summary": { EN: "Order Summary", SI: "ඇණවුමේ සාරාංශය", AR: "ملخص الطلب", DE: "Bestellübersicht", ZH: "订单摘要" },
  "Estimated Total": { EN: "Estimated Total", SI: "ඇස්තමේන්තුගත එකතුව", AR: "المجموع التقديري", DE: "Geschätzte Gesamtsumme", ZH: "预计总计" },
  "Calculated at checkout": { EN: "Calculated at checkout", SI: "ගෙවීමේදී ගණනය කෙරේ", AR: "محسوب عند الدفع", DE: "An der Kasse berechnet", ZH: "结账时计算" },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("wg_lang") as Language) || "EN");
  const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem("wg_curr") as Currency) || "LKR");
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ LKR: 1 });

  useEffect(() => {
    localStorage.setItem("wg_lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("wg_curr", currency);
  }, [currency]);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/LKR")
      .then(res => res.json())
      .then(data => {
        if (data && data.rates) {
          setExchangeRates(data.rates);
        }
      })
      .catch(err => console.error("Failed to fetch exchange rates:", err));
  }, []);

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, currency, setCurrency, exchangeRates, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
