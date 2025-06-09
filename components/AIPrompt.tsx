'use client'

import React, { useState } from 'react'
import { useTranslation } from '../contexts/LanguageContext'
import { Sparkles, Wand2, Brain, Lightbulb } from 'lucide-react'

interface AIPromptProps {
  onGenerateScene: (prompt: string, config: Record<string, number>, confidence: number) => void
}

// 🧠 Smart Scene Knowledge Base
const SCENE_KNOWLEDGE = {
  work: {
    keywords: ['work', 'focus', 'coding', 'study', 'programming', 'writing', 'thinking', 'concentration', 'productive', 'office', 'task', 'project'],
    sounds: { rain: 0.6, people: 0.4, thunder: 0.2 },
    mood: 'productive',
    description: 'Focused Work Environment'
  },
  relax: {
    keywords: ['relax', 'chill', 'calm', 'meditation', 'peaceful', 'unwind', 'rest', 'zen', 'tranquil', 'serene', 'mindful'],
    sounds: { waves: 0.7, sbowl: 0.4, wind: 0.3, crickets: 0.2 },
    mood: 'peaceful',
    description: 'Relaxation & Wellness'
  },
  sleep: {
    keywords: ['sleep', 'night', 'bedtime', 'sleepy', 'tired', 'dream', 'insomnia', 'slumber', 'drowsy', 'nap'],
    sounds: { rain: 0.8, crickets: 0.3, wind: 0.2 },
    mood: 'sleepy',
    description: 'Sleep & Night Rest'
  },
  nature: {
    keywords: ['nature', 'forest', 'outdoor', 'birds', 'trees', 'wilderness', 'hiking', 'natural', 'woods', 'park'],
    sounds: { wind: 0.8, crickets: 0.5, waves: 0.3 },
    mood: 'natural',
    description: 'Natural Environment'
  },
  coffee: {
    keywords: ['coffee', 'cafe', 'social', 'chat', 'casual', 'cozy', 'study cafe', 'ambient', 'bustling', 'morning'],
    sounds: { people: 0.8, rain: 0.3, wind: 0.1 },
    mood: 'social',
    description: 'Coffee Shop Atmosphere'
  },
  storm: {
    keywords: ['storm', 'thunder', 'heavy rain', 'intense', 'dramatic', 'power', 'energy', 'lightning', 'downpour'],
    sounds: { rain: 0.9, thunder: 0.6, wind: 0.4 },
    mood: 'dramatic',
    description: 'Thunderstorm Environment'
  },
  fire: {
    keywords: ['fireplace', 'warm', 'cozy', 'winter', 'comfort', 'hearth', 'crackling', 'intimate', 'cabin', 'evening'],
    sounds: { fire: 0.8, crickets: 0.2, wind: 0.1 },
    mood: 'cozy',
    description: 'Cozy Fireplace Setting'
  },
  ocean: {
    keywords: ['ocean', 'waves', 'beach', 'sea', 'coastal', 'surf', 'shore', 'maritime', 'seaside', 'water'],
    sounds: { waves: 0.9, wind: 0.3 },
    mood: 'oceanic',
    description: 'Ocean Waves Ambiance'
  }
}

// 🎯 智能分析引擎
class SmartPromptAnalyzer {
  static analyzePrompt(prompt: string): { scene: string; confidence: number; config: Record<string, number>; description: string } {
    const cleanPrompt = prompt.toLowerCase().trim()
    const scores: Record<string, number> = {}
    
    // 计算每个场景的匹配分数
    Object.entries(SCENE_KNOWLEDGE).forEach(([sceneKey, scene]) => {
      let score = 0
      scene.keywords.forEach(keyword => {
        if (cleanPrompt.includes(keyword)) {
          // 完全匹配得高分，部分匹配得低分
          score += keyword.length > 3 ? 3 : 2
        }
      })
      scores[sceneKey] = score
    })
    
    // 找到最佳匹配
    const bestMatch = Object.entries(scores).reduce((best, [scene, score]) => 
      score > best.score ? { scene, score } : best, 
      { scene: 'relax', score: 0 }
    )
    
    // 计算置信度 (0-100)
    const maxPossibleScore = SCENE_KNOWLEDGE[bestMatch.scene].keywords.length * 3
    const confidence = Math.min(100, (bestMatch.score / maxPossibleScore) * 100)
    
    // 如果置信度太低，使用混合策略
    if (confidence < 30) {
      return this.generateMixedScene(cleanPrompt)
    }
    
    const selectedScene = SCENE_KNOWLEDGE[bestMatch.scene]
    
    return {
      scene: bestMatch.scene,
      confidence: Math.round(confidence),
      config: selectedScene.sounds,
      description: selectedScene.description
    }
  }
  
