export interface Lens {
  id: string
  name: string
  /** システムプロンプトに差し込む視点説明 */
  description: string
  /** ヘッダーのアクセントカラー（Tailwind text-* クラス名） */
  accentColor: string
}

export type OutputStatus = 'idle' | 'streaming' | 'done' | 'error'

export interface LensOutput {
  lensId: string
  content: string
  status: OutputStatus
  error?: string
}

export interface AppState {
  /** 素材テキスト（コンテキストパネル） */
  context: string
  /** 自分メモ */
  selfMemo: string
  /** 自分メモカラムの表示/非表示 */
  showSelfMemo: boolean
  /** 有効なレンズ一覧（順序保持） */
  lenses: Lens[]
  /** レンズIDをキーとした出力状態 */
  outputs: Record<string, LensOutput>
}
