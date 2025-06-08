'use client'

import React, { useState, useEffect } from 'react'
import AudioMixer from '../components/AudioMixer'
import ScenePresets from '../components/ScenePresets'
import AIPrompt from '../components/AIPrompt'
import PlayerControls from '../components/PlayerControls'
import Header from '../components/Header'

export default function HomePage() {
  const [volumes, setVolumes] = useState<Record<string, number>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentScene, setCurrentScene] = useState<string>('')
  const [isTimerActive, setIsTimerActive] = useState(false)

  // 保存用户设置到localStorage
  useEffect(() => {
    const savedVolumes = localStorage.getItem('soundscape-volumes')
    if (savedVolumes) {
      setVolumes(JSON.parse(savedVolumes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('soundscape-volumes', JSON.stringify(volumes))
  }, [volumes])

  const handleVolumeChange = (soundId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }))
  }

  const handleApplyScene = (sceneConfig: Record<string, number>, sceneName: string) => {
    setVolumes(sceneConfig)
    setCurrentScene(sceneName)
    setIsPlaying(true)
  }

  const handleGenerateFromPrompt = (prompt: string, config: Record<string, number>, confidence: number) => {
    const sceneName = `🧠 AI Generated (${confidence}%): ${prompt.slice(0, 30)}${prompt.length > 30 ? '...' : ''}`
    handleApplyScene(config, sceneName)
  }

  const handleStopAll = () => {
    setIsPlaying(false)
    setVolumes({})
    setCurrentScene('')
    // 定时器状态由PlayerControls管理，这里只重置音频相关状态
  }

  const handleAutoPlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)
      
      // 如果没有任何音量设置，提供一个默认的专注音景
      const hasAnyVolume = Object.values(volumes).some(volume => volume > 0)
      if (!hasAnyVolume) {
        const defaultScene = {
          rain: 0.4,
          fire: 0.25,
          wind: 0.15,
          waves: 0.2
        }
        setVolumes(defaultScene)
        setCurrentScene('🍅 Timer Started - Auto-Applied Default Focus Mix (Rain + Fireplace + Wind + Ocean)')
      } else {
        setCurrentScene('🍅 Timer Started - Auto Playing')
      }
    }
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
      // 开始播放时检查是否有音量设置
      const hasAnyVolume = Object.values(volumes).some(volume => volume > 0)
      if (!hasAnyVolume) {
        // 没有音量设置时，自动应用默认音景
        const defaultScene = {
          rain: 0.4,
          fire: 0.25,
          wind: 0.15,
          waves: 0.2
        }
        setVolumes(defaultScene)
        setCurrentScene('🎵 Default Focus Mix Applied - No empty play! (Rain + Fireplace + Wind + Ocean)')
      }
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl w-full">
        <Header />
        
        <div className="space-y-8">
          {/* 场景预设 */}
          <ScenePresets onApplyScene={handleApplyScene} />
          
          {/* 当前场景显示 */}
          {currentScene && (
            <div className={`rounded-lg p-4 ${
              currentScene.includes('Default Focus Mix') || currentScene.includes('Auto-Applied')
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`${
                currentScene.includes('Default Focus Mix') || currentScene.includes('Auto-Applied')
                  ? 'text-green-800'
                  : 'text-blue-800'
              }`}>
                🎵 Current Scene: <span className="font-semibold">{currentScene}</span>
                {(currentScene.includes('Default Focus Mix') || currentScene.includes('Auto-Applied')) && (
                  <span className="ml-2 text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">Auto-Applied</span>
                )}
              </p>
            </div>
          )}
          
          {/* 播放控制 */}
          <PlayerControls 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStop={() => {
              setIsPlaying(false)
              setVolumes({})
              setCurrentScene('')
            }}
            onAutoPlay={handleAutoPlay}
          />
          
          {/* 音频混合器 */}
          <AudioMixer 
            volumes={volumes}
            onVolumeChange={handleVolumeChange}
            isPlaying={isPlaying}
            onStop={handleStopAll}
            isTimerActive={isTimerActive}
          />
          
          {/* AI功能 - 开发中 */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
              <div className="text-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="text-4xl mb-3">🚧</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Feature Coming Soon!</h3>
                <p className="text-gray-600 text-sm mb-3">
                  We're working hard to bring you AI-powered soundscape generation.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>In Development</span>
                </div>
              </div>
            </div>
            <div className="opacity-30 pointer-events-none">
              <AIPrompt onGenerateScene={handleGenerateFromPrompt} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 space-y-2">
          <p>Built with ❤️ for better focus and relaxation</p>
          <p className="text-sm text-gray-400">
            🤖 AI-powered features coming soon • Stay tuned for smart soundscape generation
          </p>
        </footer>
      </div>
    </div>
  )
} 