  // 混合场景生成（当单一场景匹配度低时）
  static generateMixedScene(prompt: string): { scene: string; confidence: number; config: Record<string, number>; description: string } {
    const config: Record<string, number> = {}
    
    // Smart keyword-based allocation
    if (prompt.includes('rain')) config.rain = 0.7
    if (prompt.includes('people') || prompt.includes('chat')) config.people = 0.5
    if (prompt.includes('coffee')) config.people = 0.6
    if (prompt.includes('fire')) config.fire = 0.5
    if (prompt.includes('wind')) config.wind = 0.4
    if (prompt.includes('ocean') || prompt.includes('wave')) config.waves = 0.8
    if (prompt.includes('thunder')) config.thunder = 0.4
    if (prompt.includes('cricket')) config.crickets = 0.3
    if (prompt.includes('bowl') || prompt.includes('meditation')) config.sbowl = 0.5
    
    // Default relaxing scene if no matches found
    if (Object.keys(config).length === 0) {
      config.rain = 0.5
      config.sbowl = 0.3
    }
    
    return {
      scene: 'mixed',
      confidence: 75,
      config,
      description: 'AI Smart Mixed Scene'
    }
  }
}

// 💡 Smart Prompt Suggestions
const SMART_SUGGESTIONS = [
  { text: 'Cozy coffee shop atmosphere for focused work', category: 'work', icon: '☕' },
  { text: 'Create a relaxing ocean beach environment', category: 'relax', icon: '🌊' },
  { text: 'Peaceful rainy night for better sleep', category: 'sleep', icon: '🌧️' },
  { text: 'Warm fireplace ambiance for reading', category: 'fire', icon: '🔥' },
  { text: 'Natural forest with birds and wind sounds', category: 'nature', icon: '🌲' },
  { text: 'Intense thunderstorm for deep focus', category: 'storm', icon: '⛈️' }
]

export default function AIPrompt({ onGenerateScene }: AIPromptProps) {
  const [prompt, setPrompt] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsAnalyzing(true)
    
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const result = SmartPromptAnalyzer.analyzePrompt(prompt)
    setLastResult(result)
    
    // 调用父组件回调
    onGenerateScene(prompt, result.config, result.confidence)
    
    setIsAnalyzing(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion)
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">🧠 AI Smart Scene Generator</h2>
      </div>
      
      <p className="text-gray-600 mb-6">Describe your ideal soundscape in natural language, and our AI will create the perfect mix for you</p>
      
      {/* 智能输入区域 */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your perfect soundscape...&#10;e.g., 'Create a cozy rainy cafe atmosphere for work' or 'Peaceful ocean waves for meditation'"
            className="w-full h-24 p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
          
          {/* 分析按钮 */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isAnalyzing}
            className={`mt-3 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              isAnalyzing 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg text-white hover:scale-105'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                AI is analyzing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate Soundscape
              </>
            )}
          </button>
        </div>

        {/* 分析结果 */}
        {lastResult && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">AI Analysis Result</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                lastResult.confidence > 70 ? 'bg-green-100 text-green-700' :
                lastResult.confidence > 40 ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                Confidence: {lastResult.confidence}%
              </span>
            </div>
            <p className="text-purple-700">
              🎵 Generated: <span className="font-semibold">{lastResult.description}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {Object.entries(lastResult.config).map(([sound, volume]) => (
                <span key={sound} className="px-2 py-1 bg-white/70 rounded text-xs text-purple-600">
                  {sound}: {Math.round((volume as number) * 100)}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 智能建议 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">💡 Smart Suggestions (click to use)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SMART_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-sm group"
              >
                <span className="mr-2">{suggestion.icon}</span>
                <span className="text-gray-700 group-hover:text-purple-600">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 