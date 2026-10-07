const TIMEOUT_MS = 30_000;

async function parseErr(r: Response): Promise<string> {
  try {
    const text = await r.text();
    try {
      const j = JSON.parse(text);
      if (j && typeof j.detail === "string") return j.detail;
      return JSON.stringify(j);
    } catch {
      return text || `HTTP ${r.status}`;
    }
  } catch {
    return `HTTP ${r.status}`;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...init, signal: controller.signal })
    .catch((e) => {
      if (e instanceof DOMException && e.name === "AbortError") {
        throw new Error(`Request timed out after ${TIMEOUT_MS / 1000}s`);
      }
      throw e;
    })
    .finally(() => clearTimeout(timer));
}

export async function apiGet<T>(path: string): Promise<T> {
  const r = await fetchWithTimeout(`${path}`);
  if (!r.ok) throw new Error(await parseErr(r));
  return r.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetchWithTimeout(`${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await parseErr(r));
  return r.json() as Promise<T>;
}

// Minimal MCP streamable-HTTP session handling.
// FastMCP 3.4 requires an initialize handshake + Mcp-Session-Id header on every
// request; bare JSON-RPC POSTs fail with "Missing session ID".
let _mcpSession: string | null = null;
let _mcpSessionPromise: Promise<string> | null = null;

async function _ensureMcpSession(): Promise<string> {
  if (_mcpSession) return _mcpSession;
  if (!_mcpSessionPromise) {
    _mcpSessionPromise = (async () => {
      const init = await fetchWithTimeout("/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "kick-webapp", version: "0.1.0" } },
        }),
      });
      _mcpSession = init.headers.get("Mcp-Session-Id") || init.headers.get("mcp-session-id");
      if (!_mcpSession) throw new Error("MCP session negotiation failed");
      await fetchWithTimeout("/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "Mcp-Session-Id": _mcpSession },
        body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
      });
      return _mcpSession;
    })();
  }
  return _mcpSessionPromise;
}

function _parseSse(text: string): any {
  let parsed: any = null;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("data: ")) {
      const payload = line.slice(6).trim();
      if (payload) {
        try { parsed = JSON.parse(payload); } catch { /* keep last valid */ }
      }
    }
  }
  if (parsed !== null) return parsed;
  try { return JSON.parse(text); } catch { return null; }
}

export async function callTool<T = Record<string, unknown>>(
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  const sid = await _ensureMcpSession();
  const r = await fetchWithTimeout("/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream", "Mcp-Session-Id": sid },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name, arguments: args } }),
  });
  if (!r.ok) throw new Error(await parseErr(r));
  const text = await r.text();
  const data = _parseSse(text);
  if (data?.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const content: Array<{ type?: string; text?: string }> = data?.result?.content ?? [];
  for (const block of content) {
    if (block && typeof block.text === "string") {
      try { return JSON.parse(block.text) as T; } catch { return block.text as unknown as T; }
    }
  }
  return (data?.result ?? data) as T;
}
