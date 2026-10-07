import { Activity, Gamepad2, Loader2, Monitor, RefreshCw, Signal, Tv, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/ui/card";
import { useLogger } from "@/context/LoggerContext";

type KPI = { label: string; value: string | number; icon: typeof Activity };

export function Dashboard() {
  const { log } = useLogger();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [liveStreams, setLiveStreams] = useState<Record<string, unknown>[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, streamsRes] = await Promise.allSettled([
        callTool<{ result?: { total_count?: number } }>("kick_get_livestream_stats"),
        callTool<{
          result?: {
            livestreams?: Record<string, unknown>[];
            message?: string;
          };
        }>("kick_get_livestreams", { limit: 5 }),
      ]);

      if (statsRes.status === "fulfilled") {
        const total = (statsRes.value as any)?.result?.total_count ?? 0;
        setKpis([
          { label: "Live Now", value: total, icon: Signal },
          { label: "Categories", value: "—", icon: Gamepad2 },
          { label: "Top Streams", value: "5", icon: Monitor },
          { label: "API Status", value: "Online", icon: Activity },
        ]);
        log("info", `Dashboard: ${total} live streams`);
      } else {
        log("warn", `Dashboard stats failed: ${statsRes.reason}`);
        setKpis([
          { label: "Live Now", value: "—", icon: Signal },
          { label: "Categories", value: "—", icon: Gamepad2 },
          { label: "Top Streams", value: "5", icon: Monitor },
          { label: "API Status", value: "Offline", icon: Activity },
        ]);
      }

      if (streamsRes.status === "fulfilled") {
        const streams = (streamsRes.value as any)?.result?.livestreams ?? [];
        setLiveStreams(streams.slice(0, 5));
      }
    } catch (e) {
      log("error", `Dashboard: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [log]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      <PageHero title="kick-mcp Dashboard" lead="Live Kick.com streaming data at a glance.">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs hover:bg-secondary transition-colors"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </PageHero>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className="flex items-center gap-3 p-4">
            <k.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-xl font-bold">{String(k.value)}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Tv className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Live Streams</h2>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        {liveStreams.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">
            No live streams found. Start the backend and configure credentials.
          </p>
        ) : null}
        <div className="space-y-2">
          {liveStreams.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-4 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-2 w-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">
                    {(s as any).stream_title || (s as any).slug || `Stream #${i + 1}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(s as any).slug ? `/${(s as any).slug}` : ""}
                    {(s as any).category?.name ? ` · ${(s as any).category.name}` : ""}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm tabular-nums">{(s as any).viewer_count ?? "—"}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
