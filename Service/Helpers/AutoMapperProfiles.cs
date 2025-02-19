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
        CreateMap<MemberUpdateDto, AppUser>();
        CreateMap<RegisterDto, AppUser>();
        CreateMap<string, DateOnly>().ConvertUsing(str => DateOnly.Parse(str));
        CreateMap<Message, MessageDto>()
            .ForMember(messageDto => messageDto.SenderPhotoUrl,
                option => option.MapFrom(message => 
                    message.Sender.Photos.FirstOrDefault(photo => photo.IsMain)!.Url))
            .ForMember(messageDto => messageDto.RecipientPhotoUrl,
                option => option.MapFrom(message =>
                    message.Recipient.Photos.FirstOrDefault(photo => photo.IsMain)!.Url));
        CreateMap<DateTime, DateTime>().ConvertUsing(date => DateTime.SpecifyKind(date, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>()
            .ConvertUsing(date => date.HasValue ? DateTime.SpecifyKind(date.Value, DateTimeKind.Utc) : null);
    }
}