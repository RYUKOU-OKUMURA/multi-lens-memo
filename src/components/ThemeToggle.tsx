import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      className="px-3 py-1 text-xs rounded transition-colors cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      {isDark ? '☀ ライト' : '🌙 ダーク'}
    </button>
  )
}
