'use client'

import React from 'react'
import { Waves } from 'lucide-react'

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
          <Waves className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SoundScape AI
        </h1>
      </div>
      
      <p className="text-xl text-gray-600 mb-2">
        Create perfect ambient soundscapes for better focus
      </p>
      
      <p className="text-gray-500">
        Mix nature sounds, white noise, and atmospheric audio for focus, relaxation, and productivity
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