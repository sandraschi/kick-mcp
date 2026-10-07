import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLogger } from "@/context/LoggerContext";
import { cn } from "@/lib/utils";

export function Log() {
  const { entries, clear } = useLogger();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Log</h1>
          <p className="text-sm text-muted-foreground">
            {entries.length} entry{entries.length !== 1 ? "ies" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="text-center py-12 text-muted-foreground text-sm">
          <p>No log entries. Interact with the dashboard to see events.</p>
        </Card>
      ) : (
        <div className="space-y-1 font-mono text-xs">
          {[...entries].reverse().map((e) => (
            <div
              key={e.id}
              className="flex gap-2 rounded px-2 py-1.5 hover:bg-secondary/40 transition-colors"
            >
              <span className="text-muted-foreground shrink-0 w-16">{e.ts.slice(11, 19)}</span>
              <span
                className={cn(
                  "uppercase w-12 shrink-0 font-semibold",
                  e.level === "error" && "text-red-400",
                  e.level === "warn" && "text-amber-400",
                  e.level === "debug" && "text-slate-400",
                )}
              >
                {e.level}
              </span>
              <span className="break-all">{e.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
