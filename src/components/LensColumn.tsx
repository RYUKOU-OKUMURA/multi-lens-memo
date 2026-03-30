import type { Lens, LensOutput } from '../types'

interface LensColumnProps {
  lens: Lens
  output: LensOutput
  /** 自分メモカラムとして使う場合 */
  isSelfMemo?: boolean
  selfMemoValue?: string
  onSelfMemoChange?: (value: string) => void
}

export default function LensColumn({
  lens,
  output,
  isSelfMemo = false,
  selfMemoValue = '',
  onSelfMemoChange,
}: LensColumnProps) {
  return (
    <section className="flex flex-col flex-1 bg-gray-950 border-r border-gray-800 min-w-0">
      {/* カラムヘッダー */}
      <div className="flex-none flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <span className={`text-xs font-semibold truncate ${lens.accentColor}`}>
          {lens.name}
        </span>
        {output.status === 'streaming' && (
          <span className="flex-none w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
        {output.status === 'error' && (
          <span className="flex-none text-xs text-red-400">エラー</span>
        )}
        {isSelfMemo && (
          <span className="ml-auto flex-none text-xs text-gray-600">自由記述</span>
        )}
      </div>

      {/* カラムボディ */}
      <div className="flex-1 overflow-y-auto">
        {isSelfMemo ? (
          <textarea
            value={selfMemoValue}
            onChange={(e) => onSelfMemoChange?.(e.target.value)}
            className="w-full h-full min-h-full bg-transparent text-sm text-gray-300 resize-none outline-none placeholder-gray-700 p-3 leading-relaxed"
            placeholder="自分のメモ・感想を書く…"
            spellCheck={false}
          />
        ) : (
          <div className="p-3">
            {output.status === 'idle' && (
              <p className="text-xs text-gray-700 italic">
                生成ボタンで AI メモがここにストリーミング表示されます
              </p>
            )}
            {output.status === 'error' && (
              <p className="text-xs text-red-500">{output.error ?? '不明なエラーが発生しました'}</p>
            )}
            {(output.status === 'streaming' || output.status === 'done') && (
              <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {output.content}
                {output.status === 'streaming' && (
                  <span className="inline-block w-0.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
