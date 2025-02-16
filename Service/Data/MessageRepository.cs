using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Service.DTOs;
using Service.Helpers;
using Service.Interfaces;
using Service.Models;

namespace Service.Data;

public class MessageRepository(DataContext context, IMapper mapper) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(int id)
    {
        return await context.Messages.FindAsync(id);
    }

    public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = context.Messages.OrderByDescending(message => message.MessageSent).AsQueryable();

        query = messageParams.Container switch
        {
            "Inbox" => query.Where(message =>
                message.Recipient.UserName == messageParams.Username && message.RecipientDeleted == false),
            "Outbox" => query.Where(message =>
                message.Sender.UserName == messageParams.Username && message.SenderDeleted == false),
            _ => query.Where(
                message => message.Recipient.UserName == messageParams.Username && message.DateRead == null),
        };
        
        var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
        
        return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
    {
        var messages = await context.Messages
            .Include(message => message.Sender).ThenInclude(message => message.Photos)
            .Include(message => message.Recipient).ThenInclude(message => message.Photos)
            .Where(message => 
                message.RecipientUsername == currentUsername && 
                message.RecipientDeleted == false &&
                message.SenderUsername == recipientUsername || 
                message.SenderUsername == currentUsername && 
                message.SenderDeleted == false && 
                message.RecipientUsername == recipientUsername)
            .OrderBy(message => message.MessageSent)
            .ToListAsync();
        
        var unreadMessages = messages
            .Where(message => message.DateRead == null && message.RecipientUsername == currentUsername).ToList();

        if (unreadMessages.Count != 0)
        {
            unreadMessages.ForEach(message => message.DateRead = DateTime.UtcNow);
            await context.SaveChangesAsync();
        }
        
        return mapper.Map<IEnumerable<MessageDto>>(messages);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}