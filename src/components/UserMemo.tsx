interface UserMemoProps {
  value: string
  onChange: (value: string) => void
  width?: number
}

export default function UserMemo({ value, onChange, width = 224 }: UserMemoProps) {
  return (
    <section
      className="flex flex-col flex-none bg-white dark:bg-gray-950"
      style={{ width: `${width}px` }}
    >
      <div className="flex-none flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-semibold text-rose-500 dark:text-rose-400">自分メモ</span>
        <span className="ml-auto flex-none text-sm text-gray-500 dark:text-gray-600">自由記述</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full min-h-full bg-transparent text-base text-gray-800 resize-none outline-none placeholder-gray-400 p-3 leading-relaxed dark:text-gray-300 dark:placeholder-gray-700"
          placeholder="自分のメモ・感想を書く…"
          spellCheck={false}
        />
      </div>
    </section>
  )
}
