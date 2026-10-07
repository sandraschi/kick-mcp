import { Gem, Loader2, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

export function Rewards() {
  const { log } = useLogger();
  const [rewards, setRewards] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState("100");
  const [desc, setDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callTool<{ result?: { rewards?: Record<string, unknown>[] } }>(
        "kick_get_channel_rewards",
      );
      setRewards((res as any)?.result?.rewards ?? []);
      log("info", `Rewards: loaded`);
    } catch (e) {
      log("error", `Rewards fetch: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [log]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async () => {
    if (!title.trim() || !cost.trim()) return;
    setCreating(true);
    try {
      const args: Record<string, unknown> = {
        title: title.trim(),
        cost: Number(cost.trim()),
      };
      if (desc.trim()) args.description = desc.trim();
      const res = await callTool("kick_create_channel_reward", args);
      log("info", `Reward created: ${title}`);
      if ((res as any)?.result?.success) {
        setTitle("");
        setCost("100");
        setDesc("");
        fetch();
      }
    } catch (e) {
      log("error", `Reward create: ${e}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        title="Channel Rewards"
        lead="Manage Kick channel point rewards."
        eyebrow="Monetization"
      >
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={fetch} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </PageHero>

      <Card className="p-5 space-y-3">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Reward
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="h-9 sm:col-span-2"
          />
        </div>
        <Button size="sm" onClick={create} disabled={creating || !title.trim() || !cost.trim()}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gem className="h-4 w-4" />}
          Create
        </Button>
      </Card>

      <div className="space-y-2">
        {rewards.map((r, i) => (
          <Card key={i} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-medium">{(r as any).title}</div>
              <div className="text-xs text-muted-foreground">
                {(r as any).description || "No description"}
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm tabular-nums">
              <span className="text-primary font-medium">{(r as any).cost}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded",
                  (r as any).is_enabled
                    ? "bg-green-900/40 text-green-400"
                    : "bg-red-900/40 text-red-400",
                )}
              >
                {(r as any).is_enabled ? "Enabled" : "Disabled"}
              </span>
              <span className="text-xs text-muted-foreground">
                {(r as any).is_paused ? "Paused" : ""}
              </span>
            </div>
          </Card>
        ))}
        {!loading && rewards.length === 0 && (
          <Card className="text-center py-8 text-muted-foreground text-sm">No rewards yet.</Card>
        )}
      </div>
    </div>
  );
}

function cn(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
