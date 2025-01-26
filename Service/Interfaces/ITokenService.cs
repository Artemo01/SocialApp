using Service.Models;

namespace Service.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}