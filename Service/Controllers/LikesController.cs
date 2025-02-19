using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Extensions;
using Service.Helpers;
using Service.Interfaces;
using Service.Models;

namespace Service.Controllers;

public class LikesController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();
        
        if (sourceUserId == targetUserId) return BadRequest("You cannot like yourself");
        
        var existingLike = await unitOfWork.LikesRepository.GetUserLike(sourceUserId, targetUserId);

        if (existingLike == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId,
            };
            
            unitOfWork.LikesRepository.AddLike(like);
        }
        else
        {
            unitOfWork.LikesRepository.DeleteLike(existingLike);
        }
        
        if (await unitOfWork.Complete()) return Ok();
        
        return BadRequest("Failed to update like");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
    {
        return Ok(await unitOfWork.LikesRepository.GetCurrentUserLikesIds(User.GetUserId()));
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery] LikesParams likeParams)
    {
        likeParams.UserId = User.GetUserId();
        var users = await unitOfWork.LikesRepository.GetUserLikes(likeParams);
        
        Response.AddPaginationHeader(users);
        
        return Ok(users);
    }
}