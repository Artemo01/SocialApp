using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Service.DTOs;
using Service.Interfaces;
using Service.Models;

namespace Service.Data;

public class LikesRepository(DataContext context, IMapper mapper) : ILikesRepository
{
    public async Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<IEnumerable<MemberDto>> GetUserLikes(string predicate, int userId)
    {
        var likes = context.Likes.AsQueryable();

        switch (predicate)
        {
            case "liked":
                return await likes
                    .Where(like => like.SourceUserId == userId)
                    .Select(like => like.TargetUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
            case "likedBy":
                return await likes
                    .Where(like => like.TargetUserId == userId)
                    .Select(like => like.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
            default:
                var likeIds = await GetCurrentUserLikesIds(userId);
                return await likes
                    .Where(like => like.TargetUserId == userId && likeIds.Contains(like.SourceUserId))
                    .Select(like => like.SourceUser)
                    .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                    .ToListAsync();
        }
    }

    public async Task<IEnumerable<int>> GetCurrentUserLikesIds(int currentUserId)
    {
        return await context.Likes
            .Where(like => like.SourceUserId == currentUserId)
            .Select(like => like.TargetUserId)
            .ToListAsync();
    }

    public void DeleteLike(UserLike like)
    {
        context.Likes.Remove(like);
    }

    public void AddLike(UserLike like)
    {
        context.Likes.Add(like);
    }

    public async Task<bool> SaveChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}