import { useState } from 'react'
import type { AppState } from './types'
import { loadLenses } from './lib/lenses'
import ContextPanel from './components/ContextPanel'
import LensGrid from './components/LensGrid'

function buildInitialState(): AppState {
  const lenses = loadLenses()
  return {
    context: '',
    selfMemo: '',
    showSelfMemo: false,
    lenses,
    outputs: Object.fromEntries(
      lenses.map((l) => [l.id, { lensId: l.id, content: '', status: 'idle' as const }]),
    ),
  }
}

export default function App() {
  const [state, setState] = useState<AppState>(buildInitialState)

  function setContext(context: string) {
    setState((s) => ({ ...s, context }))
  }

  function setSelfMemo(selfMemo: string) {
    setState((s) => ({ ...s, selfMemo }))
  }

  function toggleSelfMemo() {
    setState((s) => ({ ...s, showSelfMemo: !s.showSelfMemo }))
  }

  const isGenerating = Object.values(state.outputs).some((o) => o.status === 'streaming')

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <header className="flex-none flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <h1 className="text-sm font-semibold tracking-wide text-gray-200">
          Multi-Lens Memo
          <span className="ml-2 text-xs text-gray-500 font-normal">多視点メモ</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-500 cursor-not-allowed"
          >
            レンズ設定
          </button>
          <button
            onClick={toggleSelfMemo}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              state.showSelfMemo
                ? 'bg-rose-900/60 text-rose-300 hover:bg-rose-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            自分メモ {state.showSelfMemo ? 'ON' : 'OFF'}
          </button>
          <button
            disabled={isGenerating || state.context.trim().length === 0}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isGenerating || state.context.trim().length === 0
                ? 'bg-blue-900/40 text-blue-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
            }`}
          >
            {isGenerating ? '生成中…' : '生成'}
          </button>
          <button
            disabled
            className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-500 cursor-not-allowed"
          >
            MD DL
          </button>
        </div>
      </header>

      {/* メインカラムエリア */}
      <main className="flex flex-1 overflow-hidden">
        <ContextPanel value={state.context} onChange={setContext} />
        <LensGrid
          lenses={state.lenses}
          outputs={state.outputs}
          showSelfMemo={state.showSelfMemo}
          selfMemo={state.selfMemo}
          onSelfMemoChange={setSelfMemo}
        />
      </main>

      {/* ステータスバー */}
      <footer className="flex-none flex items-center gap-4 px-4 py-1 bg-gray-900 border-t border-gray-800 text-xs text-gray-600">
        <span>Phase 2-B — コアUI骨格</span>
        <span className="text-gray-700">|</span>
        <span>
          レンズ {state.lenses.length}本
          {state.showSelfMemo && ' + 自分メモ'}
        </span>
        {state.context.length > 0 && (
          <>
            <span className="text-gray-700">|</span>
            <span>素材 {state.context.length.toLocaleString()} 字</span>
          </>
        )}
      </footer>
    </div>
  )
}
