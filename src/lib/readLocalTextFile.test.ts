import { describe, expect, it } from 'vitest'
import {
  MAX_CONTEXT_FILE_BYTES,
  readLocalTextFile,
  ReadLocalTextFileError,
} from './readLocalTextFile'

describe('readLocalTextFile', () => {
  it('returns UTF-8 text for a small file', async () => {
    const file = new File(['hello 世界'], 'note.md', { type: 'text/markdown' })
    await expect(readLocalTextFile(file)).resolves.toBe('hello 世界')
  })

  it('returns empty string for empty file', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' })
    await expect(readLocalTextFile(file)).resolves.toBe('')
  })

  it('throws ReadLocalTextFileError when file exceeds max size', async () => {
    const buf = new Uint8Array(MAX_CONTEXT_FILE_BYTES + 1)
    const file = new File([buf], 'big.txt', { type: 'text/plain' })
    await expect(readLocalTextFile(file)).rejects.toThrow(ReadLocalTextFileError)
    await expect(readLocalTextFile(file)).rejects.toThrow(/大きすぎます/)
  })

  it('accepts file exactly at max size', async () => {
    const buf = new Uint8Array(MAX_CONTEXT_FILE_BYTES)
    buf[0] = 97 // 'a'
    const file = new File([buf], 'edge.txt', { type: 'text/plain' })
    const text = await readLocalTextFile(file)
    expect(text.length).toBe(MAX_CONTEXT_FILE_BYTES)
    expect(text[0]).toBe('a')
  })
})
