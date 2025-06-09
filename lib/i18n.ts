// 语言包定义
export const languages = {
    en: 'English',
    zh: '中文'
} as const

export type Language = keyof typeof languages

// 英文语言包
const en = {
    // Header
    header: {
        title: 'SoundScape AI',
        subtitle: 'Create Perfect Ambient Soundscapes for Better Focus',
        description: 'Mix nature sounds, white noise, and atmospheric audio to boost your productivity and relaxation'
    },

    // Scene Presets
    scenePresets: {
        title: '🎵 Quick Scene Presets',
        subtitle: 'One-click ambient combinations for different moods',
        scenes: {
            focusMode: {
                name: 'Focus Mode',
                description: 'Light rain + soft wind for deep concentration'
            },
            studySession: {
                name: 'Study Session',
                description: 'Library atmosphere for learning'
            },
            relaxation: {
                name: 'Relaxation',
                description: 'Ocean waves + gentle breeze for stress relief'
            },
            stormyNight: {
                name: 'Stormy Night',
                description: 'Heavy rain + thunder for dramatic ambiance'
            },
            forestWalk: {
                name: 'Forest Walk',
                description: 'Wind + crickets + birds for nature immersion'
            },
            coffeeShop: {
                name: 'Coffee Shop',
                description: 'People chatter + light rain for work vibes'
            },
            fireplace: {
                name: 'Cozy Fireplace',
                description: 'Crackling fire + soft wind for warmth'
            }
        }
    },

    // Player Controls
    playerControls: {
        title: '🎮 Playback Controls',
        playButton: 'Play',
        pauseButton: 'Pause',
        resetButton: 'Reset all settings',
        timer: 'Timer',
        startTimer: 'Start',
        startTimerWithMusic: 'Start + auto-play music',
        pomodoroTimer: 'Pomodoro Focus Timer (25 min)',
        minutesTimer: 'minutes timer',
        playing: 'Playing',
        stopped: 'Stopped',
        immersive: 'Immersive',
        immersiveTitle: 'Enter Immersive Clock Mode',

        // Timer states
        timerRunning: 'Timer Running',
        timerPaused: 'Timer Paused',
        total: 'Total',
        resume: 'Resume',
        pause: 'Pause',
        reset: 'Reset',

        // Current scene messages
        currentScene: '🎵 Current Scene',
        autoApplied: 'Auto-Applied',
        defaultFocusMix: '🎵 Default Focus Mix Applied - No empty play! (Rain + Fireplace + Wind + Ocean)',
        timerStarted: '🍅 Timer Started - Auto-Applied Default Focus Mix (Rain + Fireplace + Wind + Ocean)',
        timerStartedAutoPlay: '🍅 Timer Started - Auto Playing'
    },

    // Audio Mixer
    audioMixer: {
        title: '🎚️ Audio Mixer',
        subtitle: 'Adjust individual sound levels to create your perfect mix',
        loadingText: 'Loading',
        loadedText: 'Loaded',
        testButton: 'Test',
        retryButton: 'Retry Failed Audio',
        stopButton: 'Stop All & Reset Timer',
        sounds: {
            rain: 'Rain',
            thunder: 'Thunder',
            fire: 'Fireplace',
            wind: 'Wind',
            waves: 'Ocean Waves',
            crickets: 'Crickets',
            people: 'Coffee Shop',
            sbowl: 'Singing Bowl'
        }
    },

    // AI Feature
    aiFeature: {
        title: '🤖 AI Soundscape Generator',
        subtitle: 'Describe your ideal environment and let AI create the perfect soundscape',
        placeholder: 'Describe your ideal soundscape... (e.g., "rainy morning in a cozy cabin with crackling fireplace")',
        generateButton: 'Generate Soundscape',
        generating: 'Generating',
        comingSoon: '🚧 AI Feature Coming Soon!',
        inDevelopment: 'We\'re working hard to bring you AI-powered soundscape generation.',
        developmentStatus: 'In Development'
    },

    // Footer
    footer: {
        builtWith: 'Built with ❤️ for better focus and relaxation',
        aiComing: '🤖 AI-powered features coming soon • Stay tuned for smart soundscape generation'
    },

    // Common
    common: {
        minutes: 'minutes',
        minute: 'minute',
        language: 'Language',
        switchLanguage: 'Switch Language'
    }
}

