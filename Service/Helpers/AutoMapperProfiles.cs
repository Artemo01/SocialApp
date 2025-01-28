using AutoMapper;
using Service.DTOs;
using Service.Extensions;
using Service.Models;

namespace Service.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, MemberDto>()
            .ForMember(member => member.Age, option => 
                option.MapFrom(user => user.DateOfBirth.CalculateAge()))
            .ForMember(member => member.PhotoUrl, option => 
                option.MapFrom(user => user.Photos.FirstOrDefault(photo => photo.IsMain)!.Url));
        CreateMap<Photo, PhotoDto>();
    }
}