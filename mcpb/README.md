# kick-mcp (MCPB Bundle)

MCP server wrapping the Kick.com streaming platform API

## Usage

Add to \claude_desktop_config.json\:
\\\json
{
  "mcpServers": {
    "kick-mcp": {
      "command": "uv",
      "args": ["run", "--directory", "\D:\Dev\repos", "python", "-m", "kick_mcp"],
      "env": { "PYTHONPATH": "\D:\Dev\repos/src" }
    }
  }
}
\\\

## Tools

- **main**: main
- **get_api_summary**: get_api_summary
- **kick_get_categories**: kick_get_categories
- **kick_get_category**: kick_get_category
- **kick_get_channels**: kick_get_channels
- **kick_update_channel**: kick_update_channel
- **kick_get_stream_key**: kick_get_stream_key
- **kick_send_chat_message**: kick_send_chat_message
- **kick_delete_chat_message**: kick_delete_chat_message
- **kick_get_event_subscriptions**: kick_get_event_subscriptions
- **kick_get_leaderboard**: kick_get_leaderboard
- **kick_get_livestreams**: kick_get_livestreams
- **kick_get_livestream_stats**: kick_get_livestream_stats
- **kick_ban_user**: kick_ban_user
- **kick_unban_user**: kick_unban_user
- **kick_get_channel_rewards**: kick_get_channel_rewards
- **kick_create_channel_reward**: kick_create_channel_reward
- **kick_update_channel_reward**: kick_update_channel_reward
- **kick_delete_channel_reward**: kick_delete_channel_reward
- **kick_get_channel_reward_redemptions**: kick_get_channel_reward_redemptions
- **kick_accept_channel_reward_redemption**: kick_accept_channel_reward_redemption
- **kick_reject_channel_reward_redemption**: kick_reject_channel_reward_redemption
- **kick_get_users**: kick_get_users

## Requirements

- Python 3.12+
- uv
