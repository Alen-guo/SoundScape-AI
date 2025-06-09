'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from '../contexts/LanguageContext'
import { Volume2, VolumeX, Square } from 'lucide-react'
import { Howl } from 'howler'

interface Sound {
  id: string
  name: string
  emoji: string
  url: string
  color: string
  howl?: Howl
}

interface AudioMixerProps {
  volumes: Record<string, number>
  onVolumeChange: (soundId: string, volume: number) => void
  isPlaying: boolean
  onStop: () => void
  isTimerActive?: boolean
}

// 将SOUNDS移到组件内部以便使用翻译

export default function AudioMixer({ volumes, onVolumeChange, isPlaying, onStop, isTimerActive = false }: AudioMixerProps) {
  const { t } = useTranslation()
  const soundsRef = useRef<Record<string, Howl>>({})
  const [loadedSounds, setLoadedSounds] = useState<Record<string, boolean>>({})
  const [loadErrors, setLoadErrors] = useState<Record<string, string>>({})
  const [isStopPressed, setIsStopPressed] = useState(false)
  
  const SOUNDS: Sound[] = [
    { id: 'rain', name: t.audioMixer.sounds.rain, emoji: '🌧️', url: '/sounds/rain.mp4', color: 'from-blue-400 to-blue-600' },
    { id: 'thunder', name: t.audioMixer.sounds.thunder, emoji: '⛈️', url: '/sounds/thunder.mp4', color: 'from-gray-500 to-gray-700' },
    { id: 'fire', name: t.audioMixer.sounds.fire, emoji: '🔥', url: '/sounds/fire.mp4', color: 'from-orange-400 to-red-600' },
    { id: 'wind', name: t.audioMixer.sounds.wind, emoji: '💨', url: '/sounds/wind.mp4', color: 'from-gray-300 to-gray-500' },
    { id: 'waves', name: t.audioMixer.sounds.waves, emoji: '🌊', url: '/sounds/waves.mp4', color: 'from-cyan-400 to-blue-500' },
    { id: 'crickets', name: t.audioMixer.sounds.crickets, emoji: '🦗', url: '/sounds/crickets.mp4', color: 'from-green-500 to-green-700' },
    { id: 'people', name: t.audioMixer.sounds.people, emoji: '☕', url: '/sounds/people.mp4', color: 'from-amber-400 to-brown-500' },
    { id: 'sbowl', name: t.audioMixer.sounds.sbowl, emoji: '🎎', url: '/sounds/sbowl.mp4', color: 'from-purple-400 to-indigo-600' },
  ]

  useEffect(() => {
    // Initialize audio objects with optimized settings
    const initializeAudio = async () => {
      for (const sound of SOUNDS) {
        if (!soundsRef.current[sound.id]) {
          try {
            console.log(`🔄 开始加载 ${sound.name} from ${sound.url}...`)
            
            soundsRef.current[sound.id] = new Howl({
              src: [sound.url],
              loop: true,
              volume: 0,
              html5: true,
              preload: true,
              onload: () => {
                console.log(`✅ ${sound.name} 加载成功`)
                setLoadedSounds(prev => ({ ...prev, [sound.id]: true }))
              },
              onloaderror: (id, error) => {
                console.error(`❌ ${sound.name} 加载失败:`, error, `URL: ${sound.url}`)
                setLoadErrors(prev => ({ ...prev, [sound.id]: `加载失败: ${error}` }))
              },
              onplayerror: (id, error) => {
                console.error(`❌ ${sound.name} 播放失败:`, error)
              }
            })
          } catch (error) {
            console.error(`❌ ${sound.name} 初始化失败:`, error)
            setLoadErrors(prev => ({ ...prev, [sound.id]: `初始化失败: ${error}` }))
          }
        }
      }
    }

    initializeAudio()

    return () => {
      // Cleanup audio objects
      Object.values(soundsRef.current).forEach(howl => {
        try {
          if (howl.playing()) {
            howl.stop()
          }
          howl.unload()
        } catch (error) {
          console.warn('清理音频对象时出错:', error)
        }
      })
      soundsRef.current = {}
    }
  }, [])

  useEffect(() => {
    // Control audio based on volume and playback state
    SOUNDS.forEach(sound => {
      const howl = soundsRef.current[sound.id]
      const volume = volumes[sound.id] || 0
      const isLoaded = loadedSounds[sound.id]

      if (howl && isLoaded) {
        // 设置音量
        howl.volume(volume)
        
        if (isPlaying && volume > 0) {
          // 需要播放且音量大于0
          if (!howl.playing()) {
            console.log(`🎵 开始播放 ${sound.name}, 音量: ${Math.round(volume * 100)}%`)
            howl.play()
          }
        } else {
          // 停止播放
          if (howl.playing()) {
            console.log(`⏸️ 暂停播放 ${sound.name}`)
            howl.pause()
          }
        }
      } else if (!isLoaded && loadErrors[sound.id]) {
        console.warn(`⚠️ ${sound.name} 未加载，无法播放:`, loadErrors[sound.id])
      }
    })
  }, [volumes, isPlaying, loadedSounds, loadErrors])

  const handleVolumeChange = (soundId: string, volume: number) => {
    onVolumeChange(soundId, volume)
  }

  // 停止所有音频和定时器
  const handleStopAll = () => {
    setIsStopPressed(true)
    onStop() // 调用传入的停止函数
    
    // 如果定时器重置函数存在，则调用它
    if (typeof window !== 'undefined' && (window as any).resetTimer) {
      (window as any).resetTimer()
    }
    
    // 短暂延迟后恢复按钮状态
    setTimeout(() => {
      setIsStopPressed(false)
    }, 200)
  }

  // 测试单个音频播放的函数
  const testSound = (soundId: string) => {
    const howl = soundsRef.current[soundId]
    if (howl && loadedSounds[soundId]) {
      if (howl.playing()) {
        howl.pause()
        console.log(`⏸️ 停止测试 ${soundId}`)
      } else {
        howl.volume(0.5) // 测试时设置50%音量
        howl.play()
        console.log(`🎵 测试播放 ${soundId}`)
        // 3秒后自动停止
        setTimeout(() => {
          if (howl.playing()) {
            howl.pause()
          }
        }, 3000)
      }
    } else {
      console.warn(`⚠️ ${soundId} 无法测试播放`)
    }
  }

  // 重新加载失败的音频
  const retryFailedAudio = () => {
    console.log('🔄 重新加载失败的音频...')
    Object.keys(loadErrors).forEach(soundId => {
      const sound = SOUNDS.find(s => s.id === soundId)
      if (sound) {
        // 清除错误状态
        setLoadErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[soundId]
          return newErrors
        })
        
        // 重新创建Howl实例
        if (soundsRef.current[soundId]) {
          soundsRef.current[soundId].unload()
        }
        
        soundsRef.current[soundId] = new Howl({
          src: [sound.url],
          loop: true,
          volume: 0,
          html5: true,
          preload: true,
          format: ['mp4'],
          onload: () => {
            console.log(`✅ ${sound.name} 重新加载成功`)
            setLoadedSounds(prev => ({ ...prev, [soundId]: true }))
          },
          onloaderror: (id, error) => {
            console.error(`❌ ${sound.name} 重新加载失败:`, error)
            setLoadErrors(prev => ({ ...prev, [soundId]: `重新加载失败: ${error}` }))
          }
        })
      }
    })
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{t.audioMixer.title}</h2>
          <p className="text-gray-600 mt-1">{t.audioMixer.subtitle}</p>
        </div>
        
        {/* Stop All Button */}
        <button
          onClick={handleStopAll}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 transform ${
            isStopPressed ? 'scale-95' : 'scale-100'
          } ${
            isPlaying || isTimerActive
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 text-white active:scale-95'
              : 'bg-gray-100 hover:bg-gray-200 hover:scale-105 text-gray-600 active:scale-95'
          } disabled:cursor-not-allowed`}
          title={isPlaying || isTimerActive ? t.audioMixer.stopButton : 'Stop (nothing playing)'}
        >
          <Square 
            className={`w-4 h-4 transition-all duration-200 ${
              isPlaying || isTimerActive ? 'text-white' : 'text-gray-600'
            } ${isStopPressed ? 'animate-pulse' : ''}`} 
          />
          <span className="text-sm font-medium">{t.audioMixer.stopButton}</span>
        </button>
      </div>
      
      {/* 加载状态显示 */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Audio Status:</span>
            <span className={`${Object.keys(loadedSounds).length === SOUNDS.length ? 'text-green-600' : 'text-yellow-600'}`}>
              {Object.keys(loadedSounds).length}/{SOUNDS.length} loaded
            </span>
            {Object.keys(loadErrors).length > 0 && (
              <>
                <span className="text-red-600">
                  {Object.keys(loadErrors).length} errors
                </span>
                <button
                  onClick={retryFailedAudio}
                  className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                >
                  {t.audioMixer.retryButton}
                </button>
              </>
            )}
          </div>
          
          {/* 预加载进度条 */}
          {Object.keys(loadedSounds).length < SOUNDS.length && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(Object.keys(loadedSounds).length / SOUNDS.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((Object.keys(loadedSounds).length / SOUNDS.length) * 100)}%
              </span>
            </div>
          )}
          
          {/* 全部加载完成提示 */}
          {Object.keys(loadedSounds).length === SOUNDS.length && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <span>🎵</span>
              <span>Ready to play!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {SOUNDS.map(sound => (
          <SoundControl
            key={sound.id}
            sound={sound}
            volume={volumes[sound.id] || 0}
            onVolumeChange={(volume) => handleVolumeChange(sound.id, volume)}
            isPlaying={isPlaying && (volumes[sound.id] || 0) > 0}
            isLoaded={loadedSounds[sound.id] || false}
            loadError={loadErrors[sound.id]}
            onTest={() => testSound(sound.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface SoundControlProps {
  sound: Sound
  volume: number
  onVolumeChange: (volume: number) => void
  isPlaying: boolean
  isLoaded: boolean
  loadError?: string
  onTest: () => void
}

function SoundControl({ sound, volume, onVolumeChange, isPlaying, isLoaded, loadError, onTest }: SoundControlProps) {
  const { t } = useTranslation()
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 h-52">
      {/* Sound icon and name */}
      <div className="text-center mb-4">
        <div 
          className={`w-12 h-12 bg-gradient-to-br ${sound.color} rounded-full flex items-center justify-center mx-auto mb-3 cursor-pointer transition-all ${
            isPlaying ? 'animate-pulse-slow' : ''
          } ${!isLoaded ? 'opacity-50' : 'hover:scale-105'}`}
          onClick={onTest}
          title={isLoaded ? t.audioMixer.testButton : `${t.audioMixer.loadingText}...`}
        >
          <span className="text-xl">{sound.emoji}</span>
        </div>
        <h3 className="font-medium text-gray-800 text-sm">{sound.name}</h3>
        
        {/* 加载状态指示器 */}
        <div className="text-xs mt-2 h-4">
          {!isLoaded && !loadError && (
            <span className="text-yellow-600">{t.audioMixer.loadingText}...</span>
          )}
          {isLoaded && (
            <span className="text-green-600">{t.audioMixer.loadedText}</span>
          )}
          {loadError && (
            <span className="text-red-600" title={loadError}>Error</span>
          )}
        </div>
      </div>

      {/* Volume slider */}
      <div className="space-y-3 mb-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${volume * 100}%, rgb(229, 231, 235) ${volume * 100}%, rgb(229, 231, 235) 100%)`
          }}
        />
        
        {/* Volume indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <VolumeX className="w-3 h-3" />
          <span>{Math.round(volume * 100)}%</span>
          <Volume2 className="w-3 h-3" />
        </div>
      </div>

      {/* Playing status indicator - 底部固定区域 */}
      <div className="flex justify-center items-end h-5">
        {isPlaying && (
          <div className="flex gap-1 items-end">
            {[6, 10, 8, 12].map((height, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500 rounded-full wave-bar"
                style={{ 
                  height: `${height}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 