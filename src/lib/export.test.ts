import { describe, expect, it } from 'vitest'
import { buildMarkdown } from './export'
import type { AppState, Lens, LensOutput } from '../types'

function minimalState(overrides: Partial<AppState> = {}): AppState {
  return {
    context: '',
    selfMemo: '',
    showSelfMemo: false,
    lenses: [],
    outputs: {},
    ...overrides,
  }
}

const fixedDate = new Date('2026-03-15T12:00:00')

describe('buildMarkdown', () => {
  it('returns header block with 無題 and なし for empty / minimal state', () => {
    const md = buildMarkdown(minimalState(), fixedDate)
    expect(md).toBe(
      [
        '# 多視点メモ: 無題',
        '生成日: 2026-03-15',
        '素材: （なし）',
        '',
        '---',
        '',
      ].join('\n'),
    )
  })

  it('includes 素材 excerpt, separator, and lens output when present', () => {
    const lens: Lens = {
      id: 'l1',
      name: '要約',
      description: '',
      accentColor: 'blue-500',
    }
    const output: LensOutput = {
      lensId: 'l1',
      content: '  要点1\n要点2  ',
      status: 'done',
    }
    const md = buildMarkdown(
      minimalState({
        context: '  素材本文  ',
        lenses: [lens],
        outputs: { l1: output },
      }),
      fixedDate,
    )

    expect(md).toContain('# 多視点メモ: 素材本文')
    expect(md).toContain('生成日: 2026-03-15')
    expect(md).toContain('素材: （素材本文）')
    expect(md).toContain('## 素材')
    expect(md).toContain('## 素材\n\n素材本文\n\n---\n\n## 要約')
    expect(md).toContain('要点1\n要点2')
  })

  it('places 自分のメモ before lenses with --- between when both exist', () => {
    const lens: Lens = {
      id: 'l1',
      name: '要約',
      description: '',
      accentColor: 'blue-500',
    }
    const md = buildMarkdown(
      minimalState({
        context: 'ctx',
        selfMemo: 'メモ',
        lenses: [lens],
        outputs: {
          l1: { lensId: 'l1', content: 'out', status: 'done' },
        },
      }),
      fixedDate,
    )
    expect(md).toContain('## 自分のメモ')
    expect(md.indexOf('## 自分のメモ')).toBeLessThan(md.indexOf('## 要約'))
    expect(md).toMatch(
      /## 素材\n\nctx\n\n---\n\n## 自分のメモ\n\nメモ\n\n---\n\n## 要約/,
    )
  })

  it('includes selfMemo section when non-empty', () => {
    const md = buildMarkdown(
      minimalState({
        selfMemo: '  後で見返すメモ  ',
      }),
      fixedDate,
    )

    expect(md).toContain('## 自分のメモ')
    expect(md).toContain('後で見返すメモ')
    expect(md).not.toContain('  後で見返すメモ  ')
  })

  it('embeds full multi-line context under ## 素材', () => {
    const md = buildMarkdown(
      minimalState({
        context: 'A行目\nB行目\nC行目',
      }),
      fixedDate,
    )
    expect(md).toContain('## 素材\n\nA行目\nB行目\nC行目')
  })

  it('skips lens blocks when status is idle or content is empty', () => {
    const lens: Lens = {
      id: 'x',
      name: '無視される',
      description: '',
      accentColor: 'gray-500',
    }
    const md = buildMarkdown(
      minimalState({
        lenses: [lens],
        outputs: {
          x: { lensId: 'x', content: 'has text', status: 'idle' },
        },
      }),
      fixedDate,
    )
    expect(md).not.toContain('## 無視される')
  })
})
