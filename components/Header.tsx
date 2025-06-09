'use client'

import React from 'react'
import { useTranslation } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { Waves } from 'lucide-react'

export default function Header() {
  const { t, language, setLanguage } = useTranslation()
  
  return (
    <header className="text-center mb-12">
      {/* Language Switcher */}
      <div className="flex justify-end mb-6">
        <LanguageSwitcher 
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Waves className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t.header.title}
        </h1>
      </div>
      
      <p className="text-xl text-gray-600 mb-2">
        {t.header.subtitle}
      </p>
      
      <p className="text-gray-500">
        {t.header.description}
      </p>
      
      {/* 音频波形可视化装饰 */}
      <div className="flex justify-center gap-1 mt-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full wave-bar"
            style={{ 
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </header>
  )
} 