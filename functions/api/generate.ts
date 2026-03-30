/**
 * Cloudflare Pages Function: /api/generate
 *
 * 素材テキスト + システムプロンプトを受け取り、
 * GLM API に SSE ストリーミングでリクエストしてそのままフロントに中継する。
 */

interface Env {
  ZAI_API_KEY: string;
  ZAI_API_BASE_URL?: string;
  ZAI_MODEL?: string;
}

interface GenerateRequestBody {
  /** 素材テキスト（文字起こし・マークダウン等） */
  material: string;
  /** システムプロンプト（レンズ定義） */
  systemPrompt: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

/** OPTIONS プリフライトを処理 */
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

/** POST /api/generate */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // --- 環境変数チェック ---
  const apiKey = env.ZAI_API_KEY;
  if (!apiKey) {
    return jsonError("ZAI_API_KEY が設定されていません", 500);
  }

  const baseUrl =
    env.ZAI_API_BASE_URL ?? "https://open.bigmodel.cn/api/paas/v4";
  const model = env.ZAI_MODEL ?? "glm-4-flash";

  // --- リクエストボディのパース ---
  let body: GenerateRequestBody;
  try {
    body = await request.json<GenerateRequestBody>();
  } catch {
    return jsonError("リクエストボディが不正です（JSON パースエラー）", 400);
  }

  const { material, systemPrompt } = body;

  if (!material || typeof material !== "string") {
    return jsonError("material が未指定または不正です", 400);
  }
  if (!systemPrompt || typeof systemPrompt !== "string") {
    return jsonError("systemPrompt が未指定または不正です", 400);
  }

  // --- GLM API へのストリーミングリクエスト ---
  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: material },
        ],
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonError(`GLM API への接続に失敗しました: ${message}`, 502);
  }

  // --- アップストリームエラーをそのまま返す（body はここで一度だけ消費） ---
  if (!upstream.ok) {
    const errorText = await upstream.text();
    return new Response(errorText, {
      status: upstream.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
    });
  }

  const streamBody = upstream.body;
  if (!streamBody) {
    return jsonError("GLM API からストリームボディを取得できませんでした", 502);
  }

  // --- SSE ストリームをフロントにそのまま中継 ---
  return new Response(streamBody, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
};

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}
