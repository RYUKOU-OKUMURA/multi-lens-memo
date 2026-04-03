import { useCallback, useState } from 'react'
import type { AppState, Lens, LensOutput } from './types'
import { loadLenses } from './lib/lenses'
import { useStreamingLens } from './hooks/useStreamingLens'
import ContextPanel from './components/ContextPanel'
import LensGrid from './components/LensGrid'
import UserMemo from './components/UserMemo'
import MemoToggle from './components/MemoToggle'
import ExportButton from './components/ExportButton'
import LensConfig from './components/LensConfig'
import ThemeToggle from './components/ThemeToggle'

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
  const [state, setState] = useState<AppState>(() => buildInitialState())
  const [showLensConfig, setShowLensConfig] = useState(false)

  function setContext(context: string) {
    setState((s) => ({ ...s, context }))
  }

  function setSelfMemo(selfMemo: string) {
    setState((s) => ({ ...s, selfMemo }))
  }

  function toggleSelfMemo() {
    setState((s) => ({ ...s, showSelfMemo: !s.showSelfMemo }))
  }

  const setOutput = useCallback(
    (lensId: string, updater: (prev: LensOutput) => LensOutput) => {
      setState((s) => ({
        ...s,
        outputs: {
          ...s.outputs,
          [lensId]: updater(s.outputs[lensId] ?? { lensId, content: '', status: 'idle' }),
        },
      }))
    },
    [],
  )

  const { generateAll } = useStreamingLens(setOutput)

  function handleLensesSaved(lenses: Lens[]) {
    setState((s) => ({
      ...s,
      lenses,
      // 既存の出力は保持しつつ、新しいレンズ分は idle で初期化
      outputs: Object.fromEntries(
        lenses.map((l) => [
          l.id,
          s.outputs[l.id] ?? { lensId: l.id, content: '', status: 'idle' as const },
        ]),
      ),
    }))
  }

  const isGenerating = Object.values(state.outputs).some((o) => o.status === 'streaming')

  function handleGenerate() {
    if (!isGenerating && state.context.trim().length > 0) {
      // 出力をリセットしてから順次ストリーミング開始
      setState((s) => ({
        ...s,
        outputs: Object.fromEntries(
          s.lenses.map((l) => [l.id, { lensId: l.id, content: '', status: 'idle' as const }]),
        ),
      }))
      void generateAll(state.lenses, state.context)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <header className="flex-none flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <h1 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-200">
          Multi-Lens Memo
          <span className="ml-2 text-xs text-gray-500 font-normal">多視点メモ</span>
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setShowLensConfig(true)}
            disabled={isGenerating}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isGenerating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
            }`}
          >
            レンズ設定
          </button>
          <MemoToggle isOn={state.showSelfMemo} onToggle={toggleSelfMemo} />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || state.context.trim().length === 0}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              isGenerating || state.context.trim().length === 0
                ? 'bg-blue-100 text-blue-300 cursor-not-allowed dark:bg-blue-900/40 dark:text-blue-500'
                : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
            }`}
          >
            {isGenerating ? '生成中…' : '生成'}
          </button>
          <ExportButton state={state} />
        </div>
      </header>

      {/* メインカラムエリア */}
      <main className="flex flex-1 overflow-hidden">
        <ContextPanel
          value={state.context}
          onChange={setContext}
          fileImportDisabled={isGenerating}
        />
        {state.showSelfMemo && (
          <UserMemo value={state.selfMemo} onChange={setSelfMemo} />
        )}
        <LensGrid lenses={state.lenses} outputs={state.outputs} />
      </main>

      {/* レンズ設定モーダル */}
      {showLensConfig && (
        <LensConfig
          lenses={state.lenses}
          onSave={handleLensesSaved}
          onClose={() => setShowLensConfig(false)}
        />
      )}

      {/* ステータスバー */}
      <footer className="flex-none flex items-center gap-4 px-4 py-1 bg-white border-t border-gray-200 text-xs text-gray-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-600">
        <span>MVP</span>
        <span className="text-gray-300 dark:text-gray-700">|</span>
        <span>
          レンズ {state.lenses.length}本
          {state.showSelfMemo && ' + 自分メモ'}
        </span>
        {state.context.length > 0 && (
          <>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>素材 {state.context.length.toLocaleString()} 字</span>
          </>
        )}
        {isGenerating && (
          <>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-blue-600 animate-pulse dark:text-blue-500">ストリーミング中…</span>
          </>
        )}
      </footer>
    </div>
  )
}
