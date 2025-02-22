using Microsoft.AspNetCore.Identity;

namespace Service.Models;

public class AppRole : IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}