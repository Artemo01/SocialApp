using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service.Models;

namespace Service.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
            .OrderBy(user => user.UserName)
            .Select(user => new
            {
                user.Id,
                Username = user.UserName,
                Roles = user.UserRoles.Select(userRole => userRole.Role.Name)
            }).ToListAsync();
        
        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("Roles cannot be empty");
        
        var selectedRoles = roles.Split(",").ToArray();
        
        var user = await userManager.FindByNameAsync(username);
        
        if (user == null) return BadRequest("User not found");

        var userRoles = await userManager.GetRolesAsync(user);
        
        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        
        if(!result.Succeeded) return BadRequest("Failed to add to roles");
        
        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        
        if (!result.Succeeded) return BadRequest("Failed to remove from roles");
        
        return Ok(await userManager.GetRolesAsync(user));
    }
    
    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        return Ok("Admins or moderators can see this");
    }
}