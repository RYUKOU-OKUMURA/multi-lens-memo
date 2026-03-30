import type { Lens } from '../types'

const STORAGE_KEY = 'multi-lens-memo:lenses'

export const DEFAULT_LENSES: Lens[] = [
  {
    id: 'participant',
    name: '当事者／観客',
    description:
      'あなたは「当事者・観客」の視点でメモを作ります。何が起きたか、どんな感情や事実が表面に現れているかに着目し、体験者・観察者として素直に読み取ったことを箇条書きにしてください。',
    accentColor: 'text-sky-400',
  },
  {
    id: 'director',
    name: 'ディレクター',
    description:
      'あなたは「ディレクター」の視点でメモを作ります。構成・間・テンポ・次に来そうな展開・演出上の意図の推測に着目し、"作り手がなぜこう組んだか"を読み解く箇条書きにしてください。',
    accentColor: 'text-violet-400',
  },
  {
    id: 'producer',
    name: 'プロデューサー',
    description:
      'あなたは「プロデューサー」の視点でメモを作ります。制約・利害関係・布陣・資源配分の理由の推測に着目し、"なぜこの陣容・タイミング・判断になったか"を読み解く箇条書きにしてください。',
    accentColor: 'text-amber-400',
  },
  {
    id: 'historian',
    name: '歴史家／文脈',
    description:
      'あなたは「歴史家・文脈」の視点でメモを作ります。系譜・過去の類似事例・参照元・時代背景の推測に着目し、"これはどういう流れの中に位置づけられるか"を読み解く箇条書きにしてください。',
    accentColor: 'text-emerald-400',
  },
]

export function loadLenses(): Lens[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_LENSES
    const parsed = JSON.parse(raw) as Lens[]
    // 最低限の構造チェック
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_LENSES
    return parsed
  } catch {
    return DEFAULT_LENSES
  }
}

export function saveLenses(lenses: Lens[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lenses))
}

export function resetLenses(): Lens[] {
  localStorage.removeItem(STORAGE_KEY)
  return DEFAULT_LENSES
}
