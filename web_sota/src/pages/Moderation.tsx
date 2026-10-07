import { Ban, Loader2, Shield, Undo2 } from "lucide-react";
import { useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

export function Moderation() {
  const { log } = useLogger();
  const [userId, setUserId] = useState("");
  const [broadcasterId, setBroadcasterId] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("");
  const [action, setAction] = useState<"ban" | "timeout" | "unban" | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = async (type: "ban" | "unban") => {
    if (!userId.trim() || !broadcasterId.trim()) return;
    setLoading(true);
    setAction(type);
    setResult(null);
    try {
      const args: Record<string, unknown> = {
        broadcaster_user_id: Number(broadcasterId.trim()),
        user_id: Number(userId.trim()),
      };
      if (type === "ban") {
        if (reason.trim()) args.reason = reason.trim();
        if (duration.trim()) args.duration_minutes = Number(duration.trim());
      }
      const method = type === "ban" ? "kick_ban_user" : "kick_unban_user";
      const res = await callTool(method, args);
      setResult(res as any);
      log("info", `Moderation: ${type} user ${userId}`);
    } catch (e) {
      log("error", `Moderation: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHero
        title="Moderation"
        lead="Ban, timeout, or unban users from a broadcaster's chat."
        eyebrow="Management"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg">
          <Input
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Broadcaster ID"
            value={broadcasterId}
            onChange={(e) => setBroadcasterId(e.target.value)}
            className="h-9"
          />
          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Timeout minutes (leave empty = permanent)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="max-w-xs h-9"
            type="number"
          />
          <Button size="sm" variant="secondary" onClick={() => execute("ban")} disabled={loading}>
            {loading && action === "ban" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            Ban
          </Button>
          <Button size="sm" variant="outline" onClick={() => execute("unban")} disabled={loading}>
            {loading && action === "unban" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Undo2 className="h-4 w-4" />
            )}
            Unban
          </Button>
        </div>
      </PageHero>

      {result && (
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span
              className={cn(
                "font-medium",
                (result as any)?.result?.success ? "text-green-400" : "text-red-400",
              )}
            >
              {(result as any)?.result?.success
                ? `${action === "ban" ? "Banned" : "Unbanned"} successfully`
                : "Failed"}
            </span>
          </div>
          {(result as any)?.result?.message && (
            <div className="text-xs text-muted-foreground">{(result as any).result.message}</div>
          )}
        </Card>
      )}
    </div>
  );
}

function cn(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}
