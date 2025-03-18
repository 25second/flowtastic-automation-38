
import React, { createContext } from 'react';
import { LanguageContextType } from '@/types/language';

// Create the context with undefined as default value
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Re-export from the new location for backward compatibility
export { translations } from '@/translations';
export { LanguageProvider } from '@/providers/LanguageProvider';
export { useLanguage } from '@/hooks/useLanguage';
