import { Award, Crown, Loader2, Trophy, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Card, CardTitle } from "@/components/ui/card";
import { useLogger } from "@/context/LoggerContext";

type Entry = { username?: string; gifted_amount?: number; rank?: number; user_id?: number };

export function Leaderboard() {
  const { log } = useLogger();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<{
    week?: Entry[];
    month?: Entry[];
    lifetime?: Entry[];
  }>({});

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callTool<{ result?: { leaderboard?: Record<string, unknown> } }>(
        "kick_get_leaderboard",
        { top: 10 },
      );
      const data = (res as any)?.result?.leaderboard as Record<string, Entry[]> | undefined;
      setLeaderboard(data ?? {});
      log("info", "Leaderboard loaded");
    } catch (e) {
      log("error", `Leaderboard: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [log]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const periods = [
    { key: "week", label: "This Week", icon: Award },
    { key: "month", label: "This Month", icon: Trophy },
    { key: "lifetime", label: "Lifetime", icon: Crown },
  ] as const;

  return (
    <div className="space-y-6">
      <PageHero
        title="Kicks Leaderboard"
        lead="Top gifters in the channel — weekly, monthly, and all time."
        eyebrow="Analytics"
      />

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {periods.map(({ key, label, icon: Icon }) => {
            const entries = leaderboard[key as keyof typeof leaderboard] ?? [];
            return (
              <Card key={key} className="p-4">
                <CardTitle className="flex items-center gap-2 text-sm mb-3">
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </CardTitle>
                {entries.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No data</p>
                ) : (
                  <div className="space-y-2">
                    {entries.map((e, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg bg-background/40"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-muted-foreground tabular-nums w-5 text-center">
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                          </span>
                          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{e.username ?? `User ${e.user_id}`}</span>
                        </div>
                        <span className="text-primary font-medium tabular-nums">
                          {e.gifted_amount ?? 0}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {entries.length > 0 && (
                  <div className="mt-2 text-[10px] text-muted-foreground text-right">
                    {entries.length} entr{entries.length === 1 ? "y" : "ies"}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
