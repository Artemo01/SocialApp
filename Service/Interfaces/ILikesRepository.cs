using Service.DTOs;
using Service.Helpers;
using Service.Models;

namespace Service.Interfaces;

public interface ILikesRepository
{
    Task<UserLike?> GetUserLike(int sourceUserId, int targetUserId);
    Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
    Task<IEnumerable<int>> GetCurrentUserLikesIds(int currentUserId);
    void DeleteLike(UserLike like);
    void AddLike(UserLike like);
}