import type { AppState } from '../types'

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const HH = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd}_${HH}${mm}`
}

export function buildMarkdown(state: AppState): string {
  const lines: string[] = []

  lines.push('# 多視点メモ')
  lines.push('')

  if (state.context.trim()) {
    lines.push('## 素材')
    lines.push('')
    lines.push(state.context.trim())
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  for (const lens of state.lenses) {
    const output = state.outputs[lens.id]
    if (!output || (output.status !== 'done' && output.status !== 'streaming')) continue
    if (!output.content.trim()) continue

    lines.push(`## ${lens.name}`)
    lines.push('')
    lines.push(output.content.trim())
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  if (state.selfMemo.trim()) {
    lines.push('## 自分メモ')
    lines.push('')
    lines.push(state.selfMemo.trim())
    lines.push('')
  }

  return lines.join('\n')
}

export function downloadMarkdown(state: AppState): void {
  const content = buildMarkdown(state)
  const filename = `多視点メモ_${formatDate(new Date())}.md`
  const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
