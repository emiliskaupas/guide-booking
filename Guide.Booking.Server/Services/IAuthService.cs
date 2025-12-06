using Backend.Models;

namespace Backend.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(string username, string email, string password);
        Task<User?> LoginAsync(string email, string password);
        string GenerateJwtToken(User user);
        string GenerateRefreshToken();
        Task<User?> ValidateRefreshTokenAsync(string refreshToken);
        Task SaveRefreshTokenAsync(User user, string refreshToken);
    }
}
