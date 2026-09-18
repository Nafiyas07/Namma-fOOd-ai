import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types.js';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

export const translations: Translations = {
  tagline: {
    en: 'See food differently.',
    ta: 'உணவை புதிய கோணத்தில் காணுங்கள்.',
  },
  heroLabel: {
    en: 'AI-POWERED FOOD INTELLIGENCE',
    ta: 'செயற்கை நுண்ணறிவு உணவுப் பகுப்பாய்வு',
  },
  heroDesc: {
    en: 'Understand what your food reveals through AI-assisted visual analysis, contextual intelligence, and practical guidance.',
    ta: 'புகைப்படப் பகுப்பாய்வு மற்றும் சூழல் சார்ந்த அறிவாற்றல் மூலம் உங்கள் உணவு வெளிப்படுத்தும் சுகாதாரத் தகவல்களை அறிந்து கொள்ளுங்கள்.',
  },
  analyzeFood: {
    en: 'Analyze food',
    ta: 'உணவை பகுப்பாய்வு செய்',
  },
  exploreHowItWorks: {
    en: 'Explore how it works',
    ta: 'இது எவ்வாறு இயங்குகிறது?',
  },
  navAnalyze: {
    en: 'Analyze',
    ta: 'பகுப்பாய்வு',
  },
  navHistory: {
    en: 'History',
    ta: 'வரலாறு',
  },
  navAssistant: {
    en: 'Assistant',
    ta: 'உதவியாளர்',
  },
  navHowItWorks: {
    en: 'Architecture',
    ta: 'கட்டமைப்பு',
  },
  navProfile: {
    en: 'Profile',
    ta: 'சுயவிவரம்',
  },
  navSignIn: {
    en: 'Sign In',
    ta: 'உள்நுழைக',
  },
  bringIntoFocus: {
    en: 'Bring your food into focus.',
    ta: 'உங்கள் உணவை தெளிவான பார்வைக்கு கொண்டுவாருங்கள்.',
  },
  visualInsight: {
    en: 'VISUAL INSIGHT',
    ta: 'பார்வை மதிப்பீடு',
  },
  hygieneIndicators: {
    en: 'Hygiene indicators',
    ta: 'சுகாதார குறிகாட்டிகள்',
  },
  visualQuality: {
    en: 'Visual quality',
    ta: 'காட்சித் தரம்',
  },
  servingCondition: {
    en: 'Serving condition',
    ta: 'பரிமாறும் நிலை',
  },
  whatWeNoticed: {
    en: 'WHAT WE NOTICED',
    ta: 'நாங்கள் கவனித்தவை',
  },
  simpleSuggestion: {
    en: 'A SIMPLE SUGGESTION',
    ta: 'எளிய வழிகாட்டல்',
  },
  confidence: {
    en: 'CONFIDENCE',
    ta: 'நம்பகத்தன்மை அளவு',
  },
  limitations: {
    en: 'LIMITATIONS',
    ta: 'வரம்புகள்',
  },
  limitationsNote: {
    en: 'FoodLens AI evaluates visible characteristics from an image. It cannot confirm chemical, microbial, or laboratory-level food safety.',
    ta: 'FoodLens AI புகைப்படத்தில் தெரியும் வெளிப்புறத் தன்மைகளை மட்டுமே மதிப்பீடு செய்கிறது. இது இரசாயன அல்லது நுண்ணுயிர் ஆய்வக பரிசோதனைக்கு சமமானதல்ல.',
  },
  analyzeAnother: {
    en: 'Analyze another',
    ta: 'மற்றொரு உணவை ஆராய்',
  },
  saveAnalysis: {
    en: 'Save analysis',
    ta: 'சேமிக்க',
  },
  shareInsight: {
    en: 'Share insight',
    ta: 'பகிர்க',
  },
  assistantName: {
    en: 'FoodLens Assistant',
    ta: 'FoodLens உதவியாளர்',
  },
  emptyHistoryTitle: {
    en: 'Your food story starts here.',
    ta: 'உங்கள் உணவு வரலாறு இங்கே தொடங்குகிறது.',
  },
  emptyHistoryBtn: {
    en: 'Analyze your first food',
    ta: 'உங்கள் முதல் உணவை பகுப்பாய்வு செய்யுங்கள்',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('foodlens_preferred_lang');
    return (saved === 'ta' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('foodlens_preferred_lang', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ta' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
