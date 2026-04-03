import { useEffect, useRef, useState } from 'react'
import type { Lens } from '../types'
import { DEFAULT_LENSES } from '../lib/lenses'
import { ACCENT_COLOR_LABELS } from '../lib/markdown'

const ACCENT_COLORS = Object.keys(ACCENT_COLOR_LABELS) as Lens['accentColor'][]

/** 色ドットのインライン色マッピング（Tailwind の JIT で purge されないよう直接 style を使う） */
const COLOR_HEX: Record<string, string> = {
  'text-sky-400': '#38bdf8',
  'text-violet-400': '#a78bfa',
  'text-amber-400': '#fbbf24',
  'text-emerald-400': '#34d399',
  'text-pink-400': '#f472b6',
  'text-orange-400': '#fb923c',
  'text-teal-400': '#2dd4bf',
  'text-indigo-400': '#818cf8',
  'text-rose-400': '#fb7185',
}

interface LensSettingsModalProps {
  lenses: Lens[]
  onSave: (lenses: Lens[]) => void
  onClose: () => void
}

export default function LensSettingsModal({ lenses, onSave, onClose }: LensSettingsModalProps) {
  const [draft, setDraft] = useState<Lens[]>(() => lenses.map((l) => ({ ...l })))
  const backdropRef = useRef<HTMLDivElement>(null)

  // Esc キーで閉じる
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function updateLens(index: number, patch: Partial<Lens>) {
    setDraft((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  function resetToDefaults() {
    setDraft(DEFAULT_LENSES.map((l) => ({ ...l })))
  }

  function handleSave() {
    const valid = draft.filter((l) => l.name.trim().length > 0)
    if (valid.length === 0) return
    onSave(valid)
    onClose()
  }

  // バックドロップクリックで閉じる
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="レンズ設定"
    >
      <div className="flex flex-col w-full max-w-2xl max-h-[85vh] bg-white border border-gray-200 rounded-lg shadow-2xl dark:bg-gray-900 dark:border-gray-700">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-200">レンズ設定</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors text-lg leading-none dark:hover:text-gray-300"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* レンズ一覧 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {draft.map((lens, index) => (
            <div
              key={lens.id}
              className="flex gap-3 p-3 rounded-md bg-gray-50 border border-gray-200 dark:bg-gray-800/60 dark:border-gray-700"
            >
              {/* 色選択 */}
              <div className="flex flex-col gap-1.5 flex-none">
                <span className="text-xs text-gray-500 mb-0.5">色</span>
                <div className="flex flex-wrap gap-1 max-w-[72px]">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateLens(index, { accentColor: color })}
                      title={ACCENT_COLOR_LABELS[color]}
                      aria-label={ACCENT_COLOR_LABELS[color]}
                      style={{ backgroundColor: COLOR_HEX[color] ?? '#888' }}
                      className={`w-4 h-4 rounded-full transition-transform ${
                        lens.accentColor === color
                          ? 'ring-2 ring-gray-900 ring-offset-1 ring-offset-white scale-110 dark:ring-white dark:ring-offset-gray-800'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 名前・説明 */}
              <div className="flex-1 flex flex-col gap-2 min-w-0">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">名前</label>
                  <input
                    type="text"
                    value={lens.name}
                    onChange={(e) => updateLens(index, { name: e.target.value })}
                    maxLength={24}
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 outline-none focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    placeholder="レンズ名"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">説明（システムプロンプト）</label>
                  <textarea
                    value={lens.description}
                    onChange={(e) => updateLens(index, { description: e.target.value })}
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 outline-none focus:border-blue-500 resize-none leading-relaxed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                    placeholder="AI への指示（視点・着眼点など）"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={resetToDefaults}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors dark:hover:text-gray-300"
          >
            デフォルトに戻す
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
