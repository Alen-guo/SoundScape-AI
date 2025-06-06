'use client'

import React from 'react'
import { Coffee, BookOpen, Moon, Zap, TreePine, Waves } from 'lucide-react'

interface ScenePresetsProps {
  onApplyScene: (config: Record<string, number>, sceneName: string) => void
}

const PRESET_SCENES = [
  {
    id: 'focus-work',
    name: 'Deep Focus',
    icon: Zap,
    description: 'Perfect for coding and deep work',
    config: { rain: 0.6, people: 0.4, thunder: 0.1 },
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'study-session',
    name: 'Study Session',
    icon: BookOpen,
    description: 'Library atmosphere for learning',
    config: { rain: 0.7, sbowl: 0.3, wind: 0.2 },
    gradient: 'from-green-400 to-blue-500'
  },
  {
    id: 'sleep-time',
    name: 'Sleep Time',
    icon: Moon,
    description: 'Peaceful sounds for better sleep',
    config: { rain: 0.8, wind: 0.3, crickets: 0.2 },
    gradient: 'from-purple-400 to-indigo-600'
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    icon: Coffee,
    description: 'Cozy cafe atmosphere',
    config: { people: 0.7, rain: 0.3, wind: 0.2 },
    gradient: 'from-amber-400 to-brown-500'
  },
  {
    id: 'nature-escape',
    name: 'Nature Escape',
    icon: TreePine,
    description: 'Forest sounds for meditation',
    config: { wind: 0.6, crickets: 0.4, sbowl: 0.3 },
    gradient: 'from-green-400 to-emerald-600'
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    icon: Waves,
    description: 'Beach vibes for relaxation',
    config: { waves: 0.8, wind: 0.3, crickets: 0.2 },
    gradient: 'from-blue-400 to-cyan-600'
  }
]

export default function ScenePresets({ onApplyScene }: ScenePresetsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">🎯 Quick Scene Presets</h2>
      <p className="text-gray-600 mb-6">Choose a pre-designed soundscape for different activities</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_SCENES.map(scene => {
          const IconComponent = scene.icon
          return (
            <div 
              key={scene.id}
              className="group cursor-pointer"
              onClick={() => onApplyScene(scene.config as unknown as Record<string, number>, scene.name)}
            >
              <div className={`bg-gradient-to-br ${scene.gradient} p-6 rounded-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="w-6 h-6 text-white" />
                  <h3 className="font-semibold text-lg text-white">{scene.name}</h3>
                </div>
                <p className="text-white/90 text-sm">{scene.description}</p>
                
                {/* 音频层级指示器 */}
                <div className="mt-4 flex gap-1">
                  {Object.entries(scene.config).map(([sound, volume], index) => (
                    <div 
                      key={sound}
                      className="bg-white/30 rounded-full px-2 py-1"
                    >
                      <span className="text-xs text-white/90">{sound}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 