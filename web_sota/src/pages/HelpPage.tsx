import { BookOpen, Code, Terminal, Wrench } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

const tools = [
  { name: "kick_get_categories", desc: "Search/list streaming categories." },
  { name: "kick_get_category", desc: "Get category details by ID." },
  { name: "kick_get_channels", desc: "Get channel info by IDs or slugs." },
  { name: "kick_update_channel", desc: "Update stream title/category/tags." },
  { name: "kick_get_stream_key", desc: "Get stream URL and key." },
  { name: "kick_get_livestreams", desc: "Query live streams with filters." },
  { name: "kick_get_livestream_stats", desc: "Total live stream count." },
  { name: "kick_get_users", desc: "Get user profiles." },
  { name: "kick_send_chat_message", desc: "Send a chat message." },
  { name: "kick_delete_chat_message", desc: "Delete a chat message." },
  { name: "kick_ban_user", desc: "Ban/timeout user from chat." },
  { name: "kick_unban_user", desc: "Unban user from chat." },
  { name: "kick_get_channel_rewards", desc: "List channel point rewards." },
  { name: "kick_create_channel_reward", desc: "Create a point reward." },
  { name: "kick_update_channel_reward", desc: "Update a point reward." },
  { name: "kick_delete_channel_reward", desc: "Delete a point reward." },
  { name: "kick_get_channel_reward_redemptions", desc: "List reward redemptions." },
  { name: "kick_accept_channel_reward_redemption", desc: "Accept redemptions." },
  { name: "kick_reject_channel_reward_redemption", desc: "Reject redemptions." },
  { name: "kick_get_leaderboard", desc: "View Kicks gifting leaderboard." },
  { name: "kick_get_event_subscriptions", desc: "List webhook subscriptions." },
];

export function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Reference</h1>
        <p className="text-sm text-muted-foreground">All 21 MCP tools provided by kick-mcp.</p>
      </div>

      <Card className="p-5 space-y-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Terminal className="h-4 w-4 text-primary" />
          Quick Start
        </CardTitle>
        <div className="text-sm space-y-2 text-muted-foreground">
          <p>Start the backend server:</p>
          <pre className="bg-background/80 rounded-lg px-4 py-3 text-xs text-foreground font-mono">
            uv run -m kick_mcp --http --port 10968
          </pre>
          <p>Then start the frontend (separate terminal):</p>
          <pre className="bg-background/80 rounded-lg px-4 py-3 text-xs text-foreground font-mono">
            cd web_sota{"\n"}npm run dev
          </pre>
          <p>
            Configure credentials in <code className="text-primary">.env</code>:
          </p>
          <pre className="bg-background/80 rounded-lg px-4 py-3 text-xs text-foreground font-mono">
            KICK_MCP_CLIENT_ID=your_client_id{"\n"}KICK_MCP_CLIENT_SECRET=your_client_secret
          </pre>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-primary" />
          All Tools
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tools.map((t) => (
            <div key={t.name} className="flex items-start gap-2 text-sm py-1.5">
              <Code className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-mono text-xs text-primary">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BookOpen className="h-4 w-4 text-primary" />
          Resources
        </CardTitle>
        <div className="text-sm space-y-1">
          <a
            href="https://docs.kick.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Kick API Documentation →
          </a>
          <a
            href="https://github.com/KickEngineering/KickDevDocs"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            GitHub: KickEngineering/KickDevDocs →
          </a>
          <a
            href="https://kick.com/settings/developer"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-primary hover:underline"
          >
            Kick Developer Apps →
          </a>
        </div>
      </Card>
    </div>
  );
}
