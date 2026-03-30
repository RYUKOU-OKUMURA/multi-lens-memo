import { useState } from 'react'
import type { Lens } from '../types'
import { DEFAULT_LENSES, saveLenses, resetLenses } from '../lib/lenses'

// accentColor (Tailwind text-* class) → display color
// Using inline style to avoid Tailwind JIT purging dynamic class names
const ACCENT_HEX: Record<string, string> = {
  'text-sky-400': '#38bdf8',
  'text-violet-400': '#a78bfa',
  'text-amber-400': '#fbbf24',
  'text-emerald-400': '#34d399',
  'text-rose-400': '#fb7185',
}

interface LensConfigProps {
  lenses: Lens[]
  onSave: (lenses: Lens[]) => void
  onClose: () => void
}

export default function LensConfig({ lenses, onSave, onClose }: LensConfigProps) {
  const [draft, setDraft] = useState<Lens[]>(() => lenses.map((l) => ({ ...l })))
  const [selectedId, setSelectedId] = useState<string>(draft[0]?.id ?? '')

  const selectedLens = draft.find((l) => l.id === selectedId) ?? draft[0]

  function updateLens(id: string, patch: Partial<Pick<Lens, 'name' | 'description'>>) {
    setDraft((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  function handleSave() {
    saveLenses(draft)
    onSave(draft)
    onClose()
  }

  function handleReset() {
    if (!window.confirm('すべてのレンズ設定をデフォルトに戻しますか？')) return
    const defaults = resetLenses()
    onSave(defaults)
    onClose()
  }

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col w-full max-w-2xl h-[80vh] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
        {/* ヘッダー */}
        <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-200">レンズ設定</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors text-base leading-none"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* ボディ: 左リスト + 右編集 */}
        <div className="flex flex-1 overflow-hidden">
          {/* レンズリスト */}
          <div className="flex-none w-44 border-r border-gray-800 overflow-y-auto">
            {draft.map((lens) => (
              <button
                key={lens.id}
                onClick={() => setSelectedId(lens.id)}
                className={`w-full text-left px-3 py-2.5 text-xs transition-colors border-b border-gray-800/60 ${
                  lens.id === selectedId
                    ? 'bg-gray-800 text-gray-100'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle flex-none"
                  style={{ backgroundColor: ACCENT_HEX[lens.accentColor] ?? '#6b7280' }}
                />
                <span className="truncate">{lens.name || <span className="italic text-gray-600">（名前なし）</span>}</span>
              </button>
            ))}
          </div>

          {/* 編集エリア */}
          {selectedLens && (
            <div className="flex-1 flex flex-col gap-4 p-5 overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-medium">レンズ名</label>
                <input
                  type="text"
                  value={selectedLens.name}
                  onChange={(e) => updateLens(selectedLens.id, { name: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-gray-500 transition-colors"
                  placeholder="レンズの名前"
                />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs text-gray-400 font-medium">
                  説明
                  <span className="ml-1 text-gray-600 font-normal">
                    — AIへのシステムプロンプト断片
                  </span>
                </label>
                <textarea
                  value={selectedLens.description}
                  onChange={(e) => updateLens(selectedLens.id, { description: e.target.value })}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 resize-none outline-none focus:border-gray-500 transition-colors leading-relaxed min-h-[200px]"
                  placeholder="このレンズの視点・指示をここに記述します。AIへのシステムプロンプトに差し込まれます。"
                  spellCheck={false}
                />
                <p className="text-xs text-gray-600">
                  {selectedLens.description.length} 字
                </p>
              </div>

              {/* デフォルト値との比較表示 */}
              {(() => {
                const def = DEFAULT_LENSES.find((l) => l.id === selectedLens.id)
                if (!def) return null
                const changed =
                  def.name !== selectedLens.name || def.description !== selectedLens.description
                if (!changed) return null
                return (
                  <div className="text-xs text-amber-600/80 flex items-center gap-1.5">
                    <span className="inline-block w-1 h-1 rounded-full bg-amber-500" />
                    デフォルトから変更されています
                  </div>
                )
              })()}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex-none flex items-center justify-between px-4 py-3 border-t border-gray-800">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            デフォルトに戻す
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
