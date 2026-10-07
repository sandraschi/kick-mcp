import { Loader2, Search, Users } from "lucide-react";
import { useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

export function Channels() {
  const { log } = useLogger();
  const [slug, setSlug] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!slug.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await callTool<{ result?: { channels?: Record<string, unknown>[] } }>(
        "kick_get_channels",
        { slug: [slug.trim()] },
      );
      const channels = (res as any)?.result?.channels ?? [];
      const ch = channels[0] ?? null;
      setResult(ch);
      log("info", `Channel lookup: ${slug} → ${ch ? "found" : "not found"}`);
    } catch (e) {
      log("error", `Channel lookup: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero title="Channels" lead="Look up Kick channels by slug." eyebrow="Discovery">
        <div className="flex gap-2">
          <Input
            placeholder="Channel slug (e.g. shroud)"
            className="max-w-xs h-9"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <Button size="sm" onClick={lookup} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Lookup
          </Button>
        </div>
      </PageHero>

      {result && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>{(result as any).slug}</CardTitle>
              <div className="text-xs text-muted-foreground">
                User ID: {(result as any).broadcaster_user_id}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Stream Title</div>
              <div className="font-medium truncate">{(result as any).stream_title || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Category</div>
              <div className="font-medium">{(result as any).category?.name || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Live</div>
              <div className="font-medium">
                {(result as any).stream?.is_live ? (
                  <span className="text-green-400">● Live</span>
                ) : (
                  "Offline"
                )}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Viewers</div>
              <div className="font-medium">{(result as any).stream?.viewer_count ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Subscribers (active)</div>
              <div className="font-medium">{(result as any).active_subscribers_count ?? "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Language</div>
              <div className="font-medium">{(result as any).stream?.language || "—"}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
