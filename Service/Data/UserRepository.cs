using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Service.DTOs;
using Service.Interfaces;
using Service.Models;

namespace Service.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Update(AppUser user)
    {
        context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await context.Users
            .Include(user => user.Photos)
            .ToListAsync();
    }

    public async Task<AppUser?> GetUserByIdAsync(int userId)
    {
        return await context.Users.FindAsync(userId);
    }

    public async Task<AppUser?> GetUserByUserNameAsync(string username)
    {
        return await context.Users
            .Include(user => user.Photos)
            .SingleOrDefaultAsync(user => user.UserName == username);
    }

    public async Task<IEnumerable<MemberDto>> GetMembersAsync()
    {
        return await context.Users.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<MemberDto?> GetMemberAsync(string username)
    {
        return await context.Users
            .Where(user => user.UserName == username)
            .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }
}