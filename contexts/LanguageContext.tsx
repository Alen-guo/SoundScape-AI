'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Language, Translations, translations } from '../lib/i18n'
import { detectUserLanguage } from '../lib/languageDetection'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const detectedLanguage = await detectUserLanguage()
        setLanguage(detectedLanguage)
      } catch (error) {
        console.warn('Failed to detect language, using English:', error)
        setLanguage('en')
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isLoading
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook for using language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for getting translation function
export function useTranslation() {
  const { t, language, setLanguage, isLoading } = useLanguage()
  return { t, language, setLanguage, isLoading }
} 