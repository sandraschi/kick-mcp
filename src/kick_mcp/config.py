from pydantic_settings import BaseSettings, SettingsConfigDict


class KickMCPSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="KICK_MCP_", env_file=".env")

    # OAuth 2.1 App Access Token credentials
    client_id: str = ""
    client_secret: str = ""

    # Direct Bearer Token (alternative to OAuth)
    access_token: str = ""

    # Server
    host: str = "127.0.0.1"
    port: int = 10968
    transport: str = "stdio"

    # Kick API
    api_base_url: str = "https://api.kick.com"
    oauth_base_url: str = "https://id.kick.com"
    timeout: int = 30


_settings: KickMCPSettings | None = None


def get_settings() -> KickMCPSettings:
    global _settings
    if _settings is None:
        _settings = KickMCPSettings()
    return _settings
