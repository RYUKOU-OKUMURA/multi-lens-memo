import type { Lens, LensOutput } from '../types'

const ACCENT_COLOR_LABELS: Record<string, string> = {
  'text-sky-400': 'Sky',
  'text-violet-400': 'Violet',
  'text-amber-400': 'Amber',
  'text-emerald-400': 'Emerald',
  'text-pink-400': 'Pink',
  'text-orange-400': 'Orange',
  'text-teal-400': 'Teal',
  'text-indigo-400': 'Indigo',
  'text-rose-400': 'Rose',
}

export { ACCENT_COLOR_LABELS }

/**
 * 現在の状態を Markdown 文字列として生成する。
 */
export function buildMarkdown(params: {
  context: string
  selfMemo: string
  showSelfMemo: boolean
  lenses: Lens[]
  outputs: Record<string, LensOutput>
}): string {
  const { context, selfMemo, showSelfMemo, lenses, outputs } = params
  const now = new Date()
  const dateStr = now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  const parts: string[] = []

  parts.push(`# Multi-Lens Memo — ${dateStr}`)
  parts.push('')

  if (context.trim().length > 0) {
    parts.push('## 素材')
    parts.push('')
    parts.push(context.trim())
    parts.push('')
  }

  if (showSelfMemo && selfMemo.trim().length > 0) {
    parts.push('## 自分メモ')
    parts.push('')
    parts.push(selfMemo.trim())
    parts.push('')
  }

  for (const lens of lenses) {
    const output = outputs[lens.id]
    if (!output || output.content.trim().length === 0) continue
    parts.push(`## ${lens.name}`)
    parts.push('')
    parts.push(output.content.trim())
    parts.push('')
  }

  return parts.join('\n')
}

/**
 * Markdown 文字列をファイルとしてダウンロードする。
 */
export function downloadMarkdown(content: string, filename?: string): void {
  const now = new Date()
  const stamp = now.toISOString().slice(0, 16).replace(/[T:]/g, '-')
  const name = filename ?? `multi-lens-memo-${stamp}.md`
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}
