import { Globe, Loader2, Search, Tv, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

export function Livestreams() {
  const { log } = useLogger();
  const [streams, setStreams] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("viewer_count");
  const [limit, setLimit] = useState(10);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const args: Record<string, unknown> = { limit, sort };
      if (language) args.language = language;
      const res = await callTool<{ result?: { livestreams?: Record<string, unknown>[] } }>(
        "kick_get_livestreams",
        args,
      );
      const data = (res as any)?.result?.livestreams ?? [];
      setStreams(data);
      log("info", `Livestreams: ${data.length} results`);
    } catch (e) {
      log("error", `Livestreams: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [limit, sort, language, log]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-6">
      <PageHero
        title="Livestreams"
        lead="Browse live Kick.com streams. Filter by language, sort by viewers or start time."
        eyebrow="Discovery"
      >
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Language (en, de, ...)"
              className="w-40 pl-8 h-9 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-input bg-background/60 px-3 h-9 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="viewer_count">By Viewers</option>
            <option value="started_at">By Start Time</option>
          </select>
          <select
            className="rounded-md border border-input bg-background/60 px-3 h-9 text-sm"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <Button size="sm" onClick={fetch} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </PageHero>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && streams.length === 0 && (
        <Card className="text-center py-12 text-muted-foreground">
          <Tv className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No streams found.</p>
        </Card>
      )}

      <div className="space-y-2">
        {streams.map((s, i) => (
          <Card key={i} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-2 w-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">
                  {(s as any).stream_title || "Untitled Stream"}
                </div>
                <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                  {(s as any).slug && <span>/{(s as any).slug}</span>}
                  {(s as any).category?.name && <span>{(s as any).category.name}</span>}
                  {(s as any).language && <span>{(s as any).language}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm tabular-nums font-medium">
                  {(s as any).viewer_count ?? "—"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