// 中文语言包
const zh = {
    // Header
    header: {
        title: 'SoundScape AI',
        subtitle: '创造完美的环境音效，提升专注力',
        description: '混合自然声音、白噪音和大气音频，提升您的工作效率和放松体验'
    },

    // Scene Presets
    scenePresets: {
        title: '🎵 快速场景预设',
        subtitle: '一键切换不同心情的环境音效组合',
        scenes: {
            focusMode: {
                name: '专注模式',
                description: '轻柔雨声 + 微风，助您深度专注'
            },
            studySession: {
                name: '学习模式',
                description: '图书馆学习氛围'
            },
            relaxation: {
                name: '放松模式',
                description: '海浪声 + 轻柔微风，缓解压力'
            },
            stormyNight: {
                name: '暴雨夜晚',
                description: '大雨 + 雷声，营造戏剧性氛围'
            },
            forestWalk: {
                name: '森林漫步',
                description: '风声 + 蟋蟀 + 鸟鸣，沉浸自然'
            },
            coffeeShop: {
                name: '咖啡厅',
                description: '人声低语 + 轻雨声，工作氛围'
            },
            fireplace: {
                name: '温馨壁炉',
                description: '壁炉爆裂声 + 轻风，温暖舒适'
            }
        }
    },

    // Player Controls
    playerControls: {
        title: '🎮 播放控制',
        playButton: '播放',
        pauseButton: '暂停',
        resetButton: '重置所有设置',
        timer: '定时器',
        startTimer: '开始',
        startTimerWithMusic: '开始 + 自动播放音乐',
        pomodoroTimer: '番茄钟专注定时器 (25分钟)',
        minutesTimer: '分钟定时器',
        playing: '播放中',
        stopped: '已停止',
        immersive: '沉浸模式',
        immersiveTitle: '进入沉浸式时钟模式',

        // Timer states
        timerRunning: '定时器运行中',
        timerPaused: '定时器已暂停',
        total: '总计',
        resume: '继续',
        pause: '暂停',
        reset: '重置',

        // Current scene messages
        currentScene: '🎵 当前场景',
        autoApplied: '自动应用',
        defaultFocusMix: '🎵 已应用默认专注音效组合 - 避免空播放！(雨声 + 壁炉 + 风声 + 海浪)',
        timerStarted: '🍅 定时器已启动 - 自动应用默认专注音效组合 (雨声 + 壁炉 + 风声 + 海浪)',
        timerStartedAutoPlay: '🍅 定时器已启动 - 自动播放'
    },

    // Audio Mixer
    audioMixer: {
        title: '🎚️ 音频混合器',
        subtitle: '调节各个声音的音量，创造您的完美音效组合',
        loadingText: '加载中',
        loadedText: '已加载',
        testButton: '测试',
        retryButton: '重试失败音频',
        stopButton: '停止所有 & 重置定时器',
        sounds: {
            rain: '雨声',
            thunder: '雷声',
            fire: '壁炉',
            wind: '风声',
            waves: '海浪',
            crickets: '蟋蟀',
            people: '咖啡厅',
            sbowl: '颂钵'
        }
    },

    // AI Feature
    aiFeature: {
        title: '🤖 AI 音景生成器',
        subtitle: '描述您理想的环境，让AI为您创造完美的音景',
        placeholder: '描述您理想的音景... (例如："雨天早晨的舒适小屋，壁炉噼啪作响")',
        generateButton: '生成音景',
        generating: '生成中',
        comingSoon: '🚧 AI功能即将推出！',
        inDevelopment: '我们正在努力为您带来AI驱动的音景生成功能。',
        developmentStatus: '开发中'
    },

    // Footer
    footer: {
        builtWith: '用 ❤️ 构建，为了更好的专注和放松',
        aiComing: '🤖 AI驱动功能即将推出 • 敬请期待智能音景生成'
    },

    // Common
    common: {
        minutes: '分钟',
        minute: '分钟',
        language: '语言',
        switchLanguage: '切换语言'
    }
}

// 导出语言包
export const translations = { en, zh }

// 类型定义
export type Translations = typeof en 