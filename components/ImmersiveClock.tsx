'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, Maximize } from 'lucide-react'

interface ImmersiveClockProps {
  isOpen: boolean
  onClose: () => void
  timerSeconds?: number // 定时器剩余秒数
  totalSeconds?: number // 定时器总秒数
  isTimerActive?: boolean
}

export default function ImmersiveClock({ isOpen, onClose, timerSeconds = 0, totalSeconds = 0, isTimerActive = false }: ImmersiveClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // 进入真正的全屏模式
  useEffect(() => {
    if (!isOpen) return

    const enterFullscreen = async () => {
      try {
        if (containerRef.current && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen()
        }
      } catch (error) {
        console.log('无法进入全屏模式:', error)
      }
    }

    enterFullscreen()

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error)
      }
    }
  }, [isOpen])

  // 处理键盘ESC退出和全屏状态变化
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitImmersive()
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [isOpen, onClose])

  const exitImmersive = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.log('退出全屏失败:', error)
    }
    onClose()
  }

  if (!isOpen) return null

  // 格式化时间为两位数
  const formatTwoDigits = (num: number) => num.toString().padStart(2, '0')

  // 获取当前时间
  const hours = formatTwoDigits(currentTime.getHours())
  const minutes = formatTwoDigits(currentTime.getMinutes())
  const seconds = formatTwoDigits(currentTime.getSeconds())

  // 获取定时器时间
  const timerMins = Math.floor(timerSeconds / 60)
  const timerSecs = timerSeconds % 60
  const timerDisplay = `${formatTwoDigits(timerMins)}:${formatTwoDigits(timerSecs)}`

  // 获取日期信息
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const weekday = weekdays[currentTime.getDay()]
  const month = months[currentTime.getMonth()]
  const date = currentTime.getDate()
  const year = currentTime.getFullYear()

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 z-50 flex flex-col items-center justify-center text-white overflow-hidden"
    >
      {/* 柔和科技感背景 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px, 200px 200px, 100px 100px, 100px 100px'
        }} />
      </div>

      {/* 柔和的动态光效 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-4000"></div>
      </div>

      {/* 关闭按钮 */}
      <button
        onClick={exitImmersive}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 p-2 sm:p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-full transition-all duration-300 z-10 backdrop-blur-md"
        title="Exit Fullscreen (ESC)"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
      </button>

      {/* 主时钟显示 */}
      <div className="flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-12 px-4 w-full max-w-7xl">
        {/* 数字时钟 */}
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8 relative z-10 justify-center w-full">
          <TimeDigit value={hours} size="large" />
          <SoftSeparator />
          <TimeDigit value={minutes} size="large" />
          <SoftSeparator />
          <TimeDigit value={seconds} size="small" />
        </div>

        {/* 日期显示 */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light tracking-wide">{weekday}</div>
          <div className="text-sm sm:text-base md:text-lg text-gray-400 font-light">{month} {date}, {year}</div>
        </div>

        {/* 定时器显示 */}
        {isTimerActive && (
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 mt-8 sm:mt-12 md:mt-20 relative z-10 w-full">
            <div className="text-base sm:text-lg md:text-xl text-cyan-300 mb-4 sm:mb-6 md:mb-8 font-light tracking-wider">
              🍅 POMODORO TIMER
            </div>
            
            {/* 定时器数字显示 */}
            <div className="relative px-2">
              <div className="bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-black/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-400/5 to-indigo-400/5"></div>
                <span 
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-cyan-100 font-mono tracking-wider relative z-10"
                  style={{ 
                    textShadow: '0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)' 
                  }}
                >
                  {timerDisplay}
                </span>
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-2 bg-gray-800/30 rounded-full overflow-hidden backdrop-blur-sm mx-auto">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-1000 rounded-full"
                style={{ 
                  width: `${totalSeconds > 0 ? (timerSeconds / totalSeconds) * 100 : 0}%`,
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
                }}
              />
            </div>
            
            {/* 剩余时间文字 */}
            <div className="text-xs sm:text-sm text-cyan-300/70 font-light tracking-wide">
              {Math.floor(timerSeconds / 60)} MINUTES REMAINING
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 时间数字组件
interface TimeDigitProps {
  value: string
  size: 'large' | 'small'
}

function TimeDigit({ value, size }: TimeDigitProps) {
  const isLarge = size === 'large'
  
  return (
    <div className="relative flex-shrink-0">
      <div className="relative flex items-center justify-center">
        <span 
          className={`${
            isLarge 
              ? 'text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem]' 
              : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
          } font-extralight text-white font-mono tracking-wider transition-all duration-700 ease-out`}
          style={{ 
            textShadow: isLarge 
              ? '0 0 40px rgba(255, 255, 255, 0.1), 0 0 80px rgba(99, 102, 241, 0.1)' 
              : '0 0 30px rgba(255, 255, 255, 0.08), 0 0 60px rgba(99, 102, 241, 0.08)',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
          }}
        >
          {value}
        </span>
        
        {/* 柔和的发光效果 */}
        <div 
          className={`absolute inset-0 ${
            isLarge ? 'blur-lg' : 'blur-md'
          } opacity-20`}
        >
          <span 
            className={`${
              isLarge 
                ? 'text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem]' 
                : 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
            } font-extralight text-indigo-400 font-mono tracking-wider`}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}

// 柔和分隔符组件
function SoftSeparator() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full opacity-60"
        style={{ 
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' 
        }}
      />
      <div 
        className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full opacity-60"
        style={{ 
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)' 
        }}
      />
    </div>
  )
}