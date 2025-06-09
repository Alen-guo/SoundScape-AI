'use client'

import React from 'react'
import { Globe } from 'lucide-react'
import { Language, languages } from '../lib/i18n'
import { saveLanguagePreference } from '../lib/languageDetection'

interface LanguageSwitcherProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const handleLanguageChange = (language: Language) => {
    saveLanguagePreference(language)
    onLanguageChange(language)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languages[currentLanguage]}</span>
        <span className="sm:hidden">{currentLanguage.toUpperCase()}</span>
        <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {Object.entries(languages).map(([lang, label]) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
              currentLanguage === lang 
                ? 'bg-blue-50 text-blue-600 font-medium' 
                : 'text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{label}</span>
              {currentLanguage === lang && (
                <span className="text-blue-500">✓</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 