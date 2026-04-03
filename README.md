# Multi-Lens Memo（多視点メモ）

同一の入力テキストに対し、複数の「視点（レンズ）」ごとに AI がメモを並列生成する Web アプリです。

## 前提条件

- [Node.js](https://nodejs.org/)（推奨: 最新の LTS）
- npm（Node に同梱）

## セットアップ

```bash
npm install
```

## ローカル開発

フロントは Vite（既定ポート `5173`）。`vite.config.ts` で `/api` が `http://localhost:8788` にプロキシされます。API は Cloudflare Pages Functions 相当のため、**ビルド済みの `dist` を Wrangler で起動**する必要があります。

1. **ターミナル A**: ビルドして Pages 開発サーバーを起動する。
  ```bash
   npm run build
   npm run pages:dev
  ```
   （`wrangler pages dev dist --port 8788` と同等）
2. **ターミナル B**: Vite の開発サーバーを起動する。
  ```bash
   npm run dev
  ```

ブラウザで Vite の URL（例: `http://localhost:5173`）を開き、`/api` へのリクエストはプロキシ経由で 8788 に届きます。

ローカル用の環境変数は `.dev.vars` に置けます。雛形は `.dev.vars.example` を参照してください。

## Cloudflare Pages の環境変数


| 変数                 | 必須  | 説明                                                       |
| ------------------ | --- | -------------------------------------------------------- |
| `ZAI_API_KEY`      | はい  | 生成 API 用のキー（本番は `wrangler secret put ZAI_API_KEY` などで設定） |
| `ZAI_API_BASE_URL` | いいえ | 未設定時は `https://open.bigmodel.cn/api/paas/v4`。**GLM-5.1（Coding Plan）** の例では `https://open.bigmodel.cn/api/coding/paas/v4` を使います。 |
| `ZAI_MODEL`        | いいえ | 未設定時は `glm-4.7-flash`。**GLM-5.1** は coding 用 URL とセットで `GLM-5.1` とする例が多いです。標準 URL のみのときはコンソールの「模型代码」（例: `glm-5`）に合わせてください。 |


## デプロイ

```bash
npm run build
npm run pages:deploy
```

`npm run pages:deploy` は `wrangler pages deploy dist` と同等です。Cloudflare アカウントとプロジェクト設定が済んでいることを前提とします。

## ドキュメント

要件の詳細は [REQUIREMENTS.md](./REQUIREMENTS.md) を参照してください。