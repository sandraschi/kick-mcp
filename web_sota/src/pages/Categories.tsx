import { Gamepad2, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { callTool } from "@/api/client";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLogger } from "@/context/LoggerContext";

export function Categories() {
  const { log } = useLogger();
  const [categories, setCategories] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const args: Record<string, unknown> = { limit: 50 };
      if (query) args.query = query;
      const res = await callTool<{ result?: { categories?: Record<string, unknown>[] } }>(
        "kick_get_categories",
        args,
      );
      const data = (res as any)?.result?.categories ?? [];
      setCategories(data);
      log("info", `Categories: ${data.length} results`);
    } catch (e) {
      log("error", `Categories: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [query, log]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <div className="space-y-6">
      <PageHero
        title="Categories"
        lead="Browse Kick streaming categories — games, activities, and more."
        eyebrow="Discovery"
      >
        <div className="flex gap-2">
          <Input
            placeholder="Search categories…"
            className="max-w-xs h-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button size="sm" onClick={fetch} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </PageHero>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!loading && categories.length === 0 && (
        <Card className="text-center py-12 text-muted-foreground">
          <Gamepad2 className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No categories found.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c, i) => (
          <Card key={i} className="p-4 space-y-1">
            <div className="text-sm font-medium truncate">
              {(c as any).name ?? `#${(c as any).id}`}
            </div>
            <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
              {Array.isArray((c as any).tags) &&
                (c as any).tags.length > 0 &&
                (c as any).tags.slice(0, 3).map((t: string) => (
                  <span key={t} className="bg-secondary px-1.5 py-0.5 rounded text-[10px]">
                    {t}
                  </span>
                ))}
            </div>
            <div className="text-[11px] text-muted-foreground">ID: {(c as any).id}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
