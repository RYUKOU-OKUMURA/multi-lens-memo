import type { AppState } from '../types'
import { downloadMarkdown } from '../lib/export'

interface ExportButtonProps {
  state: AppState
}

export default function ExportButton({ state }: ExportButtonProps) {
  const hasContent = state.lenses.some((l) => {
    const o = state.outputs[l.id]
    return o && (o.status === 'done' || o.status === 'streaming') && o.content.trim().length > 0
  }) || state.selfMemo.trim().length > 0

  const isGenerating = Object.values(state.outputs).some((o) => o.status === 'streaming')
  const disabled = !hasContent || isGenerating

  return (
    <button
      disabled={disabled}
      onClick={() => downloadMarkdown(state)}
      className={`px-3 py-1 text-xs rounded transition-colors ${
        disabled
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 cursor-pointer'
      }`}
    >
      MD DL
    </button>
  )
}
