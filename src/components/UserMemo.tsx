interface UserMemoProps {
  value: string
  onChange: (value: string) => void
}

export default function UserMemo({ value, onChange }: UserMemoProps) {
  return (
    <section className="flex flex-col flex-none w-56 bg-gray-950 border-r border-gray-800">
      <div className="flex-none flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-semibold text-rose-400">自分メモ</span>
        <span className="ml-auto flex-none text-xs text-gray-600">自由記述</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-full bg-transparent text-sm text-gray-300 resize-none outline-none placeholder-gray-700 p-3 leading-relaxed"
          placeholder="自分のメモ・感想を書く…"
          spellCheck={false}
        />
      </div>
    </section>
  )
}
