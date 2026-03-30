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
          ? 'bg-rose-900/60 text-rose-300 hover:bg-rose-900'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
      }`}
    >
      自分メモ {isOn ? 'ON' : 'OFF'}
    </button>
  )
}
