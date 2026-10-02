# Per-repo fleet start config for kick-mcp
# Edit ports/backend target here - start.ps1 is fleet-standard.
@{
    Name         = 'kick-mcp'
    BackendPort  = 10968
    FrontendPort = 10969
    HealthPath   = '/health'
    WebRoot      = 'web_sota'
    Backend = @{
        Kind       = 'module-serve'
        Module     = 'kick_mcp'
        ServeArgs  = @('--http', '--port', '10968')
        SyncExtras = @('dev')
    }
    Frontend = @{
        Kind           = 'vite-npm'
        PackageManager = 'npm'
        PortEnvVar     = 'VITE_PORT'
        ApiTargetEnv   = 'VITE_API_TARGET'
    }
}
