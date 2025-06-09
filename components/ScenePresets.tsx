'use client'

import React from 'react'
import { useTranslation } from '../contexts/LanguageContext'
import { Coffee, BookOpen, Moon, Zap, TreePine, Waves } from 'lucide-react'

interface ScenePresetsProps {
  onApplyScene: (config: Record<string, number>, sceneName: string) => void
}

export default function ScenePresets({ onApplyScene }: ScenePresetsProps) {
  const { t } = useTranslation()
  
  const PRESET_SCENES = [
    {
      id: 'focus-work',
      name: t.scenePresets.scenes.focusMode.name,
      icon: Zap,
      description: t.scenePresets.scenes.focusMode.description,
      config: { rain: 0.6, people: 0.4, thunder: 0.1 },
      gradient: 'from-yellow-400 to-orange-500',
      backgroundImage: '/images/Focus%20Mode.jpg'
    },
    {
      id: 'study-session',
      name: t.scenePresets.scenes.studySession.name,
      icon: BookOpen,
      description: t.scenePresets.scenes.studySession.description,
      config: { rain: 0.7, sbowl: 0.3, wind: 0.2 },
      gradient: 'from-green-400 to-blue-500',
      backgroundImage: '/images/Study%20Session.jpg'
    },
    {
      id: 'sleep-time',
      name: t.scenePresets.scenes.stormyNight.name,
      icon: Moon,
      description: t.scenePresets.scenes.stormyNight.description,
      config: { rain: 0.8, wind: 0.3, crickets: 0.2 },
      gradient: 'from-purple-400 to-indigo-600',
      backgroundImage: '/images/Stormy%20Night.jpg'
    },
    {
      id: 'coffee-shop',
      name: t.scenePresets.scenes.coffeeShop.name,
      icon: Coffee,
      description: t.scenePresets.scenes.coffeeShop.description,
      config: { people: 0.7, rain: 0.3, wind: 0.2 },
      gradient: 'from-amber-400 to-brown-500',
      backgroundImage: '/images/Coffee%20Shop.jpg'
    },
    {
      id: 'nature-escape',
      name: t.scenePresets.scenes.forestWalk.name,
      icon: TreePine,
      description: t.scenePresets.scenes.forestWalk.description,
      config: { wind: 0.6, crickets: 0.4, sbowl: 0.3 },
      gradient: 'from-green-400 to-emerald-600',
      backgroundImage: '/images/Forest%20Walk.jpg'
    },
    {
      id: 'ocean-waves',
      name: t.scenePresets.scenes.relaxation.name,
      icon: Waves,
      description: t.scenePresets.scenes.relaxation.description,
      config: { waves: 0.8, wind: 0.3, crickets: 0.2 },
      gradient: 'from-blue-400 to-cyan-600',
      backgroundImage: '/images/Relaxation.jpg'
    }
  ]
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.scenePresets.title}</h2>
      <p className="text-gray-600 mb-6">{t.scenePresets.subtitle}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_SCENES.map(scene => {
          const IconComponent = scene.icon
          return (
            <div 
              key={scene.id}
              className="group cursor-pointer"
              onClick={() => onApplyScene(scene.config as unknown as Record<string, number>, scene.name)}
            >
              <div 
                className="relative p-6 rounded-lg hover:shadow-lg transition-all duration-300 group-hover:scale-105 overflow-hidden h-48"
                style={{
                  backgroundImage: `url(${scene.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* 渐变遮罩层 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} opacity-20`}></div>
                
                {/* 内容层 */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                      <h3 className="font-semibold text-lg text-white">{scene.name}</h3>
                    </div>
                    <p className="text-white/90 text-sm line-clamp-2">{scene.description}</p>
                  </div>
                  
                  {/* 音频层级指示器 */}
                  <div className="mt-4 flex gap-1 flex-wrap">
                    {Object.entries(scene.config).map(([sound, volume], index) => (
                      <div 
                        key={sound}
                        className="bg-white/30 backdrop-blur-sm rounded-full px-2 py-1"
                      >
                        <span className="text-xs text-white/90">{sound}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 