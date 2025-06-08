'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Square, RotateCcw, Timer, Clock, PauseCircle, PlayCircle, Maximize2 } from 'lucide-react'
import ImmersiveClock from './ImmersiveClock'

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onStop: () => void
  onAutoPlay?: () => void // 新增：自动播放回调
}

export default function PlayerControls({ isPlaying, onPlayPause, onStop, onAutoPlay }: PlayerControlsProps) {
  const [customMinutes, setCustomMinutes] = useState<string>('25')
  const [totalSeconds, setTotalSeconds] = useState<number>(0) // 总时间（秒）
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0) // 剩余时间（秒）
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const [isImmersiveOpen, setIsImmersiveOpen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 格式化时间显示 (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 开启定时器
  const startTimer = (minutes: number) => {
    const seconds = minutes * 60
    setTotalSeconds(seconds)
    setRemainingSeconds(seconds)
    setIsTimerActive(true)
    setIsTimerPaused(false)
    
    // 自动启动音乐播放
    if (!isPlaying && onAutoPlay) {
      onAutoPlay()
    }
    
    if (seconds > 0) {
      // 每秒更新倒计时
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // 时间到了
            onStop()
            setIsTimerActive(false)
            setIsTimerPaused(false)
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // 暂停/恢复定时器
  const toggleTimerPause = () => {
    if (isTimerPaused) {
      // 恢复定时器
      setIsTimerPaused(false)
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            onStop()
            setIsTimerActive(false)
            setIsTimerPaused(false)
            if (timerRef.current) {
              clearInterval(timerRef.current)
              timerRef.current = null
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      // 暂停定时器
      setIsTimerPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  // 重置定时器
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsTimerActive(false)
    setIsTimerPaused(false)
    setTotalSeconds(0)
    setRemainingSeconds(0)
  }

  // 处理停止功能（由AudioMixer中的Stop按钮调用resetTimer）
  const handleResetTimer = () => {
    resetTimer()
  }

  // 暴露resetTimer给外部调用
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).resetTimer = resetTimer
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).resetTimer
      }
    }
  }, [])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🎮 Playback Controls</h2>
      </div>
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:gap-6">
        {/* 主控制按钮 */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onPlayPause}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all"
            title="Reset all settings"
          >
            <RotateCcw className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Timer Controls */}
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:gap-4 w-full">
          <div className="flex items-center gap-2 justify-center lg:justify-start">
            <Timer className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Timer:</span>
          </div>
          
          {/* Custom Timer Input + Preset Buttons */}
          <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:gap-2 w-full">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="25"
                  className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTimerActive}
                />
                <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">m</span>
              </div>
              
              <button
                onClick={() => startTimer(parseInt(customMinutes) || 25)}
                disabled={isTimerActive || !customMinutes}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                title={`Start ${customMinutes || 25}min timer ${!isPlaying ? '+ auto-play music' : ''}`}
              >
                <span className="flex items-center gap-1">
                  Start
                  {!isPlaying && <span className="text-xs">♪</span>}
                </span>
              </button>
            </div>
            
            {/* Preset Buttons */}
            <div className="flex flex-wrap gap-1 justify-center lg:justify-start">
              {[3, 5, 25, 30, 45].map((minutes) => {
                const isPomodoro = minutes === 25
                return (
                  <button
                    key={minutes}
                    onClick={() => startTimer(minutes)}
                    disabled={isTimerActive}
                    className={`px-2 py-1 text-xs rounded transition-all relative transform ${
                      isPomodoro
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 hover:shadow-lg text-white shadow-md disabled:from-red-300 disabled:to-red-300 border border-red-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 disabled:bg-gray-200'
                    } disabled:cursor-not-allowed disabled:transform-none`}
                    title={isPomodoro ? 'Pomodoro Focus Timer (25 min)' : `${minutes} minutes timer`}
                  >
                    <span className="flex items-center gap-1">
                      {isPomodoro && <span className="text-xs">🍅</span>}
                      {minutes}m
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Player Status & Immersive Button */}
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4 justify-center lg:justify-start">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isPlaying ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-gray-600">
              {isPlaying ? 'Playing' : 'Stopped'}
            </span>
          </div>
          
          {/* Immersive Mode Button */}
          <button
            onClick={() => setIsImmersiveOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg transition-all hover:shadow-lg hover:scale-105 transform"
            title="Enter Immersive Clock Mode"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-sm font-medium">Immersive</span>
          </button>
        </div>
      </div>
      
      {/* Timer Display & Controls */}
      {isTimerActive && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
            {/* Circular Progress */}
            <div className="relative w-16 h-16 flex-shrink-0 mx-auto sm:mx-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {/* Progress circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray={`${totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0}, 100`}
                  className="transition-all duration-1000 ease-linear"
                />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center time display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-mono text-gray-700 font-semibold">
                  {formatTime(remainingSeconds)}
                </span>
              </div>
            </div>
            
            {/* Timer Info & Controls */}
            <div className="flex-1 flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    isTimerPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'
                  }`} />
                  <span className="text-gray-600">
                    {isTimerPaused ? 'Timer Paused' : 'Timer Running'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Total: {formatTime(totalSeconds)}
                </div>
              </div>
              
              {/* Timer Control Buttons */}
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={toggleTimerPause}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm"
                >
                  {isTimerPaused ? (
                    <>
                      <PlayCircle className="w-4 h-4 text-green-600" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-4 h-4 text-yellow-600" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetTimer}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Immersive Clock */}
      <ImmersiveClock 
        isOpen={isImmersiveOpen}
        onClose={() => setIsImmersiveOpen(false)}
        timerSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        isTimerActive={isTimerActive && !isTimerPaused}
      />
    </div>
  )
} 