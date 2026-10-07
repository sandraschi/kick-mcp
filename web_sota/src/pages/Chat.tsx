import { MessageSquare, Send, Download, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

const LS_KEY = "kick-mcp-chat-history";
const PERS_KEY = "kick-mcp-chat-personality";

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
  type?: string;
  ts: string;
}

const PERSONALITIES = [
  { id: "streamer", label: "Streamer", prompt: "You are a live streamer engaging with chat." },
  { id: "moderator", label: "Moderator", prompt: "You are a chat moderator. Be professional and clear." },
  { id: "quick-summarizer", label: "Quick Summarizer", prompt: "Keep responses brief." },
  { id: "custom", label: "Custom", prompt: "" },
];

const EXAMPLE_PROMPTS = [
  { group: "Messages", items: ["Send a welcome message", "Announce stream starting soon", "Thank a viewer for following"] },
  { group: "Moderation", items: ["Warn about chat rules", "Timeout a spammer", "Enable slow mode"] },
  { group: "Interactive", items: ["Run a chat poll", "Start a prediction", "Shoutout the latest sub"] },
];

function loadHistory(): HistoryEntry[] { try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : []; } catch { return []; } }
function saveHistory(msgs: HistoryEntry[]) { try { localStorage.setItem(LS_KEY, JSON.stringify(msgs.slice(-100))); } catch {} }
function loadPersonality(): string { try { return localStorage.getItem(PERS_KEY) || "streamer"; } catch { return "streamer"; } }

export function Chat() {
  const { log } = useLogger();
  const [content, setContent] = useState("");
  const [broadcasterId, setBroadcasterId] = useState("");
  const [type, setType] = useState<"bot" | "user">("bot");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [personalityId, setPersonalityId] = useState(() => loadPersonality());
  const bottomRef = useRef<HTMLDivElement>(null);

  useState(() => { saveHistory(history); });
  useState(() => { localStorage.setItem(PERS_KEY, personalityId); });

  const send = async () => {
    if (!content.trim()) return;
    setSending(true);
    setResponse(null);
    const entry: HistoryEntry = { role: "user", content: content.trim(), type, ts: new Date().toISOString() };
    try {
      const args: Record<string, unknown> = { content: content.trim(), type };
      if (type === "user" && broadcasterId.trim()) {
        args.broadcaster_user_id = Number(broadcasterId.trim());
      }
      const res = await callTool("kick_send_chat_message", args);
      setResponse(res as any);
      log("info", `Chat: message sent (type=${type})`);
      setHistory(prev => [...prev, entry, { role: "assistant", content: (res as any)?.result?.success ? "Message sent successfully" : "Message failed", ts: new Date().toISOString() }]);
      if ((res as any)?.result?.success) setContent("");
    } catch (e) {
      log("error", `Chat send: ${e}`);
      setHistory(prev => [...prev, entry, { role: "assistant", content: `Error: ${e}`, ts: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const exportChat = () => {
    const text = history.map(m => `${m.role === "user" ? "You" : "Bot"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kick-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-testid="chat-page">
      <div className="flex items-center justify-between">
        <PageHero title="Chat" lead="Send a chat message to a Kick channel." eyebrow="Interaction">
          <div className="space-y-3 max-w-md" data-testid="chat-controls">
            <div className="flex gap-2">
              <select
                className="rounded-md border border-input bg-background/60 px-3 h-9 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value as "bot" | "user")}
              >
                <option value="bot">Bot</option>
                <option value="user">User</option>
              </select>
              {type === "user" && (
                <Input
                  placeholder="Broadcaster User ID"
                  className="flex-1 h-9"
                  value={broadcasterId}
                  onChange={(e) => setBroadcasterId(e.target.value)}
                />
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Message content (max 500 chars)"
                className="flex-1 h-9"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                data-testid="chat-input"
              />
              <Button size="sm" onClick={send} disabled={sending || !content.trim()} data-testid="chat-send">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PageHero>
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded border border-purple-800/50" data-testid="skill-badge">kick-mcp</span>
          <select value={personalityId} onChange={(e) => setPersonalityId(e.target.value)} className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200" data-testid="personality-select">
            {PERSONALITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={exportChat} disabled={history.length === 0} className="h-8 text-xs gap-1" data-testid="chat-export">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setHistory([])} disabled={history.length === 0} className="h-8 text-xs gap-1 text-red-400 border-red-900/30 hover:bg-red-950/20" data-testid="chat-clear">
            <Trash2 className="h-3 w-3" /> Clear
          </Button>
        </div>
      </div>

      {response && (
        <Card className="p-4 space-y-2" data-testid="dashboard">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className={cn("font-medium", (response as any)?.result?.success ? "text-green-400" : "text-red-400")}>
              {(response as any)?.result?.success ? "Sent" : "Failed"}
            </span>
          </div>
          <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
            {JSON.stringify(response, null, 2)}
          </pre>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="p-4 space-y-2" data-testid="chat-messages">
          <h3 className="text-sm font-semibold text-slate-300">History</h3>
          {history.map((h, i) => (
            <div key={i} className="text-xs text-slate-400 border-b border-slate-800 pb-1">
              <span className="font-medium text-slate-300">{h.role === "user" ? "You" : "Bot"}:</span> {h.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </Card>
      )}

      <div className="flex flex-wrap gap-1" data-testid="example-prompts">
        {EXAMPLE_PROMPTS.map((g) => g.items.map((p, i) => (
          <button key={`${g.group}-${i}`} type="button" onClick={() => setContent(p)} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 transition-colors">{p}</button>
        )))}
      </div>
    </div>
  );
}

function cn(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
