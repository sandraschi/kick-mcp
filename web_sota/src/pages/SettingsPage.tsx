import { ExternalLink, Key, Server } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  const settings = [
    {
      label: "Backend",
      items: [
        { key: "Backend URL", value: "http://127.0.0.1:10968" },
        { key: "MCP Path", value: "/mcp" },
        { key: "Transport", value: "Streamable HTTP" },
      ],
      icon: Server,
    },
    {
      label: "Authentication",
      items: [
        { key: "Method", value: "OAuth 2.1 / Bearer Token" },
        { key: "OAuth Server", value: "https://id.kick.com" },
        {
          key: "Scopes",
          value:
            "user:read, channel:read, chat:write, moderation:ban, kicks:read, channel:rewards:read/write, events:subscribe",
        },
      ],
      icon: Key,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Connection and configuration info for kick-mcp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map((s) => (
          <Card key={s.label} className="p-5 space-y-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <s.icon className="h-4 w-4 text-primary" />
              {s.label}
            </CardTitle>
            <div className="space-y-2">
              {s.items.map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.key}</span>
                  <code className="text-primary text-xs bg-secondary px-1.5 py-0.5 rounded">
                    {item.value}
                  </code>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 space-y-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ExternalLink className="h-4 w-4 text-primary" />
          Resources
        </CardTitle>
        <div className="space-y-1 text-sm">
          <a
            href="https://docs.kick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Kick API Docs →
          </a>
          <a
            href="https://kick.com/settings/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Kick Developer Portal →
          </a>
          <a
            href="https://github.com/KickEngineering/KickDevDocs"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            GitHub: KickEngineering/KickDevDocs →
          </a>
        </div>
      </Card>
    </div>
  );
}
