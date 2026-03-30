// Phase 1 骨格: レイアウト確認用プレースホルダー
// Phase 2 以降でコンポーネントに分割する

export default function App() {
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
            disabled
            className="px-3 py-1 text-xs rounded bg-gray-800 text-gray-500 cursor-not-allowed"
          >
            自分メモ ON
          </button>
          <button
            disabled
            className="px-3 py-1 text-xs rounded bg-blue-700 text-blue-100 cursor-not-allowed"
          >
            生成
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
      <main className="flex flex-1 overflow-hidden gap-px bg-gray-800">
        {/* コンテキスト（左端固定） */}
        <section className="flex flex-col w-64 flex-none bg-gray-950">
          <div className="flex-none px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-800 uppercase tracking-wider">
            コンテキスト
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <textarea
              className="w-full h-full bg-transparent text-sm text-gray-300 resize-none outline-none placeholder-gray-600"
              placeholder="素材テキストをここに貼り付ける…"
            />
          </div>
        </section>

        {/* 視点カラム × 4（プレースホルダー） */}
        {(['当事者／観客', 'ディレクター', 'プロデューサー', '歴史家／文脈'] as const).map(
          (lens) => (
            <section key={lens} className="flex flex-col flex-1 bg-gray-950 min-w-0">
              <div className="flex-none px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-800 truncate">
                {lens}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <p className="text-xs text-gray-700 italic">
                  生成ボタンで AI メモがここにストリーミング表示されます
                </p>
              </div>
            </section>
          ),
        )}
      </main>

      {/* ステータスバー */}
      <footer className="flex-none px-4 py-1 bg-gray-900 border-t border-gray-800 text-xs text-gray-600">
        Phase 1 — セットアップ完了
      </footer>
    </div>
  )
}
