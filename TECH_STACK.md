# 多視点メモ生成アプリ — 技術スタック

作成日: 2026-03-30

---

## 1. 全体構成

```
ブラウザ（React SPA）
  ├── テキスト入力UI
  ├── レンズ設定UI
  ├── 並列ストリーミング表示UI（天秤AI的カラム）
  ├── 自分メモ入力UI
  └── MDエクスポート
        │
        ▼  （/api/generate へリクエスト）
  Cloudflare Pages Functions（APIプロキシ）
    └── 環境変数から APIキー読み込み
        │
        ▼  （サーバーサイドからリクエスト）
  ZAI GLM-5 API × 視点数（3〜4並列）
```

- **ホスティング**: Cloudflare Pages（SPA配信 + Functions）
- **APIプロキシ**: Cloudflare Pages Functions（`functions/` ディレクトリ）
- **APIキー管理**: Cloudflare の環境変数（ブラウザに露出しない）
- **データベース: なし**（出力はMDファイルダウンロードで管理）

---

## 2. フロントエンド


| 項目                 | 選定                    | 理由                              |
| ------------------ | --------------------- | ------------------------------- |
| **フレームワーク**        | React + Vite          | SPA1画面で十分。Next.jsのSSR/ルーティングは不要 |
| **言語**             | TypeScript            | 型安全。APIレスポンスの構造管理に有用            |
| **スタイリング**         | Tailwind CSS          | ユーティリティベースで素早くレイアウト構築           |
| **Markdownレンダリング** | react-markdown（または類似） | 生成結果のプレビュー用                     |


---

## 3. デプロイ・インフラ


| 項目          | 選定                                  | 理由                                          |
| ----------- | ----------------------------------- | ------------------------------------------- |
| **ホスティング**  | Cloudflare Pages                    | 無料枠が広い。ストリーミングレスポンスとの相性が良い                  |
| **APIプロキシ** | Cloudflare Pages Functions          | `functions/` に1ファイル置くだけ。CORSの問題も解消          |
| **APIキー管理** | Cloudflare 環境変数                     | ダッシュボードまたは `wrangler secret` で設定。ブラウザに露出しない |
| **デプロイ方法**  | GitHub連携 or `wrangler pages deploy` | pushで自動デプロイ、またはCLIから手動デプロイ                  |


---

## 4. AI API


| 項目         | 選定                                            | 理由                    |
| ---------- | --------------------------------------------- | --------------------- |
| **モデル**    | ZAI GLM-5                                     | 長文コンテキスト対応。コスト面でも有利   |
| **呼び出し方式** | Pages Functions → GLM-5 API（SSE / streaming）  | サーバーサイドから呼ぶのでCORS問題なし |
| **並列実行**   | フロントから視点数分のリクエストを同時発火 → 各Functionが並列にGLM-5を呼ぶ | 天秤AI的な同時表示を実現         |


---

## 5. 主要な実装ポイント

### 5.1 ストリーミング並列表示

```
[生成ボタン押下]
  → フロントから /api/generate に視点数分のfetchを同時発火
  → 各Pages FunctionがGLM-5 APIにリクエスト
  → GLM-5のストリームをそのままフロントに中継
  → 各カラムがリアルタイム更新
```

- 各視点のストリームは独立したReact stateで管理
- 1つの視点がエラーになっても他は継続

### 5.2 レンズ（視点）設定

- 既定4レンズはアプリ内にハードコード（初期値として）
- ユーザーがレンズ名＋説明を編集 → localStorageに保存
- 各レンズの説明がそのままAPIリクエストのシステムプロンプトに挿入される

### 5.3 MDエクスポート

- 全視点の生成結果＋自分メモを結合してMarkdown文字列を構築
- Blobを生成してダウンロードリンクを作成
- ファイル名: `多視点メモ_YYYY-MM-DD_HHmm.md`

---

## 6. ディレクトリ構成（案）

```
multi-lens-memo/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── wrangler.toml              # Cloudflare Pages設定
├── functions/
│   └── api/
│       └── generate.ts        # APIプロキシ（GLM-5へ中継）
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── TextInput.tsx        # 素材テキスト入力
│   │   ├── LensConfig.tsx       # 視点（レンズ）設定パネル
│   │   ├── LensColumn.tsx       # 各視点のストリーミング表示カラム
│   │   ├── LensGrid.tsx         # カラムを横並びにするグリッド
│   │   ├── ContextPanel.tsx     # 左端コンテキスト表示（独立スクロール）
│   │   ├── UserMemo.tsx         # 自分メモカラム（トグル表示）
│   │   ├── MemoToggle.tsx       # 自分メモ ON/OFF トグルボタン
│   │   └── ExportButton.tsx     # MDダウンロードボタン
│   ├── hooks/
│   │   └── useStreamingLens.ts  # 1視点分のストリーミングfetchロジック
│   ├── lib/
│   │   ├── api.ts               # /api/generate への呼び出し
│   │   ├── lenses.ts            # 既定レンズ定義・localStorage管理
│   │   └── export.ts            # MDファイル生成ロジック
│   └── types/
│       └── index.ts             # 型定義
└── public/
```

---

## 7. 開発ステップ（案）


| ステップ       | 内容                                                 |
| ---------- | -------------------------------------------------- |
| **Step 1** | Vite + React + TypeScript + Tailwind のプロジェクトセットアップ |
| **Step 2** | Cloudflare Pages Functions でAPIプロキシ作成（GLM-5への中継確認） |
| **Step 3** | テキスト入力 + 1視点だけのストリーミング生成（最小動作確認）                   |
| **Step 4** | 4視点の並列ストリーミング + 横並びカラムUI                           |
| **Step 5** | レンズ設定のカスタマイズUI + localStorage保存                    |
| **Step 6** | 自分メモ入力欄 + MDエクスポート                                 |
| **Step 7** | UI仕上げ + Cloudflare Pagesへデプロイ                      |


---

## 8. 未決定・要検討

- GLM-5 APIのストリーミングレスポンス形式の確認（SSE互換か）
- レンズ数の上限（UIの横幅制約。モバイル対応するかどうか）
- トークン推定コスト表示の実装有無（MVP後でもよい）

