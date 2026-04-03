/**
 * コンテキスト欄用: ユーザーが選んだローカルファイルを UTF-8 テキストとして読む。
 * Shift_JIS 等の自動判定は行わない（ブラウザの File.text() 前提）。
 */

/** コンテキストに読み込めるファイルの最大サイズ（バイト） */
export const MAX_CONTEXT_FILE_BYTES = 8 * 1024 * 1024

export class ReadLocalTextFileError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReadLocalTextFileError'
  }
}

/**
 * @throws {ReadLocalTextFileError} サイズ超過または読み取り失敗時
 */
export async function readLocalTextFile(file: File): Promise<string> {
  if (file.size > MAX_CONTEXT_FILE_BYTES) {
    throw new ReadLocalTextFileError(
      `ファイルが大きすぎます（上限 ${(MAX_CONTEXT_FILE_BYTES / (1024 * 1024)).toFixed(0)}MB）`,
    )
  }

  try {
    return await file.text()
  } catch {
    throw new ReadLocalTextFileError('ファイルの読み取りに失敗しました')
  }
}
