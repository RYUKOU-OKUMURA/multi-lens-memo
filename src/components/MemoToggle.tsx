interface MemoToggleProps {
  isOn: boolean
  onToggle: () => void
}

export default function MemoToggle({ isOn, onToggle }: MemoToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 text-xs rounded transition-colors ${
        isOn
          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-900'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}
    >
      自分メモ {isOn ? 'ON' : 'OFF'}
    </button>
  )
}
