using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Extensions;
using Service.Helpers;
using Service.Interfaces;

namespace Service.Controllers;

[Authorize]
public class UsersController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task< ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    {
        userParams.CurrentUsername = User.GetUsername();
        var users = await unitOfWork.UserRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }
    
    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await unitOfWork.UserRepository.GetMemberAsync(username);
        
        if (user == null) return NotFound();
        
        return Ok(user);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await unitOfWork.UserRepository.GetUserByUserNameAsync(User.GetUsername());
        
        if(user == null) return BadRequest("User not found");
        
        mapper.Map(memberUpdateDto, user);
        
        if(await unitOfWork.Complete()) return NoContent();
        
        return BadRequest("Failed to update user");
    }
}