import { Language } from './i18n'

// 中国大陆的国家代码
const CHINA_COUNTRY_CODES = ['CN', 'CHN']

// 地理位置检测服务
export async function detectCountryByIP(): Promise<string | null> {
    try {
        // 使用免费的IP地理位置API
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) {
            throw new Error('Failed to fetch location')
        }

        const data = await response.json()
        return data.country_code || null
    } catch (error) {
        console.warn('Failed to detect country by IP:', error)

        // 备用API
        try {
            const backupResponse = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free')
            if (backupResponse.ok) {
                const backupData = await backupResponse.json()
                return backupData.country_code2 || null
            }
        } catch (backupError) {
            console.warn('Backup IP detection also failed:', backupError)
        }

        return null
    }
}

// 检测浏览器语言偏好
export function detectBrowserLanguage(): Language {
    if (typeof navigator === 'undefined') return 'en'

    const browserLang = navigator.language || navigator.languages?.[0] || 'en'

    // 检查是否为中文
    if (browserLang.toLowerCase().startsWith('zh')) {
        return 'zh'
    }

    return 'en'
}

// 综合语言检测
export async function detectUserLanguage(): Promise<Language> {
    try {
        // 1. 首先检查localStorage中用户的手动选择
        const savedLanguage = localStorage.getItem('soundscape-language') as Language
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
            console.log('🎯 Using saved language preference:', savedLanguage)
            return savedLanguage
        }

        // 2. 尝试通过IP检测地理位置
        const countryCode = await detectCountryByIP()
        if (countryCode && CHINA_COUNTRY_CODES.includes(countryCode.toUpperCase())) {
            console.log('🌍 Detected China region, using Chinese')
            return 'zh'
        }

        // 3. 检查浏览器语言偏好
        const browserLang = detectBrowserLanguage()
        if (browserLang === 'zh') {
            console.log('🌐 Browser language is Chinese')
            return 'zh'
        }

        // 4. 默认使用英文
        console.log('🌏 Using default language: English')
        return 'en'

    } catch (error) {
        console.warn('Language detection failed, using default English:', error)
        return 'en'
    }
}

// 保存用户语言选择
export function saveLanguagePreference(language: Language): void {
    try {
        localStorage.setItem('soundscape-language', language)
        console.log('💾 Saved language preference:', language)
    } catch (error) {
        console.warn('Failed to save language preference:', error)
    }
}

// 检查是否为中国用户（用于分析）
export async function isChineseUser(): Promise<boolean> {
    try {
        const countryCode = await detectCountryByIP()
        const browserLang = detectBrowserLanguage()

        return (
            (countryCode && CHINA_COUNTRY_CODES.includes(countryCode.toUpperCase())) ||
            browserLang === 'zh'
        )
    } catch {
        return false
    }
} 