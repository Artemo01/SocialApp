using Service.Models;

namespace Service.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}