using System.Collections.Concurrent;

namespace Backend.Middleware
{
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RateLimitingMiddleware> _logger;
        private static readonly ConcurrentDictionary<string, RequestInfo> _clients = new();
        private static readonly int _requestLimit = 10; // Max requests
        private static readonly TimeSpan _timeWindow = TimeSpan.FromMinutes(1); // Per time window

        public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Only apply rate limiting to sensitive endpoints
            var path = context.Request.Path.Value?.ToLower() ?? string.Empty;
            if (path.Contains("/auth/login") || path.Contains("/auth/register"))
            {
                var clientId = GetClientIdentifier(context);
                var requestInfo = _clients.GetOrAdd(clientId, new RequestInfo());

                lock (requestInfo)
                {
                    var now = DateTime.UtcNow;
                    
                    // Remove old requests outside the time window
                    requestInfo.RequestTimes.RemoveAll(time => now - time > _timeWindow);

                    // Check if limit exceeded
                    if (requestInfo.RequestTimes.Count >= _requestLimit)
                    {
                        _logger.LogWarning($"Rate limit exceeded for client: {clientId}");
                        context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                        context.Response.Headers["Retry-After"] = _timeWindow.TotalSeconds.ToString();
                        return;
                    }

                    // Add current request
                    requestInfo.RequestTimes.Add(now);
                }

                // Cleanup old client records periodically
                CleanupOldRecords();
            }

            await _next(context);
        }

        private static string GetClientIdentifier(HttpContext context)
        {
            // Use IP address as identifier (or could use combination of IP + User-Agent)
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            return ipAddress;
        }

        private static void CleanupOldRecords()
        {
            // Cleanup records that haven't been accessed in 10 minutes
            var cutoff = DateTime.UtcNow - TimeSpan.FromMinutes(10);
            foreach (var kvp in _clients)
            {
                if (kvp.Value.LastAccess < cutoff)
                {
                    _clients.TryRemove(kvp.Key, out _);
                }
            }
        }

        private class RequestInfo
        {
            public List<DateTime> RequestTimes { get; } = new();
            public DateTime LastAccess { get; set; } = DateTime.UtcNow;

            public RequestInfo()
            {
                RequestTimes = new List<DateTime>();
            }
        }
    }
}
