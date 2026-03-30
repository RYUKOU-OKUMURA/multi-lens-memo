interface ContextPanelProps {
  value: string
  onChange: (value: string) => void
}

export default function ContextPanel({ value, onChange }: ContextPanelProps) {
  return (
    <section className="flex flex-col w-64 flex-none bg-gray-950 border-r border-gray-800">
      <div className="flex-none px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          コンテキスト
        </span>
        {value.length > 0 && (
          <span className="ml-2 text-xs text-gray-600">
            {value.length.toLocaleString()} 字
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-full bg-transparent text-sm text-gray-300 resize-none outline-none placeholder-gray-700 p-3 leading-relaxed"
          placeholder="素材テキストをここに貼り付ける…&#10;&#10;文字起こし・Markdown など"
          spellCheck={false}
        />
      </div>
    </section>
  )
}
