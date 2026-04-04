import type { Lens, LensOutput } from '../types'

interface LensColumnProps {
  lens: Lens
  output: LensOutput
  flexGrow?: number
}

export default function LensColumn({ lens, output, flexGrow = 1 }: LensColumnProps) {
  return (
    <section
      className="flex flex-col bg-white dark:bg-gray-950 min-w-[160px]"
      style={{ flex: `${flexGrow} ${flexGrow} 0%` }}
    >
      {/* カラムヘッダー */}
      <div className="flex-none flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className={`text-sm font-semibold truncate ${lens.accentColor}`}>
          {lens.name}
        </span>
        {output.status === 'streaming' && (
          <span className="flex-none w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        )}
        {output.status === 'done' && (
          <span className="flex-none text-sm text-gray-500 dark:text-gray-700">
            {output.content.length.toLocaleString()} 字
          </span>
        )}
        {output.status === 'error' && (
          <span className="flex-none text-sm text-red-400">エラー</span>
        )}
      </div>

      {/* カラムボディ */}
      <div className="flex-1 overflow-y-auto p-3">
        {output.status === 'idle' && (
          <p className="text-sm text-gray-500 italic dark:text-gray-700">
            生成ボタンで AI メモがここにストリーミング表示されます
          </p>
        )}
        {output.status === 'error' && (
          <p className="text-sm text-red-500">{output.error ?? '不明なエラーが発生しました'}</p>
        )}
        {(output.status === 'streaming' || output.status === 'done') && (
          <div className="text-base text-gray-800 whitespace-pre-wrap leading-relaxed dark:text-gray-200">
            {output.content}
            {output.status === 'streaming' && (
              <span className="inline-block w-0.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
